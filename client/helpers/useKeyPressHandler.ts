import React from "react";

export function useKeyPressHandler(
  key: "up" | "down" | "left" | "right" | "enter" | "esc",
  passedHandler: (event: KeyboardEvent) => void
): void {
  const handlerRef = React.useRef(passedHandler);
  const [, setLastMs] = React.useState(() => Date.now());

  React.useEffect(() => {
    handlerRef.current = passedHandler;
  }, [passedHandler]);

  const handler = React.useCallback<(event: KeyboardEvent) => void>((event) => {
    setLastMs((lastMs) => {
      const now = Date.now();
      const shouldSkip = now - lastMs < 100;
      if (shouldSkip) {
        return lastMs;
      }
      runHandlerIfKeyMatches(key, event, handlerRef.current);
      return now;
    });
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
}

function runHandlerIfKeyMatches(
  userKey: "up" | "down" | "left" | "right" | "enter" | "esc",
  event: KeyboardEvent,
  handler: (event: KeyboardEvent) => void
) {
  const eventKey = event.key;

  if (userKey === "up" && eventKey !== "ArrowUp") return;
  if (userKey === "down" && eventKey !== "ArrowDown") return;
  if (userKey === "enter" && eventKey !== "Enter") return;
  if (userKey === "esc" && eventKey !== "Escape") return;
  if (userKey === "left" && eventKey !== "ArrowLeft") return;
  if (userKey === "right" && eventKey !== "ArrowRight") return;

  handler(event);
}
