# storybook

shadcn/ui（Base UI）と TanStack Router で作る部品カタログです。Storybook を Cloudflare Workers で公開します。

https://storybook.disneyland.workers.dev （WARP につながった端末からだけ開けます）

## 設計ルール

最上位の UI 設計ルールは [AGENTS.md](./AGENTS.md) に置きます。実装・公開 API・Storybook は、このルールにそろえます。

| 分類 | フォルダ | 責務 |
|---|---|---|
| Elements | `src/elements` | 不特定の Components で使える汎用部品。Props は目的・操作・状態で定義する |
| Components | `src/components` | `_BaseX` を包んで機能を絞り、体験・操作を固定した派生部品 |
| Layouts / Global | `src/layouts/global` | 画面全体の配置だけを決める枠 |
| Layouts / Local | `src/layouts/local` | 主にコンテンツ内の配置だけを決める枠 |

Elements・画面から使う派生 Components に `variant="outline"` などの見た目を選ぶ Props や、`className`・`style`・`render` による見た目の差し替えは設けません。色・角丸・影・文字装飾は内部で決めます。幅・間隔・整列・分割比率は配置の責務とし、`size` や Button の `width="content" | "fill"` は配置用として許可します。

`_BaseX` は派生実装から使います。土台のコンポーネント（関数・クラス）の識別子、export / import 名、JSX タグ、displayName、Storybook の表示名を `_BaseX` のように `_` 始まりに統一します。各パーツも `_BaseDialogContent` など同じ規約です。画面や通常の Storybook の使用例は用途別の派生を使い、「大きいダイアログ」など見た目による派生は作りません。Storybook は土台も派生も `Components` の同じ系列内にまとめます。土台の Story は派生実装者向けのリファレンスで、`_BaseX` を直接組み立てて構造・機能・コードを確認できます。Layouts は任意の `ReactNode` を受け取り、特定の部品や操作に依存しません。

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
bun run check:architecture # 層の依存と _BaseX の命名・参照を確認する
bun run test              # 公開 API の動作を確認する
```

## 部品を足す

shadcn の部品は `src/elements` に生成されます（`components.json` の `aliases.ui`）。生成した API はそのまま公開せず、目的で定義した Props に直します。複合部品は `_BaseX` と用途別の派生に分けて `src/components` に移します。

```sh
bunx --bun shadcn@latest add <name>
```

## Button

`purpose` は必須です。主語をユーザーに固定し、ユーザーがどの意思を表すかで分類します。`delete` のようなデータの状態変化を分類の軸にはしません。具体的な業務操作はボタンの文言とコールバックで表します。

| purpose | ユーザーの意思 |
|---|---|
| `agree` | 同意する |
| `agree-to-risk` | 危険な処理であることを理解して同意する |
| `decline` | 拒否する |
| `acknowledge` | 内容を読んだ・認識したと確認する |

```tsx
<Button purpose="agree" type="submit">同意する</Button>
<Button purpose="agree-to-risk" type="submit">危険性を理解して同意する</Button>
<Button purpose="decline" onClick={onDecline}>同意しない</Button>
<Button purpose="acknowledge" width="fill" onClick={onAcknowledge}>確認しました</Button>
```

HTML の `type` は `purpose` と独立した動作の指定です。既定は `button` で、`type="submit"`・`type="reset"` を明示した場合だけフォームを送信・リセットします。「拒否したことを送信する」場合も `purpose="decline" type="submit"` で表現できます。移動にはリンクを使います。見た目を取り出す `buttonVariants` は公開しません。Checkbox も選択や必須状態などの操作用 Props を受け取り、見た目を変更する Props は持ちません。

## ダイアログ

`_BaseDialog` は派生実装専用の土台です。Storybook の `Components/Dialog/_BaseDialog` に、派生を作る人向けの構成・開閉・スクロール・フォームのリファレンスを掲載します。利用画面では操作を固定した次の派生部品を使い、同じ `Components/Dialog` で使用例を確認します。

| 部品 | 固定するもの |
|---|---|
| `ConfirmDialog` | Header と Content の配置・キャンセルと確定の2つのボタン |
| `CheckboxConfirmDialog` | 上記の構成に、チェックするまで確定できないチェックボックスを加える |

専用の部品は独立した Props を持ち、`_BaseDialog` の Props を継承・転送しません。呼び出し側に指定できるのは `open`、`pending`、`error`、各ラベル、`children`、`onConfirm`、`onCancel` です。`children` には専用の Header と Content をこの順で1つずつ直接渡します。Header と Content は中身を `ReactNode` で受け取り、見出しには inline code、本文には表・リスト・独自コンポーネントなどを置けます。ボタン構成・閉じ方・チェック状態は派生コンポーネントが固定します。

`title`・`description` プロップスは使いません。Header の欠落・重複・順序違い、別種類のダイアログの Header / Content の混在は、型と実行時の確認で防ぎます。JSX の型では子要素の種類を完全には区別できないため、実行時にも専用の2要素かを確認します。

どちらも背景のクリックでは閉じず、右上の閉じるボタンは表示しません。確定はユーザーの同意、キャンセルは拒否として固定しています。危険な処理への同意が必要な体験は、専用の派生を追加して表現します。Esc キーはキャンセルとして扱い、開いたときは本文を先頭から読めるよう見出しにフォーカスします。閉じたときは、開いた要素が残っていればフォーカスを戻します。開いた要素が消える場合の次のフォーカス先は呼び出し側で決めます。

非同期の処理は親が実行し、`pending`・`error`・`open` を管理します。`pending` 中は確定とキャンセルのボタン・Esc・チェック変更を無効にし、処理中の案内を表示します。失敗時は `pending` を解除し、`error` に任意の ReactNode を渡すと alert として伝えます。ダイアログは開いたまま再試行でき、チェック状態も保持します。閉じてから開いたときは未チェックに戻ります。成功時は親が閉じます。親からの `open` 変更まで制限するものではありません。

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

グローバルは画面幅が48rem以上ならサイドメニューが左列、ヘッダーとコンテンツが右列に並びます。それ未満ではヘッダー → サイドメニュー → コンテンツの順に縦に並べます。

ローカルは画面幅ではなく、配置先の幅を基準にします。配置先が48rem以上なら、間隔を除いた幅を1:2に分けます。それ未満では start → end の順に縦に並びます。広い画面でも狭いパネルに置けば縦並びになります。

## 既存 API からの変更

- Button の `variant` を削除し、全使用箇所をユーザーの意思を表す `purpose` に移行しました。HTML の `type` は独立して指定し、既定は `button` です。
- Button・Checkbox の `className`・`style`・`render` を削除しました。配置調整は外側のラッパーで行います。
- 土台の識別子・export / import 名を `BaseDialog`・`BaseDialogContent` から `_BaseDialog`・`_BaseDialogContent` に移行しました。
- `_BaseDialog` のリファレンスを `Components/Dialog/_BaseDialog` に配置しました。コード名は `_BaseDialog` です。利用画面では ConfirmDialog・CheckboxConfirmDialog の Header / Content 構成を使ってください。

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
