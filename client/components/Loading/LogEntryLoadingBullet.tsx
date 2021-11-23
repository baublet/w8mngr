import React from "react";
import cx from "classnames";

export function LogEntryLoadingBullet({
  visible = true,
  minimumMsToVisible = 1,
  maximumMsToVisible = 800,
}: {
  minimumMsToVisible?: number;
  visible?: boolean;
  minimumMsVisible?: number;
  maximumMsToVisible?: number;
} = {}) {
  const [isVisible, setIsVisible] = React.useState(visible);

  React.useEffect(() => {
    if (visible && !isVisible) {
      const interval = setInterval(() => {
        if (setIsVisible) {
          setIsVisible(true);
        }
      }, minimumMsToVisible);
      return () => clearInterval(interval);
    }

    if (!visible && isVisible) {
      setIsVisible(true);
      const interval = setInterval(() => {
        if (setIsVisible) {
          setIsVisible(false);
        }
      }, maximumMsToVisible);
      return () => clearInterval(interval);
    }
  }, [visible]);

  return (
    <div className="animate-pulse" style={{ transform: "translateY(-.5em)" }}>
      <div
        className={cx(
          "absolute rounded-full bg-purple-700 w-3 h-3 transition-opacity duration-700",
          {
            "opacity-0": !isVisible,
            "opacity-1": isVisible,
          }
        )}
        title="Updating"
      />
    </div>
  );
}
