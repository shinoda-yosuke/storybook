# storybook

shadcn/ui（Base UI）と TanStack Router で作る部品カタログです。Storybook を Cloudflare Workers で公開します。

https://storybook.disneyland.workers.dev （WARP につながった端末からだけ開けます）

## 設計ルール

最上位の UI 設計ルールは [AGENTS.md](./AGENTS.md) に置きます。実装・公開 API・Storybook は、このルールにそろえます。

| 分類 | フォルダ | 責務 |
|---|---|---|
| Elements | `src/elements` | 不特定の Components で使える汎用部品。Props は目的・操作・状態で定義する |
| Components | `src/components` | BaseX を包んで機能を絞り、体験・操作を固定した派生部品 |
| Layouts / Global | `src/layouts/global` | 画面全体の配置だけを決める枠 |
| Layouts / Local | `src/layouts/local` | 主にコンテンツ内の配置だけを決める枠 |

Elements・公開 Components に `variant="outline"` などの見た目を選ぶ Props や、`className`・`style`・`render` による見た目の差し替えは設けません。見た目は目的から内部で決めます。`size` は配置の制約を表すため許可します。

BaseX は派生実装からだけ使います。画面や Storybook の使用例は用途別の派生を使い、「大きいダイアログ」など見た目による派生は作りません。Layouts は任意の `ReactNode` を受け取り、特定の部品や操作に依存しません。

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
bun run check:architecture # 層の依存と BaseX の直接利用を確認する
bun run test              # 公開 API の動作を確認する
```

## 部品を足す

shadcn の部品は `src/elements` に生成されます（`components.json` の `aliases.ui`）。生成した API はそのまま公開せず、目的で定義した Props に直します。複合部品は BaseX と用途別の派生に分けて `src/components` に移します。

```sh
bunx --bun shadcn@latest add <name>
```

## Button

`purpose` は必須です。操作を表す英語は動詞の `execute` に統一します。HTML の `type` との衝突を避けるため、操作の指定には `purpose` を使います。

| purpose | 目的 | HTML の type |
|---|---|---|
| `submit` | フォームを送信する | `submit` |
| `cancel` | 操作を取り消す・閉じる | `button` |
| `execute` | 操作を実行する | `button` |
| `delete` | 対象を削除する | `button` |

```tsx
<Button purpose="submit">保存する</Button>
<Button purpose="cancel" onClick={onCancel}>キャンセル</Button>
<Button purpose="execute" onClick={onExecute}>実行する</Button>
<Button purpose="delete" size="sm" onClick={onDelete}>削除する</Button>
```

キャンセル・実行・削除では、フォーム内でも送信しません。移動にはリンクを使います。見た目を取り出す `buttonVariants` は公開しません。Checkbox も選択や必須状態などの操作用 Props を受け取り、見た目を変更する Props は持ちません。

## ダイアログ

`BaseDialog` は派生実装専用の土台です。画面や使用例で直接使わず、操作を固定した次の派生部品を使います。Storybook も派生部品だけを `Components/Dialog` に掲載します。

| 部品 | 固定するもの |
|---|---|
| `ConfirmDialog` | Header と Content の配置・キャンセルと確定の2つのボタン |
| `CheckboxConfirmDialog` | 上記の構成に、チェックするまで確定できないチェックボックスを加える |

専用の部品は独立した Props を持ち、BaseDialog の Props を継承・転送しません。呼び出し側に指定できるのは `open`、各ラベル、`children`、`onConfirm`、`onCancel` です。`children` には専用の Header と Content をこの順で1つずつ直接渡します。Header と Content は中身を `ReactNode` で受け取り、見出しには inline code、本文には表・リスト・独自コンポーネントなどを置けます。ボタン構成・閉じ方・チェック状態は派生コンポーネントが固定します。

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

## Layouts

| 分類 | 部品 | 受け取る枠 |
|---|---|---|
| Global | `SidebarLayout` | `sidebar`・`header`・`children` |
| Global | `HeaderLayout` | `header`・`children` |
| Global | `ContentLayout` | `children` |
| Local | `OneTwoSplitLayout` | `start`（1）・`end`（2） |

各枠は任意の `ReactNode` です。Layout は特定のメニューや部品を import せず、内容・操作・業務処理を持ちません。枠は `div` で作り、`header`・`nav`・`main` などの意味付けは差し込む側で行います。背景色や枠線も中身側で決めます。

```tsx
import { SidebarLayout } from '@/layouts/global/sidebar-layout'
import { OneTwoSplitLayout } from '@/layouts/local/one-two-split-layout'

<SidebarLayout sidebar={<SideMenu />} header={<HeaderMenu />}>
  <main>
    <OneTwoSplitLayout start={<SearchFilters />} end={<SearchResults />} />
  </main>
</SidebarLayout>
```

768px 以上ではサイドメニューが左列、ヘッダーとコンテンツが右列に並びます。1:2 分割は間隔を除いた残りの幅を分けます。768px 未満では、グローバルはヘッダー → サイドメニュー → コンテンツ、ローカルは start → end の順に縦に並べます。

## 既存 API からの変更

- Button の `variant` を削除し、全使用箇所を `purpose` に移行しました。HTML の `type` は `purpose` から決まります。
- Button・Checkbox の `className`・`style`・`render` を削除しました。配置調整は外側のラッパーで行います。
- BaseDialog の単独 Story を削除しました。既存の ConfirmDialog・CheckboxConfirmDialog の Header / Content 構成を使ってください。

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
