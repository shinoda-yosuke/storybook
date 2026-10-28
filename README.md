# storybook

shadcn/ui（Base UI）と TanStack Router で作る部品カタログです。Storybook を GitHub Pages で公開します。

https://shinoda-yosuke.github.io/storybook/

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

## 公開

main に push すると、GitHub Actions（`.github/workflows/pages.yml`）が Storybook をビルドして GitHub Pages に公開します。
