"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Toast = { id: number; message: string; tone: "ok" | "error" };

type ToastApi = { push: (message: string, tone?: "ok" | "error") => void };

const ToastContext = createContext<ToastApi | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: "ok" | "error" = "ok") => {
    const id = nextId++;
    setToasts((current) => [...current.slice(-2), { id, message, tone }]);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 left-4 z-[60] flex flex-col gap-2 sm:left-auto sm:right-6"
      >
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDone={() =>
              setToasts((current) =>
                current.filter((item) => item.id !== toast.id),
              )
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2.5 rounded-full border px-4 py-2.5 font-mono text-[11px] shadow-none ${
        toast.tone === "error"
          ? "border-signal/40 bg-signal-soft text-signal-deep"
          : "border-rule bg-paper text-ink"
      }`}
      style={{ animation: "rise 220ms var(--ease-expo) both" }}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${
          toast.tone === "error" ? "bg-signal" : "bg-ok"
        }`}
      />
      {toast.message}
    </div>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
