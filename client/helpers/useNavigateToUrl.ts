import useLocation from "wouter/use-location";

export function useNavigateToUrl() {
  const [, navigate] = useLocation();

  return (
    url: string,
    options: { replace?: boolean; scroll?: boolean } = {}
  ) => {
    if (options.replace) {
      navigate(url, { replace: true });
    } else {
      navigate(url);
    }

    if (options.scroll === false) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 10);
    }
  };
}
