# Code Review — Nainaism Blog

**Reviewer**: Opus (Role 5)
**Date**: 2026-02-07
**AC Status**: 14/14 Pass (confirmed by Test Engineer)

---

## File-by-File Review

### 1. `src/lib/og-image.ts` (New)

**Purpose**: satori + budoux による OG 画像生成ユーティリティ

- **Correctness**: budoux で日本語テキストを分割し、satori で SVG を生成、sharp で PNG に変換。ロジックは正しい。
- **Font fetching**: Google Fonts CSS をパースして truetype URL を抽出する方式。`fontCache` によるビルド内キャッシュあり。
- **Error handling**: フォント URL 抽出失敗時に `throw` している。fetch 失敗時のエラーハンドリングがない（後述 Should fix）。

| 分類 | 指摘 |
|------|------|
| **Should fix** | `getFont()`: `fetch()` の HTTP エラー（非 200）をチェックしていない。`res.ok` を確認すべき。Google Fonts CSS fetch と font binary fetch の両方で `!res.ok` 時に例外を投げる処理を追加推奨。現状、Google Fonts がダウンしている場合にビルドがわかりにくいエラーで失敗する可能性がある。 |
| **Should fix** | `getFont()`: 正規表現 `/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/` は Google Fonts の CSS 応答フォーマットに依存している。User-Agent を送らないことで truetype が返る前提だが、Google Fonts 側のフォーマット変更で壊れるリスクがある。コメントで前提条件が記載されているのは良い。将来的にはローカルフォントファイルにフォールバックすることを推奨（今回は Nit）。 |
| **Nit** | `fontCache` のモジュールレベル変数は `let` で宣言されているが、ビルド時にのみ使用されるため問題なし。 |
| **Nit** | `splitWithBudoux` 関数は `parser.parse` のラッパーだが、可読性向上に寄与しているので OK。 |

---

### 2. `src/pages/og/[...slug].png.ts` (New)

**Purpose**: Astro 静的エンドポイント。ビルド時に各記事の OG 画像を生成。

- **Correctness**: `prerender = true` によりビルド時に静的生成される。`getStaticPaths` で全記事のパスを生成。
- **Cache header**: `Cache-Control: public, max-age=31536000, immutable` は静的生成されるファイルに適切。

| 分類 | 指摘 |
|------|------|
| **Should fix** | L19: `png as unknown as BodyInit` — 二重キャスト (`unknown` 経由) は型安全性を損なう。`Uint8Array` は `BodyInit` に含まれる型なので、`new Response(png, { ... })` で直接渡せるはず。Astro の Response 型定義に問題がある場合でも、`as BodyInit` の単一キャストに留めるべき。 |
| **Nit** | サイトタイトル `'Nainaism'` がハードコードされている。`site.config.ts` の `theme.title` をインポートして使う方が保守性が高い。 |

---

### 3. `src/content/blog/hello-nainaism.mdx` (New)

**Purpose**: サンプル日本語ブログ記事

- **Correctness**: frontmatter の構造は `content.config.ts` のスキーマに準拠。タグは日本語（ブログ, 技術）。
- **Content**: 見出し、段落、コードブロック、順序リスト、リンクなど基本要素を網羅。

| 分類 | 指摘 |
|------|------|
| OK | 問題なし。 |

---

### 4. `wrangler.toml` (New)

**Purpose**: Cloudflare Pages デプロイ設定

- **Correctness**: `name`, `compatibility_date`, `compatibility_flags`, `[site] bucket` が正しく設定されている。
- **Security**: `nodejs_compat` フラグは Cloudflare Workers で Node.js API を使うために必要。問題なし。

| 分類 | 指摘 |
|------|------|
| OK | 問題なし。 |

---

### 5. `public/_headers` (New)

**Purpose**: Cloudflare Pages のキャッシュ・セキュリティヘッダー

- **Security headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` が全ページに適用。適切。
- **Cache**: `/_astro/*` に immutable キャッシュ、`/pagefind/*` に 1 時間、`/favicon/*` に 1 日。合理的。

| 分類 | 指摘 |
|------|------|
| **Nit** | `Content-Security-Policy` ヘッダーの追加を将来的に検討。現時点では不要（テーマの外部リソース依存を精査する必要があるため）。 |
| **Nit** | `/og/*` パスに対するキャッシュヘッダーが未設定。OG 画像は prerender 済みで変更頻度が低いため、長期キャッシュを設定してもよい。ただし Astro が `dist/og/` に直接出力しているため、CDN 側で自動キャッシュされる可能性あり。 |

---

### 6. `.node-version` (New)

**Purpose**: Node.js バージョン指定 (22)

| 分類 | 指摘 |
|------|------|
| OK | Cloudflare Pages ビルド環境で Node 22 を使用するための指定。問題なし。 |

---

### 7. `CHANGELOG.md` (New)

**Purpose**: 変更履歴

| 分類 | 指摘 |
|------|------|
| OK | 各タスクの変更内容が簡潔にまとめられている。問題なし。 |

---

### 8. `src/site.config.ts` (Modified)

**Purpose**: サイト設定のカスタマイズ

- title, author, description, locale, header menu, footer, share, waline が AC に沿って設定されている。

| 分類 | 指摘 |
|------|------|
| **Nit** | L101-102: `quote.server` に `dummyjson.com` が残っている。フッターのランダム引用機能で、英語の名言が表示される。日本語ブログとしては違和感がある可能性があるが、テーマのデフォルト機能であり AC 外なので Nit。 |
| **Nit** | L128: `waline.server` に元テーマの URL (`arthals.ink`) が残っている。`enable: false` なので動作には影響しないが、将来 enable する際に変更が必要。 |

---

### 9. `src/layouts/BlogPost.astro` (Modified)

**Purpose**: OG 画像メタタグの統合

- `heroImage` がある場合はそのソースを、ない場合は `/og/${id}.png` を `socialImage` として使用。

| 分類 | 指摘 |
|------|------|
| OK | ロジックは正しい。`typeof heroImage.src === 'string'` チェックで外部 URL と Astro image の両方に対応。 |

---

### 10. `tsconfig.json` (Modified)

**Purpose**: `@/lib/*` パスエイリアスの追加

| 分類 | 指摘 |
|------|------|
| OK | 既存のパスエイリアスパターンに従っている。問題なし。 |

---

### 11. `src/content.config.ts` (Modified)

**Purpose**: `docs` コレクションの削除

- `docs` コレクションが削除され、`blog` のみが残っている。

| 分類 | 指摘 |
|------|------|
| **Nit** | L19: `title: z.string().max(60)` — 日本語タイトルの場合、60 文字は十分だが、これはテーマ元の設定。変更不要。 |

---

### 12. `astro.config.ts` (Modified)

**Purpose**: Cloudflare アダプター設定

- `@astrojs/vercel` から `@astrojs/cloudflare` に変更。`imageService: 'compile'` でビルド時画像最適化。

| 分類 | 指摘 |
|------|------|
| **Should fix** | L42-46: `image.service.entrypoint` が `astro/assets/services/sharp` に設定されているが、`@astrojs/cloudflare` の `imageService: 'compile'` と組み合わせた場合、Cloudflare Workers ランタイムで sharp が利用できないため、SSR 時の動的画像最適化で問題が発生する可能性がある。現状 `prerender: true` で大半のページがビルド時生成されるため実害は低いが、SSR ルート（RSS 等）から画像処理を呼ぶ場合に問題になりうる。`imageService: 'compile'` 設定と `image.service` 設定の二重指定を整理することを推奨。 |

---

### 13. `preset/scripts/cacheAvatars.ts` (Modified)

**Purpose**: Buffer 型エラーの修正（`Buffer` -> `Uint8Array`）

- L142: `new Uint8Array(await response.arrayBuffer())` — `Buffer` の代わりに `Uint8Array` を使用。

| 分類 | 指摘 |
|------|------|
| OK | 正しい修正。`writeFile` は `Uint8Array` を受け付ける。 |

---

### 14. `package.json` (Modified)

**Purpose**: 依存関係の変更

- `@astrojs/cloudflare` 追加（`@astrojs/vercel` 削除）
- `satori`, `budoux`, `sharp` 追加

| 分類 | 指摘 |
|------|------|
| **Nit** | `@astrojs/vercel` が `package.json` から削除されていることを確認済み（grep で未検出）。クリーン。 |
| **Nit** | `sharp` が `dependencies` に含まれているが、OG 画像生成はビルド時のみ（`prerender: true`）。`devDependencies` でも動作するが、`astro.config.ts` の `image.service` でもランタイム参照されるため `dependencies` で問題なし。 |

---

## Summary

### Must Fix

なし。

### Should Fix (3 items) — **全件対応済み** ✅

| # | ファイル | 内容 | 状態 |
|---|---------|------|------|
| S1 | `src/lib/og-image.ts` | `getFont()` の fetch 応答に `res.ok` チェックを追加し、HTTP エラー時に明確なエラーメッセージを出す | ✅ 対応済み (2026-02-07) |
| S2 | `src/pages/og/[...slug].png.ts` | `png as unknown as BodyInit` の二重キャストを `as BodyInit` に修正 | ✅ 対応済み (2026-02-07) |
| S3 | `astro.config.ts` | `image.service` と `cloudflare({ imageService: 'compile' })` の二重指定を整理。`image.service` ブロックを削除 | ✅ 対応済み (2026-02-07) |

| # | ファイル | 内容 |
|---|---------|------|
| S1 | `src/lib/og-image.ts` | `getFont()` の fetch 応答に `res.ok` チェックを追加し、HTTP エラー時に明確なエラーメッセージを出す |
| S2 | `src/pages/og/[...slug].png.ts` | `png as unknown as BodyInit` の二重キャストを `as BodyInit` または直接渡しに修正 |
| S3 | `astro.config.ts` | `image.service` と `cloudflare({ imageService: 'compile' })` の二重指定を整理。`image.service` ブロックの削除を検討（`imageService: 'compile'` が sharp をビルド時に使う設定を内包するため） |

### Nit (6 items)

| # | ファイル | 内容 |
|---|---------|------|
| N1 | `src/pages/og/[...slug].png.ts` | サイトタイトルのハードコードを `site.config.ts` からのインポートに変更 |
| N2 | `src/site.config.ts` | フッター引用の `dummyjson.com` が英語名言を返す（日本語ブログとの不一致） |
| N3 | `src/site.config.ts` | waline server URL に元テーマの URL が残存（`enable: false` なので無害） |
| N4 | `public/_headers` | `/og/*` パスのキャッシュヘッダー追加を検討 |
| N5 | `public/_headers` | 将来的に CSP ヘッダーの追加を検討 |
| N6 | `src/lib/og-image.ts` | Google Fonts 依存のフォント取得。将来的にローカルフォントへのフォールバックを検討 |

---

## Risk Notes

### Security
- 秘密情報の漏洩: なし。`.gitignore` で `.env` / `.env.production` が除外されている。
- XSS / インジェクション: OG 画像生成で `title` が satori の JSX-like 構造に渡されるが、SVG 生成であり HTML としてレンダリングされないため、XSS リスクは低い。
- フレーム保護: `X-Frame-Options: DENY` が設定済み。

### Performance
- OG 画像はビルド時に prerender されるため、ランタイムの負荷なし。
- Google Fonts の fetch はビルド時のみ。`fontCache` でビルド内の重複 fetch を防止。
- クライアント JS/CSS 合計 2.1MB（pagefind, テーマ含む）。最大バンドル 82KB (gzip 29KB)。許容範囲。
- sharp はネイティブバイナリで `node_modules` サイズが大きいが、ビルド時のみの使用であり問題なし。

---

## Sign-off

**Must fix: 0 件**

全 AC 項目 (14/14) が Pass であり、Must fix はありません。
Should fix 3 件は品質向上のための推奨事項であり、マージをブロックしません。

**Approved** -- マージ可。Should fix は後続のイテレーションで対応を推奨します。
