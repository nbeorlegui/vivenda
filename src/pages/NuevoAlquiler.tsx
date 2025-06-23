import Layout from "../components/Layout";
import AlquilerForm from "../components/AlquilerForm";
import { useNavigate } from "react-router-dom";

const NuevoAlquiler = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Nuevo alquiler</h2>
      <AlquilerForm onGuardarExitoso={() => navigate("/propiedades/alquileres")} />
    </Layout>
  );
};

export default NuevoAlquiler;
