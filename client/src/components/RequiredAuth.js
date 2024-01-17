import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequiredAuth = ({ Component }) => {
  const { isAuth } = useSelector((state) => state.auth);

  return isAuth ? <Component /> : <Navigate to="/" />;
};

export default RequiredAuth;
