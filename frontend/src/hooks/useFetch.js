import { useCallback, useEffect, useState } from 'react';

export const useFetch = (loader, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loader();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  return { data, loading, error, refresh, setData };
};
