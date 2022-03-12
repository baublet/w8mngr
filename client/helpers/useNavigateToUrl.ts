import { useHistory } from "react-router";

export function useNavigateToUrl() {
  const history = useHistory();

  return (
    url: string,
    options: { replace?: boolean; scroll?: boolean } = {}
  ) => {
    if (options.replace) {
      history.replace(url);
    } else {
      history.push(url);
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
