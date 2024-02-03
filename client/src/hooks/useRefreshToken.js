import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { updateToken } from "../pages/authentication/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });
    dispatch(updateToken(response.data));
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
