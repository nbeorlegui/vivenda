import { useEffect, useState } from "react";
import TablaAlquileres from "../components/TablaAlquileres";
import Layout from "../components/Layout";

interface Alquiler {
  inquilino: string;
  dni: string;
  telefono: string;
  email: string;
  domicilio: string;
  inicio: string;
  fin: string;
  valorMensual: number;
  tipoAumento: string;
  formaPago: string;
  archivo: string;
  inicioRenovacionCanon: string;
  proximaRenovacionCanon: string;
  [key: string]: any;
}

const Alquileres = () => {
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarAlquileres = () => {
    const data = localStorage.getItem("alquileres");
    if (data) {
      setAlquileres(JSON.parse(data));
    }
  };

  useEffect(() => {
    cargarAlquileres();
  }, []);

  const alquileresFiltrados = alquileres.filter((a) =>
    a.inquilino.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Alquileres</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            location.href = "/propiedades/nuevo-alquiler";
          }}
        >
          + Nuevo alquiler
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <TablaAlquileres datos={alquileresFiltrados} onActualizar={cargarAlquileres} />
    </Layout>
  );
};

export default Alquileres;
