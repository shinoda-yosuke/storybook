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
        // 汎用部品、複合部品、配置、ページ全体の使用例の順に並べる
        order: ['Elements', 'Components', 'Layouts', 'Page Sample'],
      },
    },
  },
}

export default preview
