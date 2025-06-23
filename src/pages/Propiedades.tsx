import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import usePropiedadesResumen from "../hooks/usePropiedadesResumen";

const Propiedades = () => {
  const { alertaAlquileres, tabla } = usePropiedadesResumen();
  const [filtroTipo, setFiltroTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const estaPorVencer = (fechaFin: string) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diferencia = (fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return diferencia <= 30;
  };

  const resultados = tabla.filter((item) => {
    const coincideTipo =
      filtroTipo === "" || item.tipo.toLowerCase() === filtroTipo.toLowerCase();
    const coincideBusqueda =
      busqueda === "" ||
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.domicilio.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Propiedades</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-blue-700">Alquileres</h3>
          <p className="text-gray-600">Gestión de contratos, inquilinos y vencimientos.</p>
          <Link to="/propiedades/alquileres" className="text-blue-600 font-medium mt-2 block">
            Ir a Alquileres →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-blue-700">Consorcios</h3>
          <p className="text-gray-600">Expensas, gastos comunes y balances.</p>
          <Link to="/propiedades/consorcios" className="text-blue-600 font-medium mt-2 block">
            Ir a Consorcios →
          </Link>
        </div>
      </div>

      {alertaAlquileres.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6 flex items-center gap-2">
          📌 Hay {alertaAlquileres.length} contratos de alquiler próximos a vencer.
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar propiedad por dirección o nombre"
          className="flex-1 border rounded px-4 py-2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border rounded px-4 py-2 pr-10"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Tipo</option>
          <option value="alquiler">Alquiler</option>
          <option value="consorcio">Consorcio</option>
        </select>
      </div>

      <table className="min-w-full bg-white border rounded shadow text-sm mb-10">
        <thead className="bg-blue-100 text-left">
          <tr>
            <th className="py-2 px-4">Tipo</th>
            <th className="py-2 px-4">Nombre</th>
            <th className="py-2 px-4">Domicilio</th>
            <th className="py-2 px-4">Inicio</th>
            <th className="py-2 px-4">Fin</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((item, idx) => (
            <tr
              key={idx}
              className={`border-t hover:bg-gray-50 ${
                estaPorVencer(item.fin) ? "bg-yellow-100" : ""
              }`}
            >
              <td className="py-2 px-4">
                {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
              </td>
              <td className="py-2 px-4">{item.nombre}</td>
              <td className="py-2 px-4">{item.domicilio}</td>
              <td className="py-2 px-4">{item.inicio}</td>
              <td className="py-2 px-4">{item.fin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Propiedades;
