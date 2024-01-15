import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequiredAuth = ({ Component }) => {
  const { auth } = useAuth();

  return auth.isAuth ? <Component /> : <Navigate to="/" />;
};

export default RequiredAuth;
