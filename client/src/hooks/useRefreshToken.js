import axios from "../api/axios";

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
