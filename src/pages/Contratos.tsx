import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

type Contrato = {
  id: string;
  propiedad: string;
  inquilino: string;
  desde: string;
  hasta: string;
  estado: string;
};

const Contratos = () => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [contratosPorVencer, setContratosPorVencer] = useState<Contrato[]>([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const soloPorVencer = params.get("porVencer") === "true";

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("contratos") || "[]");
    guardados.sort((a: Contrato, b: Contrato) => {
      return new Date(b.desde).getTime() - new Date(a.desde).getTime();
    });
    setContratos(guardados);

    const hoy = new Date();
    const porVencer = guardados.filter((contrato: any) => {
      const hasta = new Date(contrato.hasta);
      const dias = (hasta.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
      return dias > 0 && dias <= 30;
    });

    setContratosPorVencer(porVencer);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Contratos</h2>

        <div className="flex justify-end mb-4">
          <Link to="/nuevo-contrato" className="text-blue-600 hover:underline">
            + Nuevo contrato
          </Link>
        </div>

        {soloPorVencer && (
          <div className="mb-8">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4">
              Mostrando contratos que vencen en los próximos 30 días.
            </div>
            <table className="min-w-full bg-white border rounded shadow mb-10">
              <thead className="bg-blue-100 text-left">
                <tr>
                  <th className="py-2 px-4">Propiedad</th>
                  <th className="py-2 px-4">Inquilino</th>
                  <th className="py-2 px-4">Desde</th>
                  <th className="py-2 px-4">Hasta</th>
                  <th className="py-2 px-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {contratosPorVencer.map((contrato) => (
                  <tr key={contrato.id} className="border-t bg-yellow-50">
                    <td className="py-2 px-4">{contrato.propiedad}</td>
                    <td className="py-2 px-4">{contrato.inquilino}</td>
                    <td className="py-2 px-4">{contrato.desde}</td>
                    <td className="py-2 px-4">{contrato.hasta}</td>
                    <td className="py-2 px-4">{contrato.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-lg font-semibold mb-2">Listado general de contratos</h3>
          </div>
        )}

        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="py-2 px-4">Propiedad</th>
              <th className="py-2 px-4">Inquilino</th>
              <th className="py-2 px-4">Desde</th>
              <th className="py-2 px-4">Hasta</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map((contrato) => (
              <tr
                key={contrato.id}
                className={`border-t hover:bg-gray-50 ${
                  contratosPorVencer.find((c) => c.id === contrato.id) ? "bg-yellow-50" : ""
                }`}
              >
                <td className="py-2 px-4">{contrato.propiedad}</td>
                <td className="py-2 px-4">{contrato.inquilino}</td>
                <td className="py-2 px-4">{contrato.desde}</td>
                <td className="py-2 px-4">{contrato.hasta}</td>
                <td className="py-2 px-4">{contrato.estado}</td>
                <td className="py-2 px-4">
                  <button className="text-blue-600 hover:underline mr-3">Editar</button>
                  <button className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Contratos;
