import { Navigate } from "react-router-dom";

const RequiredAuth = ({ Component }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default RequiredAuth;
