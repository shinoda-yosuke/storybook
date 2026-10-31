import { Button } from '@/elements/button'
import { Checkbox } from '@/elements/checkbox'
import { TextInput } from '@/elements/text-input'
import { EmailPasswordLoginForm } from '@/components/email-password-login-form'
import { ConfirmDialog, ConfirmDialogHeader, ConfirmDialogContent, type ConfirmDialogProps } from '@/components/confirm-dialog'
import { CheckboxConfirmDialog, CheckboxConfirmDialogHeader, CheckboxConfirmDialogContent, type CheckboxConfirmDialogProps } from '@/components/checkbox-confirm-dialog'
import { OneTwoSplitLayout } from '@/layouts/local/one-two-split-layout'

// 公開 API が広がったときも、見た目の指定や Base の機能開放を型チェックで検出する。
export function checkPublicUIContracts() {
  void <Button purpose="agree" type="submit" size="sm" width="fill" form="settings">保存</Button>
  void <Button purpose="decline" disabled aria-label="閉じる" />
  void <Checkbox checked required name="agreement" onCheckedChange={() => {}} />
  void <TextInput type="email" name="email" autoComplete="username" required />
  void <EmailPasswordLoginForm onSubmit={() => {}} pending error={<p>再試行できます</p>} />
  // @ts-expect-error 入力の見た目は内部で固定する
  void <TextInput className="bg-red-500" />
  // @ts-expect-error 入力の見た目は内部で固定する
  void <TextInput style={{ color: 'red' }} />
  // @ts-expect-error TextInput は文字の入力に限定する
  void <TextInput type="checkbox" />
  // @ts-expect-error 派生の入力項目は外から変更できない
  void <EmailPasswordLoginForm onSubmit={() => {}}><input /></EmailPasswordLoginForm>
  // @ts-expect-error 派生に見た目の変更を公開しない
  void <EmailPasswordLoginForm onSubmit={() => {}} className="p-0" />

  // @ts-expect-error 目的の指定は必須
  void <Button>実行</Button>
  // @ts-expect-error データの状態変化を目的にしない
  void <Button purpose="delete" />
  // @ts-expect-error 送信方法はユーザーの意思とは別に指定する
  void <Button purpose="submit" />
  // @ts-expect-error 見た目によるバリアントは公開しない
  void <Button purpose="agree" variant="outline" />
  void <Button purpose="decline" type="submit">拒否を送信する</Button>
  // @ts-expect-error HTML の type には HTML の動作だけを指定する
  void <Button purpose="agree" type="execute" />
  // @ts-expect-error 幅には配置上の意味が限定された値だけを指定する
  void <Button purpose="agree" width="red" />
  // @ts-expect-error 見た目の上書きを公開しない
  void <Button purpose="agree" className="bg-red-500" />
  // @ts-expect-error インラインスタイルを公開しない
  void <Button purpose="agree" style={{ color: 'red' }} />
  // @ts-expect-error 描画の差し替えを公開しない
  void <Button purpose="agree" render={<a href="/" />} />
  // @ts-expect-error 色を指定する HTML 属性も公開しない
  void <Button purpose="agree" color="red" />
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
  void <ConfirmDialog {...confirmProps} pending error={<p>再試行できます</p>} />
  void <CheckboxConfirmDialog {...checkboxProps} pending error={<p>再試行できます</p>} />
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
