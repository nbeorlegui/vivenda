import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PropiedadForm from "../components/PropiedadForm";

const NuevaPropiedad = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-block text-blue-600 hover:underline"
        >
          ← Volver
        </button>

        <h2 className="text-2xl font-bold mb-6">Nueva Propiedad</h2>
        <PropiedadForm />
      </main>
    </div>
  );
};

export default NuevaPropiedad;
