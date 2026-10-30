import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { OneTwoSplitLayout } from '@/layouts/local/one-two-split-layout'

const meta = {
  title: 'Layouts/Local/OneTwoSplitLayout',
  component: OneTwoSplitLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '主にコンテンツ内で使う 1:2 の横分割。start と end に任意の ReactNode を渡す。768px 未満では start、end の順で縦に並ぶ。パネルの色や枠線、見出しなどの中身は Layout に含めない。',
      },
    },
  },
  argTypes: {
    start: { control: false, description: '横幅の 1/3 を使う側。狭い画面では先に表示する' },
    end: { control: false, description: '横幅の 2/3 を使う側。狭い画面では後に表示する' },
  },
  args: {
    start: (
      <section className="h-full space-y-3 border border-dashed p-4">
        <h2 className="font-semibold">一覧（1）</h2>
        <ul className="space-y-2">
          <li>山田 太郎</li>
          <li>佐藤 花子</li>
        </ul>
      </section>
    ),
    end: (
      <section className="h-full space-y-3 border border-dashed p-4">
        <h2 className="font-semibold">詳細（2）</h2>
        <p>表、フォーム、別のコンポーネントなどを配置できます。</p>
      </section>
    ),
  },
} satisfies Meta<typeof OneTwoSplitLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <div className="p-4"><OneTwoSplitLayout {...args} /></div>,
}
