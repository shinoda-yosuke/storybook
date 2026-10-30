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

export const Default: Story = {}
export const InitiallyChecked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Indeterminate: Story = { args: { indeterminate: true } }
export const Required: Story = { args: { required: true, name: 'selection' } }
