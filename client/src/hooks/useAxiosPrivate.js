import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    let refreshTokenPromise;
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          if (!refreshTokenPromise) {
            refreshTokenPromise = refresh().then((token) => {
              refreshTokenPromise = null;
              return token;
            });
          }

          return refreshTokenPromise.then((token) => {
            prevRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosPrivate(prevRequest);
          });
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
