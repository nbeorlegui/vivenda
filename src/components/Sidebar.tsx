import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [colapsado, setColapsado] = useState(false);
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo") || "null");

  const Item = ({ to, label }: { to: string; label: string }) => {
    const activo = location.pathname === to;
    const baseClass = "block px-4 py-2 rounded";
    const activoClass = "bg-blue-100 text-blue-700 font-medium";
    const inactivoClass = "text-gray-800 hover:bg-gray-100";

    return (
      <Link
        to={to}
        className={`${baseClass} ${!colapsado && activo ? activoClass : inactivoClass}`}
      >
        {!colapsado && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div
      className={`flex flex-col h-screen bg-white p-4 rounded-r-3xl transition-all duration-300 ${
        colapsado ? "w-12 items-center" : "w-48"
      }`}
    >
      {/* Logo y botón */}
      <div className="flex items-center justify-between mb-6">
        {!colapsado && <h1 className="text-xl font-bold">Vivenda</h1>}
        <button
          onClick={() => setColapsado(!colapsado)}
          className="rounded-full border p-1 w-6 h-6 flex items-center justify-center text-xs"
        >
          {colapsado ? "▶" : "◀"}
        </button>
      </div>

      {/* Navegación */}
      {!colapsado && (
        <nav className="flex flex-col gap-1 mb-auto">
          <Item to="/" label="Dashboard" />
          <Item to="/propiedades" label="Propiedades" />
          {/*<Item to="/contratos" label="Contratos" />*/}
          <Item to="/caja" label="Caja Alquileres" />
          <Item to="/inquilinos" label="Inquilinos" />
          {(usuarioActivo?.rol === "admin" || usuarioActivo?.rol === "superadmin") && (
            <Item to="/usuarios" label="Usuarios" />
          )}
          
        </nav>
      )}

      {/* Pie: nombre, rol y cerrar sesión */}
      {!colapsado && (
        <div className="mt-auto">
          {usuarioActivo && (
            <div className="text-sm text-gray-600 mb-2">
              <div className="font-medium">{usuarioActivo.nombre}</div>
              <div className="text-xs capitalize">{usuarioActivo.rol}</div>
            </div>
          )}
          <button
            className="text-red-600 hover:underline"
            onClick={() => {
              localStorage.removeItem("usuarioActivo");
              window.location.href = "/Login";
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
