import React from "react";
import cx from "classnames";

/**
 * Vertically-clamps the content to a percentage of the viewport height. Overflow
 * will scroll.
 */
export function VerticallyWindowed({
  percent,
  className,
  gap = "gap-2",
  children,
}: React.PropsWithChildren<{
  percent: number;
  gap?: "gap-2";
  className?: string;
}>) {
  const [height, setHeight] = React.useState("999px");
  const [applyHeight, setApplyHeight] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const newHeight = Math.floor(windowHeight * (percent / 100));
      setHeight(`${newHeight}px`);
      if (windowWidth > 768) {
        setApplyHeight(false);
      } else {
        setApplyHeight(true);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cx("overflow-x-hidden w-full overflow-y-auto", className)}
      style={{
        maxHeight: applyHeight ? height : undefined,
      }}
    >
      <div className={cx("flex flex-col w-full", gap)}>{children}</div>
    </div>
  );
}
