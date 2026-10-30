# UI 設計の最上位ルール

このファイルを、このリポジトリ内の UI 設計の最上位ルールとする。実装・公開 API・Storybook・README をこのルールにそろえる。shadcn/ui や Base UI の初期 API もそのまま採用せず、この設計に合わせる。

## Elements — 複数の用途で使える部品

- `src/elements` に置く。不特定の Components 内で使える汎用的な部品にする。
- Props は利用者の目的・操作・状態を表す。見た目を選ぶ Props は公開しない。
  - OK: `purpose="submit" | "cancel" | "execute" | "delete"`、`disabled`、`checked`。
  - NG: `variant="default" | "outline" | "secondary"`、`appearance`、`tone`、色指定。
  - 操作を表す動詞は `execute` とする。`exec` と略したり、名詞の `execution` にしない。
- `size` は配置上の制約を表すため許可する。アイコン用の寸法も含む。
- 見た目は目的から内部で決める。`className`・`style`・描画を差し替える `render` を公開せず、見た目だけを取り出す関数も公開しない。周囲との配置はラッパーや Layouts で決める。
- HTML のイベント、フォームへの関連付け、`ref`、`aria-*` など、操作とアクセシビリティに必要な Props は許可する。
- Button の `purpose="submit"` は HTML の `type="submit"`、それ以外は `type="button"` にする。キャンセル・実行・削除でフォームを送信しない。移動にはリンクを使う。
- Components・Layouts には依存しない。

## Components — 操作体験を固定した部品

- `src/components` に置く。部品の系列ごとに `BaseX` を定義し、利用者には目的別の派生コンポーネントを提供する。
- `BaseX` は派生実装のためだけに使う。画面、Layouts、Storybook の使用例から直接使わず、公開用の barrel から再エクスポートしない。
- 派生は BaseX を包んで機能を制限する。独立した Props を定義し、BaseX の Props を継承したり、任意の Props をそのまま転送したりしない。BaseX に用途の切り替え用 `type` を追加しない。
- 派生の名前と API は体験・操作で定義する。
  - OK: キャンセルか実行を選ぶ確認ダイアログ、確認事項へのチェックが必要なダイアログ。
  - NG: 大きいダイアログ、小さいダイアログ、枠線付きダイアログ。
- 見た目は系列の内部で決める。公開 Props に見た目の選択や `className`・`style`・`render` による差し替えを加えない。
- 内容は専用の Header / Content などから任意の `ReactNode` を受け取れる構成にする。見出しの inline code や本文の表を文字列に制限しない。
- Storybook は派生コンポーネントを主軸にする。`Components/<系列>/<派生名>` でまとめ、Show code には実際に使う派生タグを表示する。
- Layouts には依存しない。

## Layouts — 配置だけを決める枠

- `src/layouts/global` と `src/layouts/local` に分ける。
- 各枠を `ReactNode` で受け取り、どのコンポーネントでも入れられるようにする。特定の Elements・Components を import しない。
- 配置・幅の比率・間隔・スクロール・画面幅への対応だけを扱う。メニュー項目やボタンなどの内容、業務処理、データ取得、操作状態を持たない。
- landmark（`header`・`nav`・`main` など）の意味は差し込む側で決める。枠の都合で二重の landmark を作らない。
- グローバルは画面全体の配置を表す。
  - `SidebarLayout`: サイドメニュー + ヘッダー + コンテンツ。
  - `HeaderLayout`: ヘッダーメニュー + コンテンツ。
  - `ContentLayout`: コンテンツのみ。
- ローカルは主にコンテンツ内の配置を表す。
  - `OneTwoSplitLayout`: 先頭側と末尾側を 1:2 で横に分割する。狭い画面では同じ順で縦に並べる。
- Layouts は Components の系列ではないため、`BaseX` と派生の規約は適用しない。
- Storybook は `Layouts/Global/<名前>`、`Layouts/Local/<名前>` に分ける。

## 変更時の確認

- 目的を表す Props か、見た目の選択肢を増やしていないかを先に確認する。
- 新しい操作体験が必要なら派生を追加する。BaseX の機能を利用者に開放しない。
- 生成した部品にも上記を適用し、使用箇所・Storybook・README を同時に更新する。
- `bun run typecheck`・`bun run check:architecture`・`bun run test`・`bun run build-storybook` で確認する。CI でも同じ確認を行う。
- 操作の意味が変わる場合は、ブラウザでフォーム送信・キャンセル・確定条件も確認する。配置を変える場合は広い画面と狭い画面で確認する。
