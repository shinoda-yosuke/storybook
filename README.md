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
| `ConfirmDialog` | Header と Content の配置・キャンセルと確定の2つのボタン |
| `CheckboxConfirmDialog` | 上記の構成に、チェックするまで確定できないチェックボックスを加える |

専用の部品は独立した Props を持ち、BaseDialog の Props を継承・転送しません。親に指定できるのは `open`、各ラベル、`children`、`onConfirm`、`onCancel` です。`children` には専用の Header と Content をこの順で1つずつ直接渡します。Header と Content は中身を `ReactNode` で受け取り、見出しには inline code、本文には表・リスト・独自コンポーネントなどを置けます。ボタン構成・閉じ方・チェック状態は親側で管理します。

`title`・`description` プロップスは使いません。Header の欠落・重複・順序違い、別種類のダイアログの Header / Content の混在は、型と実行時の確認で防ぎます。JSX の型では子要素の種類を完全には区別できないため、実行時にも専用の2要素かを確認します。

どちらも背景のクリックでは閉じず、右上の閉じるボタンは表示しません。Esc キーはキャンセルとして扱い、開いたときは本文を先頭から読めるよう見出しにフォーカスします。チェック状態は内部で管理し、開くたびに未チェックから始めます。

開閉は親が `open` で管理し、`onConfirm` と `onCancel` で閉じます。

```tsx
import { ConfirmDialog, ConfirmDialogHeader, ConfirmDialogContent } from '@/components/confirm-dialog'
import {
  CheckboxConfirmDialog,
  CheckboxConfirmDialogHeader,
  CheckboxConfirmDialogContent,
} from '@/components/checkbox-confirm-dialog'

<ConfirmDialog
  open={confirmOpen}
  onCancel={() => setConfirmOpen(false)}
  onConfirm={() => {
    applySettings()
    setConfirmOpen(false)
  }}
>
  <ConfirmDialogHeader>設定を適用しますか？</ConfirmDialogHeader>
  <ConfirmDialogContent>
    <p>現在の設定を適用します。</p>
  </ConfirmDialogContent>
</ConfirmDialog>

<CheckboxConfirmDialog
  open={checkboxConfirmOpen}
  checkboxLabel="内容を確認しました"
  onCancel={() => setCheckboxConfirmOpen(false)}
  onConfirm={() => {
    goToNextStep()
    setCheckboxConfirmOpen(false)
  }}
>
  <CheckboxConfirmDialogHeader>
    ID: <code>hogehoge</code> を変更しますか？
  </CheckboxConfirmDialogHeader>
  <CheckboxConfirmDialogContent>
    <Table />
  </CheckboxConfirmDialogContent>
</CheckboxConfirmDialog>
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
