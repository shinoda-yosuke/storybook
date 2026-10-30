import { Button } from '@/elements/button'
import { Checkbox } from '@/elements/checkbox'
import { ConfirmDialog, ConfirmDialogHeader, ConfirmDialogContent, type ConfirmDialogProps } from '@/components/confirm-dialog'
import { CheckboxConfirmDialog, CheckboxConfirmDialogHeader, CheckboxConfirmDialogContent, type CheckboxConfirmDialogProps } from '@/components/checkbox-confirm-dialog'
import { OneTwoSplitLayout } from '@/layouts/local/one-two-split-layout'

// 公開 API が広がったときも、見た目の指定や Base の機能開放を型チェックで検出する。
export function checkPublicUIContracts() {
  void <Button purpose="submit" size="sm" form="settings">保存</Button>
  void <Button purpose="cancel" disabled aria-label="閉じる" />
  void <Checkbox checked required name="agreement" onCheckedChange={() => {}} />

  // @ts-expect-error 目的の指定は必須
  void <Button>実行</Button>
  // @ts-expect-error 操作名は動詞の execute
  void <Button purpose="execution" />
  // @ts-expect-error 見た目によるバリアントは公開しない
  void <Button purpose="execute" variant="outline" />
  // @ts-expect-error HTML の type は目的から決める
  void <Button purpose="cancel" type="submit" />
  // @ts-expect-error 見た目の上書きを公開しない
  void <Button purpose="execute" className="bg-red-500" />
  // @ts-expect-error インラインスタイルを公開しない
  void <Button purpose="execute" style={{ color: 'red' }} />
  // @ts-expect-error 描画の差し替えを公開しない
  void <Button purpose="execute" render={<a href="/" />} />
  // @ts-expect-error 色を指定する HTML 属性も公開しない
  void <Button purpose="execute" color="red" />
  // @ts-expect-error Checkbox も見た目の上書きを公開しない
  void <Checkbox className="bg-red-500" />
  // @ts-expect-error Checkbox もインラインスタイルを公開しない
  void <Checkbox style={{ color: 'red' }} />
  // @ts-expect-error Checkbox も描画の差し替えを公開しない
  void <Checkbox render={<div />} />
  // @ts-expect-error Checkbox も色を指定する HTML 属性を公開しない
  void <Checkbox color="red" />

  const confirmProps: ConfirmDialogProps = {
    open: false,
    onConfirm() {},
    onCancel() {},
    children: [
      <ConfirmDialogHeader>ID: <code>example</code> を変更しますか？</ConfirmDialogHeader>,
      <ConfirmDialogContent><table><tbody><tr><td>任意の内容</td></tr></tbody></table></ConfirmDialogContent>,
    ],
  }
  const checkboxProps: CheckboxConfirmDialogProps = {
    open: false,
    checkboxLabel: '確認しました',
    onConfirm() {},
    onCancel() {},
    children: [
      <CheckboxConfirmDialogHeader>確認</CheckboxConfirmDialogHeader>,
      <CheckboxConfirmDialogContent><section>任意の内容</section></CheckboxConfirmDialogContent>,
    ],
  }
  void <ConfirmDialog {...confirmProps} />
  void <CheckboxConfirmDialog {...checkboxProps} />
  // @ts-expect-error 派生に Base の閉じ方を開放しない
  void <ConfirmDialog {...confirmProps} disablePointerDismissal={false} />
  // @ts-expect-error 派生に見た目の指定を開放しない
  void <ConfirmDialog {...confirmProps} className="p-0" />
  // @ts-expect-error 必須チェックの状態は外から変更できない
  void <CheckboxConfirmDialog {...checkboxProps} checked />
  // @ts-expect-error 派生に見た目の指定を開放しない
  void <CheckboxConfirmDialog {...checkboxProps} style={{ color: 'red' }} />

  void <OneTwoSplitLayout start={<ConfirmDialog {...confirmProps} />} end={<CheckboxConfirmDialog {...checkboxProps} />} />
}
