"use client";

import * as React from "react";

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useApi<T>(fn: () => Promise<T>, deps: React.DependencyList = []) {
  const [state, setState] = React.useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const fnRef = React.useRef(fn);

  // Keep the latest fn in a ref without reading it during render.
  React.useEffect(() => {
    fnRef.current = fn;
  });

  React.useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fnRef
      .current()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((e) => {
        if (active)
          setState({ data: null, loading: false, error: e?.message ?? "Failed to load" });
      });
    return () => {
      active = false;
    };
  }, deps);

  return state;
}
