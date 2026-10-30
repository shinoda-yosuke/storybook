import { useEffect, useRef, useState } from 'react'

// 通信の代わりに800ms待ち、最初の試行は失敗、再試行は成功する使用例。
export function useAsyncConfirmationExample() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [result, setResult] = useState('未操作')
  const inFlight = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current)
  }, [])

  return {
    open,
    pending,
    error,
    attempts,
    result,
    show() {
      setAttempts(0)
      setError(null)
      setOpen(true)
    },
    confirm() {
      if (inFlight.current) return
      inFlight.current = true
      setPending(true)
      setError(null)
      const attempt = attempts + 1
      setAttempts(attempt)
      timer.current = setTimeout(() => {
        inFlight.current = false
        setPending(false)
        if (attempt === 1) {
          setError('処理に失敗しました。内容を確認して、もう一度お試しください。')
        } else {
          setResult('確定しました')
          setOpen(false)
        }
      }, 800)
    },
    cancel() {
      setResult('キャンセルしました')
      setOpen(false)
    },
  }
}
