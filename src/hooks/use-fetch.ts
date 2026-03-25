import { useState, useEffect } from "react";
import { analyticsService } from "../services/analytics-service";

type UseFetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type UseFetchReturn<T> = UseFetchState<T> & {
  refetch: () => Promise<void>;
};

export function useFetch<T>(
  fetchFunction: () => Promise<T>,
  dependencies: unknown[] = []
): UseFetchReturn<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFunction();
      setState({ data: result, loading: false, error: null });
      analyticsService.logEvent("data_fetch_success", {
        dataType: typeof result,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setState({ data: null, loading: false, error: errorMessage });
      analyticsService.logError(errorMessage, "fetch_error");
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    ...state,
    refetch: fetchData,
  };
}
