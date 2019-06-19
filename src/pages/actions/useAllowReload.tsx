import { useEffect } from "react";

export default function useAllowReload(
  condition: boolean,
  setAllowReload: (arg: boolean) => void
) {
  useEffect(() => {
    condition ? setAllowReload(false) : setAllowReload(true);
  }, [condition, setAllowReload]);
}
