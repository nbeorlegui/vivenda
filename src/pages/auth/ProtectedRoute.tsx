import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const user = localStorage.getItem("usuarioActivo");
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
