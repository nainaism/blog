# Tasks — Nainaism Blog

## タスク一覧

| ID  | タスク                          | 担当ロール        | 依存  | 状態     |
|-----|---------------------------------|-------------------|-------|----------|
| T1  | Pure テンプレートからプロジェクト作成 | Implementer       | —     | pending  |
| T2  | サイト設定カスタマイズ           | Implementer       | T1    | pending  |
| T3  | 日本語最適化（OG画像 budoux等）  | Implementer       | T1    | pending  |
| T4  | サンプルブログ記事作成（日本語）  | Implementer       | T2    | pending  |
| T5  | Cloudflare Pages デプロイ設定    | Implementer       | T1    | pending  |
| T6  | ビルド検証・機能テスト           | Test Engineer     | T2-T5 | pending  |
| T7  | コードレビュー                  | Reviewer          | T6    | pending  |

## T1: Pure テンプレートからプロジェクト作成
- `ai-factory/projects/blog/` に Pure テーマをセットアップ
- 依存関係インストール (`bun install`)
- 初回ビルド確認

## T2: サイト設定カスタマイズ
- `site.config.ts` を編集:
  - title: "Nainaism"
  - author: ユーザー指定（QUESTIONS.md Q1）
  - locale: ja / ja-JP
  - domain: nainaism.com
  - favicon / avatar: プレースホルダー
- ヘッダーメニュー: Blog, About（初期は最小構成）
- フッター: copyright, GitHub リンク
- waline コメント: 無効化（初期）

## T3: 日本語最適化
- OG 画像生成に budoux を統合（日本語改行最適化）
- 日本語フォント設定の確認・調整
- 日付フォーマットを日本語に

## T4: サンプルブログ記事作成
- MDX 形式で日本語サンプル記事を1件作成
- frontmatter（title, description, date, tags）を含む
- コードブロック・画像・リンク等の基本要素を含む

## T5: Cloudflare Pages デプロイ設定
- `wrangler.toml` または Cloudflare Pages 設定
- ビルドコマンド・出力ディレクトリの指定
- Node.js バージョン指定

## T6: ビルド検証・機能テスト
- AC.md の全項目を検証
- TESTPLAN.md に結果を記録

## T7: コードレビュー
- コード品質、セキュリティ、パフォーマンスの確認
- REVIEW.md に結果を記録
