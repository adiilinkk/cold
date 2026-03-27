"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, X, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-lg border p-4 shadow-xl animate-fade-in backdrop-blur-sm",
            toast.type === "success" &&
              "border-[#22c55e]/30 bg-[#0a1628]/95 text-[#22c55e]",
            toast.type === "error" &&
              "border-red-500/30 bg-[#0a1628]/95 text-red-400",
            toast.type === "info" &&
              "border-[#2563eb]/30 bg-[#0a1628]/95 text-[#60a5fa]"
          )}
        >
          {toast.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
          {toast.type === "error" && <XCircle className="h-4 w-4 shrink-0" />}
          {toast.type === "info" && <Info className="h-4 w-4 shrink-0" />}
          <p className="text-sm font-medium text-[#e2e8f0] flex-1">
            {toast.message}
          </p>
          <button
            onClick={() => onRemove(toast.id)}
            className="shrink-0 text-[#475569] hover:text-[#e2e8f0] transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
