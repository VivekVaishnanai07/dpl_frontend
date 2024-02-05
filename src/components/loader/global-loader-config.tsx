import { useCallback, useEffect, useMemo, useState } from "react";
import ax from "../../utils/util";

export const GlobalLoaderConfig = () => {
  const [counter, setCounter] = useState<any>(0);

  const inc = useCallback(() => setCounter((counter: any) => counter + 1), [
    setCounter
  ]); // add to counter
  const dec = useCallback(() => setCounter((counter: any) => counter - 1), [
    setCounter
  ]); // remove from counter

  const interceptors: any = useMemo(
    () => ({
      request: (config: any) => {
        inc();
        return config;
      },
      response: (response: any) => {
        dec();
        return response;
      },
      error: (error: any) => {
        dec();
        return Promise.reject(error);
      }
    }),
    [inc, dec]
  ); // create the interceptors

  useEffect(() => {
    // add request interceptors
    ax.interceptors.request.use(interceptors.request, interceptors.error);
    // add response interceptors
    ax.interceptors.response.use(interceptors.response, interceptors.error);
    return () => {
      // remove all intercepts when done
      ax.interceptors.request.eject(interceptors.request);
      ax.interceptors.request.eject(interceptors.error);
      ax.interceptors.response.eject(interceptors.response);
      ax.interceptors.response.eject(interceptors.error);
    };
  }, [interceptors]);

  return [counter > 0];
};