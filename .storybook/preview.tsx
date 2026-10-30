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
        // 汎用部品、操作体験、配置、派生実装用のリファレンスの順に並べる
        order: ['Elements', 'Components', 'Layouts', 'BASE COMPONENTS'],
      },
    },
  },
}

export default preview
