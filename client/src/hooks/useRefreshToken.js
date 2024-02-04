import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateToken } from "../pages/authentication/authSlice";
import { logout } from "../api";

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      dispatch(updateToken(response.data));
      return response.data.accessToken;
    } catch (error) {
      dispatch(logout());
      navigate("/");
    }
  };
  return refresh;
};

export default useRefreshToken;
