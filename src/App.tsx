import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Alquileres from "./pages/Alquileres";
import NuevoAlquiler from "./pages/NuevoAlquiler";
import Historial from "./pages/Historial";
import Caja from "./pages/Caja";
import Inquilinos from "./pages/Inquilinos";
{/*import Contratos from "./pages/Contratos";*/}
import Clientes from "./pages/Clientes";
import Configuracion from "./pages/Configuracion";
import Propiedades from "./pages/Propiedades";
import Login from "./pages/auth/Login";
import {useEffect} from "react";
import Usuarios from "./pages/Usuarios"; 
import ProtectedRoute from "./pages/auth/ProtectedRoute";




function App() {
useEffect(() => {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const yaExisteSuperadmin = usuarios.some((u: any) => u.rol === "superadmin");

  if (!yaExisteSuperadmin) {
    const nuevoSuperadmin = {
      nombre: "Vivenda Admin",
      usuario: "nicolas",
      password: "Barino11", 
      rol: "superadmin"
    };
    localStorage.setItem("usuarios", JSON.stringify([...usuarios, nuevoSuperadmin]));
  }
}, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/propiedades/alquileres" element={<Alquileres />} />
        <Route path="/propiedades/nuevo-alquiler" element={<NuevoAlquiler />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/caja" element={<Caja />} />
        <Route path="/inquilinos" element={<Inquilinos />} />
        {/*<Route path="/contratos" element={<Contratos />} />*/}
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/propiedades" element={<Propiedades />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />

      </Routes>
    </Router>
    
  );
}

export default App;
