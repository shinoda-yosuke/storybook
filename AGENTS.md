# UI 設計の最上位ルール

このファイルを、このリポジトリ内の UI 設計の最上位ルールとする。実装・公開 API・Storybook・README をこのルールにそろえる。shadcn/ui や Base UI の初期 API もそのまま採用せず、この設計に合わせる。

Storybook の各 Story（各コンポーネント配下の例）は、`name` で日本語の表示名を指定する。ユーザーの操作目的を示す Story は「同意させる」「拒否させる」のように、部品を使ってユーザーに何をさせるかで表現する。export 名は英語の識別子として保ち、既存の Story ID・URL を維持する。`Meta.title` は分類とコンポーネント名を表し、下記の命名規約に従う。

## Elements — 複数の用途で使える部品

- `src/elements` に置く。不特定の Components 内で使える汎用的な部品にする。
- Props はユーザーを主語にした目的・意思表示・状態を表す。見た目を選ぶ Props は公開しない。
  - Button の `purpose`: `agree`（同意）、`agree-to-risk`（危険な処理への同意）、`decline`（拒否）、`acknowledge`（内容を読んだ・認識したという確認）。
  - `delete` のようにデータの状態変化を主語にした分類は使わない。具体的な業務操作はラベルやコールバックで表す。
  - 操作状態を表す `disabled`・`checked` などは許可する。
  - NG: `variant="default" | "outline" | "secondary"`、`appearance`、`tone`、色指定。
- `size` は配置上の制約を表すため許可する。アイコン用の寸法も含む。Button の `width="content" | "fill"` も配置用の Props として許可する。
- 色・角丸・影・文字装飾は部品の内部で決める。幅・間隔・整列・分割比率は配置の責務とする。配置用の Props は意味の限定された値で定義し、任意の CSS の入り口にはしない。
- 見た目は目的から内部で決める。`className`・`style`・描画を差し替える `render` を公開せず、見た目だけを取り出す関数も公開しない。周囲との配置はラッパーや Layouts で決める。
- HTML のイベント、フォームへの関連付け、`ref`、`aria-*` など、操作とアクセシビリティに必要な Props は許可する。
- Button の `purpose` と HTML の `type` は独立させる。既定は `type="button"` とし、明示的な `submit`・`reset` だけがフォームの送信・リセットを行う。同意・危険な処理への同意・拒否・確認のいずれも、必要なら送信と組み合わせられる。移動にはリンクを使う。
- Components・Layouts には依存しない。

## Components — 操作体験を固定した部品

- `src/components` に置く。部品の系列ごとに `_BaseX` を定義し、利用者には目的別の派生コンポーネントを提供する。
- この規約は複合部品を置く Components に限定する。単純な汎用部品は Elements に置く。
- 土台の名前は `_BaseX` に統一する。コンポーネント（関数・クラス）の識別子、export / import 名、JSX タグ、displayName、Storybook の表示名をすべて `_` 始まりにする。各パーツも `_BaseDialogContent` のようにそろえる。
- `_BaseX` は派生実装のためだけに使う。画面、Layouts、通常の Components の使用例から直接使わず、公開用の barrel から再エクスポートしない。
- Storybook は `Components` にまとめ、土台は `Components/<系列>/_BaseX` として派生と同じ系列内に掲載する。先頭の `_` は派生実装用の土台を表す命名規約とする。この参照用 Story では `_BaseX` を直接使って構造と機能を確認できる。ファイルは `src/components` 内の `base-*.stories.tsx` とする。
- 派生は `_BaseX` を包んで機能を制限する。独立した Props を定義し、`_BaseX` の Props を継承したり、任意の Props をそのまま転送したりしない。`_BaseX` に用途の切り替え用 `type` を追加しない。
- 派生の名前と API は体験・操作で定義する。
  - OK: キャンセルか実行を選ぶ確認ダイアログ、確認事項へのチェックが必要なダイアログ。
  - NG: 大きいダイアログ、小さいダイアログ、枠線付きダイアログ。
- 見た目は系列の内部で決める。派生の公開 Props に見た目の選択や `className`・`style`・`render` による差し替えを加えない。
- 内容は専用の Header / Content などから任意の `ReactNode` を受け取れる構成にする。見出しの inline code や本文の表を文字列に制限しない。
- 操作体験の契約には処理中・失敗・再試行・キーボード操作・フォーカスの移動を含める。業務処理と通信は呼び出し側が担当する。
  - 確認ダイアログの `open`・`pending`・`error` は呼び出し側が管理する。エラーを捕捉し、成功・失敗のどちらでも `pending` を解除する。
  - `pending` 中は二重実行とユーザーによるキャンセル・Esc での閉じる操作を防ぐ。チェックボックスも操作できなくする。
  - 失敗時は `error` を alert として伝え、開いたまま再試行できる。失敗でチェックをリセットせず、閉じてから開いたときに未チェックへ戻す。
  - 開いたときは見出しにフォーカスし、閉じたときは開いた要素へ戻す。開いた要素が消える場合の次のフォーカス先は呼び出し側が決める。
- 派生の確定ボタンは同意、キャンセルボタンは拒否として定義する。危険な処理への同意など別の体験が必要なら専用の派生を作り、汎用の見た目切り替えを公開しない。
- Storybook は派生コンポーネントを主軸にする。派生は `Components/<系列>/<派生名>` に掲載し、Show code には実際に使う派生タグを表示する。`_BaseX` の Show code には、派生実装に使う `<_BaseX>` のタグを表示する。
- Layouts には依存しない。

## Layouts — 配置だけを決める枠

- `src/layouts/global` と `src/layouts/local` に分ける。
- 各枠を `ReactNode` で受け取り、どのコンポーネントでも入れられるようにする。特定の Elements・Components を import しない。
- 配置・幅の比率・間隔・スクロール・利用できる幅への対応だけを扱う。メニュー項目やボタンなどの内容、業務処理、データ取得、操作状態を持たない。
- landmark（`header`・`nav`・`main` など）の意味は差し込む側で決める。枠の都合で二重の landmark を作らない。
- グローバルは画面全体の配置を表す。
  - `SidebarLayout`: サイドメニュー + ヘッダー + コンテンツ。
  - `HeaderLayout`: ヘッダーメニュー + コンテンツ。
  - `ContentLayout`: コンテンツのみ。
- ローカルは主にコンテンツ内の配置を表す。
  - `OneTwoSplitLayout`: 先頭側と末尾側を 1:2 で横に分割する。配置先が狭ければ同じ順で縦に並べる。
- グローバルは画面幅、ローカルは配置先の幅を基準にする。広い画面の狭いパネル内でも、ローカルの縦並びへの切り替えが働くようにする。
- Layouts は Components の系列ではないため、`_BaseX` と派生の規約は適用しない。
- Storybook は `Layouts/Global/<名前>`、`Layouts/Local/<名前>` に分ける。

## Page Sample — ページ全体の使用例

- `src/page-samples` に置き、Storybook の `Page Sample/<画面名>` に掲載する。日本語の画面名には英語の `Meta.id` を明示し、ID と URL を安定させる。
- Layouts と目的別の派生 Components を組み合わせ、画面としての使い方を示す。`_BaseX` を直接使わない。
- 各部品の操作や見た目をページ内で作り直さない。共通化する入力部品は Elements、操作体験を固定するフォームなどは Components に置く。
- サンプル用の状態・処理は実際の認証や業務データから独立させる。デモ用の値と操作方法は Docs に記載する。
- Show code には Layouts と派生 Components の組み合わせが分かる JSX を表示する。
- Elements・Components・Layouts は Page Sample に依存しない。

## 変更時の確認

- 目的を表す Props か、見た目の選択肢を増やしていないかを先に確認する。
- 新しい操作体験が必要なら派生を追加する。`_BaseX` の機能を利用者に開放しない。
- 生成した部品にも上記を適用し、使用箇所・Storybook・README を同時に更新する。
- `bun run typecheck`・`bun run check:architecture`・`bun run test`・`bun run build-storybook` で確認する。CI でも同じ確認を行う。
- 操作の意味が変わる場合は、ブラウザでフォーム送信・キャンセル・確定条件も確認する。配置を変える場合は広い画面と狭い画面で確認する。
