// src/pages/Dashboard.tsx
import Layout from "../components/Layout";
import TablaAlquileres from "../components/TablaAlquileres";
import { useState } from "react";

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

const calcularDiasRestantes = (fechaStr: string): number => {
  const hoy = new Date();
  const fecha = new Date(fechaStr);
  return Math.floor((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
};

const obtenerProximaRenovacion = (inicioStr: string, tipo: string): string => {
  const inicio = new Date(inicioStr);
  const hoy = new Date();
  const meses = tipo === "Mensual" ? 1 : tipo === "Trimestral" ? 3 : tipo === "Semestral" ? 6 : tipo === "Anual" ? 12 : 0;

  if (meses === 0 || isNaN(inicio.getTime())) return "";

  const fecha = new Date(inicio);
  while (fecha < hoy) {
    fecha.setMonth(fecha.getMonth() + meses);
  }

  return fecha.toISOString().split("T")[0]; // yyyy-mm-dd
};

const Dashboard = () => {
  const [mostrarModalSuba, setMostrarModalSuba] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Alquiler[]>([]);
  const [porcentaje, setPorcentaje] = useState("");
  const [valorFinal, setValorFinal] = useState(0);

  const alquileres: Alquiler[] = JSON.parse(localStorage.getItem("alquileres") || "[]");

  const contratosPorVencer = alquileres.filter((a) => {
    const dias = calcularDiasRestantes(a.fin);
    return dias <= 30 && dias >= 0;
  });

  const renovacionesCanon = alquileres
    .map((a) => {
      const proximaRenovacion = obtenerProximaRenovacion(a.inicioRenovacionCanon, a.tipoAumento);
      const dias = calcularDiasRestantes(proximaRenovacion);
      return { ...a, proximaRenovacionCanon: proximaRenovacion, diasRenovacion: dias };
    })
    .filter((a) => a.diasRenovacion <= 30 && a.diasRenovacion >= 0);

  const toggleSeleccion = (alquiler: Alquiler) => {
    setSeleccionados((prev) => {
      const existe = prev.find((a) => a.dni === alquiler.dni && a.inicio === alquiler.inicio);
      return existe ? prev.filter((a) => a.dni !== alquiler.dni || a.inicio !== alquiler.inicio) : [...prev, alquiler];
    });
  };

  const calcularSuba = () => {
    if (!porcentaje || seleccionados.length === 0) return;
    const nuevoPorcentaje = parseFloat(porcentaje);
    const nuevos = seleccionados.map((a) => {
      const nuevoValor = parseFloat((a.valorMensual * (1 + nuevoPorcentaje / 100)).toFixed(2));
      const key = `subas_${a.dni}_${a.inicio}`;
      const historial = JSON.parse(localStorage.getItem(key) || "[]");
      const nuevaSuba = {
        fecha: new Date().toLocaleDateString("es-AR"),
        porcentaje: nuevoPorcentaje,
        nuevoCanon: nuevoValor,
      };
      localStorage.setItem(key, JSON.stringify([...historial, nuevaSuba]));

      const todos = JSON.parse(localStorage.getItem("alquileres") || "[]");
      const index = todos.findIndex((al: Alquiler) => al.dni === a.dni && al.inicio === a.inicio);
      if (index !== -1) {
        todos[index].valorMensual = nuevoValor;
        localStorage.setItem("alquileres", JSON.stringify(todos));
      }

      return nuevoValor;
    });
    setValorFinal(nuevos[0]);
    setPorcentaje("");
    setSeleccionados([]);
    setMostrarModalSuba(false);
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="mb-6 text-gray-600">📊 Desde este panel podés visualizar los datos generales del sistema Vivenda.</p>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500 text-sm">🏠 Total de alquileres</p>
          <h3 className="text-2xl font-bold">{alquileres.length}</h3>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500 text-sm">📅 Contratos por vencer</p>
          <h3 className="text-2xl font-bold">{contratosPorVencer.length}</h3>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500 text-sm">🔁 Subas de alquileres</p>
          <h3 className="text-2xl font-bold">{renovacionesCanon.length}</h3>
        </div>
      </div>

      {contratosPorVencer.length > 0 && (
        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">📅 Contratos por vencer (menos de 30 días)</h3>
          <TablaAlquileres datos={contratosPorVencer} mostrarDetalles={false} />
        </div>
      )}

      {renovacionesCanon.length > 0 && (
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">🔁 Subas de alquileres (menos de 30 días)</h3>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setMostrarModalSuba(true)}
            >
              Calcular Suba
            </button>
          </div>
          <TablaAlquileres
            datos={renovacionesCanon}
            mostrarDetalles={false}
            seleccionables={true}
            seleccionados={seleccionados}
            onSeleccionar={toggleSeleccion}
          />
        </div>
      )}

      {mostrarModalSuba && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Calcular Suba de Canon</h2>
            <p className="mb-2">Valor actual: ${seleccionados[0]?.valorMensual}</p>
            <input
              type="number"
              placeholder="Porcentaje de suba (%)"
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            {porcentaje && (
              <p className="mb-4">
                Nuevo valor: $
                {(seleccionados[0]?.valorMensual * (1 + parseFloat(porcentaje) / 100)).toFixed(2)}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={calcularSuba}
              >
                Guardar
              </button>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setMostrarModalSuba(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
