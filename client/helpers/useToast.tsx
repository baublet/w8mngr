import cx from "classnames";
import React from "react";

import { DeleteIconButton } from "../components/Button/DeleteIconButton";

function notImplemented() {
  throw new Error("Not implemented");
}

type ToastOptions = {
  timeoutMs?: number;
};

type ToastMessage = {
  id: string;
  type: "success" | "error";
  textOrComponent: React.ReactNode | Error;
};

export const ToastContext = React.createContext<{
  success: (message: React.ReactNode, options?: ToastOptions) => void;
  error(message: Error): void;
  error(message: React.ReactNode | Error, options?: ToastOptions): void;
}>({
  success: notImplemented,
  error: notImplemented,
});

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }: React.PropsWithChildren<{}>) {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);

  const success = React.useCallback(
    (messageToAdd: React.ReactNode, options: ToastOptions = {}) => {
      const { timeoutMs = 4000 } = options;
      const id = `${Date.now()}-${Math.random()}`;
      setMessages((message) => {
        return [
          ...message,
          { id, type: "success", textOrComponent: messageToAdd },
        ];
      });
      if (timeoutMs > 0) {
        setTimeout(() => {
          setMessages((message) => message.filter((m) => m.id !== id));
        }, timeoutMs);
      }
    },
    []
  );

  const error = React.useCallback(
    (messageToAdd: React.ReactNode | Error, options: ToastOptions = {}) => {
      const { timeoutMs = 0 } = options;
      const id = `${Date.now()}-${Math.random()}`;
      setMessages((message) => {
        return [
          ...message,
          { id, type: "error", textOrComponent: messageToAdd },
        ];
      });
      if (timeoutMs > 0) {
        setTimeout(() => {
          setMessages((message) => message.filter((m) => m.id !== id));
        }, timeoutMs);
      }
    },
    []
  );

  const getDismissHandler = React.useCallback((id: string) => {
    return () => setMessages((message) => message.filter((m) => m.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ success, error }}>
      <div className="relative">
        <div className="absolute right-0 top-0 space-y-4 z-50 pointer-events-none">
          {messages.map((message) => (
            <Message
              key={message.id}
              type={message.type}
              message={message.textOrComponent}
              dismiss={getDismissHandler(message.id)}
            />
          ))}
        </div>
        {children}
      </div>
    </ToastContext.Provider>
  );
}

function Message({
  message,
  type,
  dismiss,
}: {
  type: "error" | "success";
  message: React.ReactNode | Error;
  dismiss: () => void;
}) {
  const messageText = React.useMemo(() => {
    if (message instanceof Error) {
      console.error(message);
      return (
        <div>
          <div className="uppercase text-rose-500 mb-2 font-bold text-xs">
            Unexpected error
          </div>
          <div>{message.message}</div>
        </div>
      );
    }
    return message;
  }, [message]);

  const fadeout = type === "success";

  return (
    <div className="toast">
      <div
        className={cx(
          "w-96 text-md shadow-lg p-4 rounded-lg border-t-4 bg-white relative pointer-events-auto",
          {
            "toast-fadeout": fadeout,
            "border-rose-500": type === "error",
            "border-emerald-500": type === "success",
          }
        )}
      >
        <div className="absolute right-2 top-2">
          <DeleteIconButton onClick={dismiss} />
        </div>
        <div className="text-sm">{messageText}</div>
      </div>
    </div>
  );
}
