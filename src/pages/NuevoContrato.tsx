import Sidebar from "../components/Sidebar";
import ContratoForm from "../components/ContratoForm";

const NuevoContrato = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Nuevo contrato</h2>
        <ContratoForm />
      </main>
    </div>
  );
};

export default NuevoContrato;
