"use client"

import { toast as uiToast } from "@/components/ui/toast"

export const Toast = {
  success: (msg: string) => uiToast.success(msg),
  error: (msg: string) => uiToast.error(msg),
  info: (msg: string) => uiToast.message(msg),
  loading: (msg: string) => uiToast.loading(msg),
  dismiss: () => uiToast.dismiss(),
}
