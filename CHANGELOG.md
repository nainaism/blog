# Changelog — Nainaism Blog

## 2026-02-07 — Initial Setup

### T1: プロジェクト作成
- astro-theme-pure v4.1.2 をクローンし `projects/blog/` に展開
- npm で依存関係をインストール（bun 未インストールのため npm を使用）
- `preset/scripts/cacheAvatars.ts` の Buffer 型エラーを修正（`Uint8Array` に変更）
- 初回ビルド成功を確認

### T2: サイト設定カスタマイズ
- `src/site.config.ts` を編集:
  - title: "Nainaism", author: "Nainai", description: "Nainai のテックブログ"
  - locale: ja / ja-JP（日付フォーマット: 日本語ロング形式）
  - ヘッダーメニュー: Blog + About のみ（Docs, Projects, Links を削除）
  - waline コメント: 無効化
  - share ボタン: x, bluesky のみ（weibo 削除）
  - フッター: GitHub リンクを nainaism に変更、不要なリンクを削除
- `src/content.config.ts` から docs コレクションを削除
- 不要なページディレクトリを削除: docs, projects, links, terms
- サイト URL を nainaism.com に設定

### T3: 日本語最適化
- 日付フォーマットは T2 の ja-JP 設定で日本語表示を確認

### T3b: satori による動的OG画像生成
- satori + sharp + budoux で記事ごとにOG画像を自動生成
- `src/lib/og-image.ts`: OG画像生成ユーティリティ
  - Noto Sans JP (Bold) を Google Fonts から TTF 形式で取得
  - budoux で日本語テキストの改行位置を最適化
  - 1200x630px PNG を生成
- `src/pages/og/[...slug].png.ts`: Astro 静的エンドポイント（ビルド時に生成）
- `src/layouts/BlogPost.astro`: heroImage がない記事は `/og/{slug}.png` をOG画像に使用
- `tsconfig.json`: `@/lib/*` パスエイリアスを追加
- 依存追加: satori, budoux

### T4: サンプルブログ記事作成
- 既存の英語サンプル記事をすべて削除
- `hello-nainaism.mdx` を作成（日本語、見出し・段落・コードブロック・リスト含む）
- frontmatter: title, description, publishDate, tags を設定

### T5: Cloudflare Pages デプロイ設定
- `@astrojs/vercel` を `@astrojs/cloudflare` に置換
- `imageService: 'compile'` を設定（ビルド時画像最適化）
- `wrangler.toml` を作成
- `public/_headers` を作成（キャッシュ設定、セキュリティヘッダー）
- `.node-version` を作成（Node.js 22）

## 2026-02-07 — Code Review Fixes (Should Fix 3件)

### S1: fetch エラーチェック追加
- `src/lib/og-image.ts`: Google Fonts CSS fetch に `res.ok` チェックを追加
- `src/lib/og-image.ts`: フォントファイル fetch に `res.ok` チェックを追加
- HTTP エラー時に明確なエラーメッセージを出力するように修正

### S2: 二重キャストの簡素化
- `src/pages/og/[...slug].png.ts`: `png as unknown as BodyInit` → `png as BodyInit` に修正

### S3: image service 二重指定の削除
- `astro.config.ts`: `image.service.entrypoint` ブロックを削除
- `cloudflare({ imageService: 'compile' })` の設定に統一
