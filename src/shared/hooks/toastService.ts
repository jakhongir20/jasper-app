type ToastType = "success" | "error" | "warning";

let globalToastFn: ((message: string, type: ToastType) => void) | null = null;

export function setGlobalToastFunction(
  fn: (message: string, type: ToastType) => void,
) {
  globalToastFn = fn;
}

export function showGlobalToast(message: string, type: ToastType) {
  if (!globalToastFn) {
    return;
  }
  globalToastFn(message, type);
}
