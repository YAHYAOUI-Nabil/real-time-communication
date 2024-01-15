import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuth: false,
    isValid: false,
    isRegistered: false,
  });
  const [toggle, setToggle] = useState("signup");

  return (
    <AuthContext.Provider value={{ auth, setAuth, toggle, setToggle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
