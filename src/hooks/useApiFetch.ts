import { useEffect, useRef, useCallback, useDebugValue } from 'react';

export function useApiFetch(
  url:        string,
  params:     Record<string, string | Array<string>>,
  autoFetch:  boolean = true
): [boolean, (newParams?: Record<string, string | Array<string>>) => Promise<Object>, any] {

  const isLoading  = useRef<boolean>(false);
  const errors     = useRef<any>(null);
  const controller = useRef<AbortController | null>(null);

  useDebugValue(isLoading.current ? 'Loading...' : 'Idle');

  const buildQuery = (p: Record<string, string | Array<string>>) => {
    const query = new URLSearchParams();
    for (const key in p) {
      const value = p[key];
      if (Array.isArray(value)) {
        value.forEach(v => query.append(key, v));
      } else {
        query.append(key, value);
      }
    }
    return query.toString();
  };

  const fetchData = useCallback(async (overrideParams?: Record<string, string | Array<string>>) => {
    const fullUrl = `${url}?${buildQuery(overrideParams || params)}`;
    controller.current = new AbortController();
    const signal = controller.current.signal;

    isLoading.current = true;
    let data: Object = {};

    try {
      const res = await fetch(fullUrl, { signal });
      if (!res.ok)
        throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();
      data = json;
      errors.current = null;
    } catch (err) {
      if ((err as any).name !== 'AbortError') 
        errors.current = err;
    } finally {
      console.log("FETCHED");
      isLoading.current = false;
    }

    return data;
  }, [url, params]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    return () => controller.current?.abort();
  }, []);

  return [isLoading.current, fetchData, errors.current];
}
