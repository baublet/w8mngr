import React from "react";

export function useUrlSearchParams() {
  console.log("useUrlSearchParams");
  const [, _render] = React.useState(false);
  const render = React.useCallback(() => _render((r) => !r), []);
  const lastSearchString = React.useRef<string>();
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (window.location.search !== lastSearchString.current) {
        lastSearchString.current = window.location.search;
        render();
      }
    }, 10);
    return () => clearInterval(interval);
  }, []);

  const searchParams = React.useMemo(
    () => new URLSearchParams(window.location.search),
    [window.location.search],
  );

  return searchParams;
}
