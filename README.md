# storybook

shadcn/ui（Base UI）と TanStack Router で作る部品カタログです。Storybook を Cloudflare Workers で公開します。

https://storybook.disneyland.workers.dev （WARP につながった端末からだけ開けます）

## 分け方

Storybook の一覧は、小さい順に 3 つに分けます。

| 分類 | フォルダ | 置くもの |
|---|---|---|
| Elements | `src/elements` | ボタンや入力欄など、これ以上分けられない部品 |
| Components | `src/components` | Elements を組み合わせた部品。ヘッダーやサイドバーもここに置く |
| Layouts | `src/layouts` | 画面のどこに何を置くかを決める枠。枠の中に Components を差し込む |

## 使っているもの

- React・TypeScript・Vite
- TanStack Router（ファイルベースのルーティング）
- shadcn/ui（土台は Base UI、スタイルは nova）・Tailwind CSS
- Storybook（`@storybook/tanstack-react`）
- bun

## コマンド

```sh
bun install
bun run storybook         # Storybook を http://localhost:6006 で起動する
bun run build-storybook   # storybook-static/ に静的ファイルを出す
bun run dev               # アプリを起動する
bun run typecheck         # 型チェック
```

## 部品を足す

shadcn の部品は `src/elements` に入ります（`components.json` の `aliases.ui`）。

```sh
bunx --bun shadcn@latest add <name>
```

## ダイアログ

`BaseDialog` は、各パーツを組み合わせて使うダイアログの土台です。用途が決まっている場合は、BaseDialog を包んで機能を絞った次の部品を使います。

| 部品 | 固定するもの |
|---|---|
| `ConfirmDialog` | 見出し・説明・キャンセルと確定の2つのボタン |
| `CheckboxConfirmDialog` | 上記の構成に、チェックするまで確定できないチェックボックスを加える |

専用の部品は独立した Props を持ち、BaseDialog の Props を継承・転送しません。指定できるのは `open`、見出し・説明・各ラベル、`onConfirm`、`onCancel` です。`children`・`render`・`className` による構成の変更や、閉じ方・チェック状態の外部指定は受け付けません。

どちらも背景のクリックでは閉じず、右上の閉じるボタンは表示しません。Esc キーはキャンセルとして扱い、開いたときはキャンセルボタンにフォーカスします。チェック状態は内部で管理し、開くたびに未チェックから始めます。

開閉は親が `open` で管理し、`onConfirm` と `onCancel` で閉じます。

```tsx
<ConfirmDialog
  open={open}
  title="設定を適用しますか？"
  description="現在の設定を適用します。"
  onCancel={() => setOpen(false)}
  onConfirm={() => {
    applySettings()
    setOpen(false)
  }}
/>

<CheckboxConfirmDialog
  open={open}
  title="次に進む前に"
  description="注意事項を確認してください。"
  checkboxLabel="注意事項を確認しました"
  onCancel={() => setOpen(false)}
  onConfirm={() => {
    goToNextStep()
    setOpen(false)
  }}
/>
```

## 公開

Storybook のビルド結果を、Cloudflare Workers の静的アセットとして配信します（設定は `wrangler.jsonc`）。

| いつ | どこに | workflow |
|---|---|---|
| main に push したとき | 本番 `https://storybook.disneyland.workers.dev` | `.github/workflows/deploy.yml` |
| PR を出したとき・更新したとき | プレビュー `https://pr-<番号>-storybook.disneyland.workers.dev`（PR にコメントで URL を貼る） | `.github/workflows/preview.yml` |
| PR を閉じたとき | そのプレビューを消す | `.github/workflows/preview.yml` |

- 本番もプレビューも、Cloudflare Access で守っています。WARP（Zero Trust の組織 `shirayukihime`）につながった端末からだけ開けます。
- どちらの workflow も、デプロイのあとに「WARP なしで開くと Access のログインへ回される」ことを確かめます。守りが外れていたら失敗します。
- workflow には、リポジトリの secret `CLOUDFLARE_API_TOKEN` と変数 `CLOUDFLARE_ACCOUNT_ID` が要ります。

手元から本番にデプロイするとき:

```sh
bun run build-storybook
bunx wrangler@4.155.0 deploy
```
