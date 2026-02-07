# Test Plan — Nainaism Blog

## AC ↔ テスト マッピング

| AC   | テスト方法            | 自動/手動 | 状態    |
|------|-----------------------|-----------|---------|
| AC-1 | `npm run build` 実行  | 自動      | **Pass** |
| AC-2 | site.config.ts の値確認 + ビルド出力の HTML 内検索 | 自動 | **Pass** |
| AC-3 | ビルド出力の `<html lang=` 属性確認 | 自動 | **Pass** |
| AC-4 | ブログ記事ページの日付表示を grep | 自動 | **Pass** |
| AC-5 | サンプル MDX 記事のレンダリング確認 | 自動 | **Pass** |
| AC-6 | ビルド出力に dark mode トグルコード含有確認 | 自動 | **Pass** |
| AC-7 | ビルド後 pagefind インデックスに日本語が含まれるか確認 | 自動 | **Pass** |
| AC-8 | OG 画像ファイルの生成確認 | 自動 | **Pass** |
| AC-9 | `/blog/hello-nainaism/` ページが存在し日本語コンテンツを含む | 自動 | **Pass** |
| AC-10 | wrangler.toml の存在・内容確認 | 自動 | **Pass** |
| AC-11 | RSS `<link>` タグの存在 + `/rss.xml` ルート確認 | 自動 | **Pass** |
| AC-12 | `sitemap-index.xml` / `sitemap-0.xml` の生成確認 | 自動 | **Pass** |
| AC-13 | ビルドサイズ確認（dist: 6.0MB, client assets: 2.1MB） | 自動 | **Pass** |
| AC-14 | viewport メタタグ + レスポンシブ CSS クラス確認 | 自動 | **Pass** |

## テスト実行ログ

**実行日**: 2026-02-07
**実行者**: Test Engineer (Haiku)
**ビルドコマンド**: `npm run build`

### AC-1: ビルド成功
- `astro-pure check`: 0 errors, 0 warnings, 0 hints
- `astro check`: pass
- `astro build`: Complete!
- Pagefind indexing: 5 pages, 175 words, 1 language (ja)
- Sitemap: generated

### AC-2: サイトタイトル・ドメイン
- `<title>` に "Nainaism" 含有: `Blog • Nainaism`, `Nainaism へようこそ • Nainaism`
- `<meta property="og:site_name" content="Nainaism">`
- `<link rel="canonical" href="https://nainaism.com/...">`
- ドメイン nainaism.com が OG URL, canonical URL, sitemap で使用

### AC-3: 日本語ロケール
- 全 HTML ファイルで `<html lang="ja">` を確認
- `<meta content="ja_JP" property="og:locale">`

### AC-4: 日本語日付フォーマット
- ブログ記事: `2026年2月7日` (time 要素内)
- ブログ一覧: `2026年2月7日`
- アーカイブ: `2026年2月7日`

### AC-5: MDX レンダリング
- `/blog/hello-nainaism/index.html` が正常にレンダリング
- 見出し (h2, h3)、リスト (ul, ol)、コードブロック、リンクが正しく出力
- 目次 (TOC) が自動生成されている

### AC-6: ダークモードトグル
- `<button id="toggleDarkMode">` が全ページに存在
- `simpleSetTheme()` 関数: localStorage から theme 取得、`dark` クラスをトグル
- `ThemeProvider.astro_astro_type_script_index_0_lang.suZL6u-L.js` が読み込まれている
- 3 つのアイコン (system/light/dark) が SVG で実装

### AC-7: Pagefind 日本語検索
- `dist/pagefind/` ディレクトリが存在
- `pagefind-entry.json`: language "ja", 5 pages indexed
- フラグメントファイル: 5 個 (`ja_*.pf_fragment`)
- Pagefind UI CSS/JS が含まれている

### AC-8: OG 画像
- `dist/og/hello-nainaism.png` が存在 (44,515 bytes)
- OG メタタグ: `<meta content="https://nainaism.com/og/hello-nainaism.png" property="og:image">`
- サイズ: 1200x630 (メタタグで指定)

### AC-9: サンプル日本語ブログ記事
- `/blog/hello-nainaism/index.html` が存在
- タイトル: "Nainaism へようこそ"
- 日本語コンテンツ: はじめに、技術スタックについて、コードブロックの例、リストの例、まとめ
- タグ: ブログ, 技術

### AC-10: Cloudflare Pages デプロイ設定
- `wrangler.toml` が存在
- `name = "nainaism"`
- `compatibility_date = "2026-01-01"`
- `compatibility_flags = ["nodejs_compat"]`
- `[site] bucket = "./dist"`

### AC-11: RSS フィード
- `<link rel="alternate" type="application/rss+xml" title="Nainaism" href="https://nainaism.com/rss.xml">` が全ページに存在
- `/rss.xml` は SSR ルートとして _worker.js から配信される（`@astrojs/rss` パッケージ使用）

### AC-12: サイトマップ
- `dist/sitemap-index.xml`: 存在、`sitemap-0.xml` を参照
- `dist/sitemap-0.xml`: 9 URL を含む（トップ、about、archives、blog、blog/hello-nainaism、search、tags、tags/ブログ、tags/技術）
- `<link href="/sitemap-index.xml" rel="sitemap">` が全ページに存在

### AC-13: パフォーマンス（ビルドサイズ代替）
- dist 全体: 6.0MB（pagefind インデックス、OG 画像、フォント含む）
- クライアント JS/CSS (`_astro/`): 2.1MB
- 最大 JS バンドル: `Comment.astro...js` 82KB (gzip 29KB)
- ThemeProvider: 47KB (gzip 11KB)
- UI core: 73KB (gzip 23KB)

### AC-14: レスポンシブデザイン
- `<meta content="width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover" name="viewport">`
- Tailwind CSS レスポンシブプレフィックス使用: `max-sm:`, `sm:`, `md:`, `lg:`
- ハンバーガーメニュー (`#toggleMenu`): `sm:hidden` でモバイルのみ表示
- グリッドレイアウト: `sm:grid-cols-[3fr_1fr]`

## 結論

全 14 項目 (Must 10 + Should 4) が **Pass** です。修正不要でした。
