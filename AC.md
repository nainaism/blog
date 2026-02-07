# Acceptance Criteria — Nainaism Blog

すべて boolean（Pass/Fail）で判定可能。

## 必須（Must）

- [x] AC-1: `bun run build` がエラーなく完了する
- [x] AC-2: サイトタイトルが "Nainaism"、ドメインが nainaism.com で設定されている
- [x] AC-3: `<html lang="ja">` が出力される（日本語ロケール）
- [x] AC-4: 日付表示が日本語フォーマット（例: 2026年2月7日）
- [x] AC-5: MDX 形式のブログ記事が正しくレンダリングされる
- [x] AC-6: ダークモードトグルが動作する（ライト↔ダーク切替）
- [x] AC-7: Pagefind 検索で日本語コンテンツがヒットする
- [x] AC-8: OG 画像が生成され、日本語タイトルが正しく表示される（文字化け・改行崩れなし）
- [x] AC-9: サンプル日本語ブログ記事が1件以上存在し、表示される
- [x] AC-10: Cloudflare Pages 用のデプロイ設定が存在する

## 推奨（Should）

- [x] AC-11: RSS フィードが正しく生成される
- [x] AC-12: サイトマップが生成される
- [x] AC-13: Lighthouse Performance スコア 90+（モバイル）
- [x] AC-14: レスポンシブデザインが mobile/tablet/desktop で崩れない
