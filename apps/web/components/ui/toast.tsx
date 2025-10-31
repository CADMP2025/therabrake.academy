"use client"

// Wrapper around react-hot-toast to provide a consistent API
import toastLib, { Toaster, ToastBar, ToastOptions } from "react-hot-toast"

export const toast = {
  success: (msg: string, opts?: ToastOptions) => toastLib.success(msg, opts),
  error: (msg: string, opts?: ToastOptions) => toastLib.error(msg, opts),
  loading: (msg: string, opts?: ToastOptions) => toastLib.loading(msg, opts),
  message: (msg: string, opts?: ToastOptions) => toastLib(msg, opts),
  dismiss: toastLib.dismiss,
}

export function AppToaster() {
  return (
    <Toaster position="top-right">
      {(t) => (
        <ToastBar
          toast={t}
          style={{}}
        />
      )}
    </Toaster>
  )
}
