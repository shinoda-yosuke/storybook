import type { Preview } from '@storybook/tanstack-react'

// Tailwind と shadcn のテーマ（色・角丸・フォント）を読み込む
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        // 汎用部品、複合部品、配置の順に並べる。土台も Components にまとめる
        order: ['Elements', 'Components', 'Layouts'],
      },
    },
  },
}

export default preview
