import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

interface Inquilino {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
}

const Inquilinos = () => {
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("inquilinos") || "[]");
    setInquilinos(guardados);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Inquilinos</h2>
          <Link
            to="/inquilinos/nuevo"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Nuevo inquilino
          </Link>
        </div>

        <div className="overflow-x-auto">
          {inquilinos.length === 0 ? (
            <p className="text-gray-500">No hay inquilinos cargados.</p>
          ) : (
            <table className="min-w-full bg-white border rounded shadow">
              <thead className="bg-blue-100 text-left">
                <tr>
                  <th className="py-2 px-4">Nombre</th>
                  <th className="py-2 px-4">DNI</th>
                  <th className="py-2 px-4">Teléfono</th>
                  <th className="py-2 px-4">Email</th>
                </tr>
              </thead>
              <tbody>
                {inquilinos.map((inq) => (
                  <tr key={inq.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{inq.nombre}</td>
                    <td className="py-2 px-4">{inq.dni}</td>
                    <td className="py-2 px-4">{inq.telefono}</td>
                    <td className="py-2 px-4">{inq.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Inquilinos;
