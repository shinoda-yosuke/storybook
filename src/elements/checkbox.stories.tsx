import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { fn } from 'storybook/test'

import { Checkbox } from '@/elements/checkbox'

const meta = {
  title: 'Elements/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '複数の用途で使える選択用のチェックボックス。checked・disabled・required などの状態と操作を受け取り、見た目を選ぶ Props は持たない。ラベルと周囲の配置は利用側で組み立てる。',
      },
    },
  },
  args: {
    defaultChecked: false,
    onCheckedChange: fn(),
  },
  render: (args) => (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox {...args} />
      対象を選択する
    </label>
  ),
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { name: '基本' }
export const InitiallyChecked: Story = {
  name: '初期状態でチェック済み',
  args: { defaultChecked: true },
}
export const Disabled: Story = {
  name: '無効な状態',
  args: { disabled: true },
}
export const Indeterminate: Story = {
  name: '一部が選択された状態',
  args: { indeterminate: true },
}
export const Required: Story = {
  name: 'チェック必須',
  args: { required: true, name: 'selection' },
}
