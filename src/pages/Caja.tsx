import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Movimiento = {
  nombre: string;
  dni: string;
  fecha: string;
  metodo: string;
  observacion: string;
  importe: number;
  tipo: "Ingreso" | "Egreso";
};

const Caja = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [filtro, setFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoImporte, setNuevoImporte] = useState("");
  const [nuevaObs, setNuevaObs] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const alquileres = JSON.parse(localStorage.getItem("alquileres") || "[]");
    const todosPagos: Movimiento[] = [];

    alquileres.forEach((a: any) => {
      const pagosKey = `pagos_${a.dni}_${a.inicio}`;
      const historial = JSON.parse(localStorage.getItem(pagosKey) || "[]");
      historial.forEach((p: any) => {
        todosPagos.push({
          nombre: a.inquilino,
          dni: a.dni,
          fecha: p.fecha,
          metodo: p.metodo,
          observacion: p.observacion || "Cobro de alquiler",
          importe: p.monto,
          tipo: "Ingreso",
        });
      });
    });

    const egresos = JSON.parse(localStorage.getItem("egresos") || "[]");
    setMovimientos([...todosPagos, ...egresos]);
  }, []);

  const movimientosFiltrados = movimientos.filter((m) => {
    const matchTexto =
      (m.nombre?.toLowerCase() || "").includes(filtro.toLowerCase()) ||
      (m.dni || "").includes(filtro) ||
      (m.fecha || "").includes(filtro) ||
      (m.observacion?.toLowerCase() || "").includes(filtro.toLowerCase());

    const matchFecha =
      (!fechaInicio || m.fecha >= fechaInicio) &&
      (!fechaFin || m.fecha <= fechaFin);

    return matchTexto && matchFecha;
  });

  const total = movimientosFiltrados.reduce(
    (acc, m) => acc + (m.tipo === "Ingreso" ? m.importe : -m.importe),
    0
  );

  const exportarPDF = () => {
    if (typeof window === "undefined" || movimientosFiltrados.length === 0) return;
    const nombre = movimientosFiltrados[0].nombre || "rendicion";
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Rendición de pagos", 14, 20);

    const data = movimientosFiltrados.map((m) => [
      m.tipo === "Egreso"
        ? new Date(m.fecha).toLocaleDateString("es-AR", { day: "numeric", month: "numeric", year: "numeric" })
        : m.fecha,
      m.nombre,
      m.dni,
      m.tipo,
      m.metodo,
      m.observacion,
      `$${m.tipo === "Egreso" ? "-" : ""}${m.importe.toLocaleString()}`,
    ]);


    const table = autoTable(doc, {
      startY: 30,
      head: [["Fecha", "Inquilino", "DNI", "Tipo", "Método", "Observación", "Importe"]],
      body: data,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    const finalY = (table as any)?.finalY || 30;
    doc.setFontSize(12);
    doc.text(`Total: $${total.toLocaleString()}`, 14, finalY + 10);
    doc.save(`${nombre}_rendicion.pdf`);
  };

  const guardarEgreso = () => {
    const importeNumero = parseFloat(nuevoImporte);
    if (isNaN(importeNumero) || importeNumero <= 0) return;

    const nuevo: Movimiento = {
      nombre: "-",
      dni: "-",
      fecha: fechaEgreso,
      metodo: "-",
      observacion: nuevaObs || "Egreso manual",
      importe: importeNumero,
      tipo: "Egreso",
    };
    const egresosActuales = JSON.parse(localStorage.getItem("egresos") || "[]");
    const actualizados = [...egresosActuales, nuevo];
    localStorage.setItem("egresos", JSON.stringify(actualizados));
    setMovimientos((prev) => [...prev, nuevo]);
    setMostrarModal(false);
    setNuevoImporte("");
    setNuevaObs("");
    setFechaEgreso(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Caja</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Total en cuenta</p>
            <p className="text-2xl font-semibold text-green-600">${total.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <input type="text" placeholder="Buscar..." className="border rounded px-3 py-2 w-64"
            value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}
            className="border rounded px-3 py-2" />
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}
            className="border rounded px-3 py-2" />
          <button onClick={exportarPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Exportar Rendición
          </button>
          <button onClick={() => setMostrarModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Cargar gasto
          </button>
        </div>

        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="p-2">Inquilino</th>
              <th className="p-2">DNI</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Método</th>
              <th className="p-2">Observación</th>
              <th className="p-2">Importe</th>
            </tr>
          </thead>
          <tbody>
  {movimientosFiltrados.map((m, idx) => (
    <tr key={idx} className={`border-t ${m.tipo === "Egreso" ? "bg-red-50" : "hover:bg-gray-50"}`}>
      <td className="p-2">{m.nombre}</td>
      <td className="p-2">{m.dni}</td>
      <td className="p-2">
        {m.tipo === "Egreso"
          ? new Date(m.fecha).toLocaleDateString("es-AR", { day: "numeric", month: "numeric", year: "numeric" })
          : m.fecha}
      </td>
      <td className="p-2">{m.tipo}</td>
      <td className="p-2">{m.metodo}</td>
      <td className="p-2">{m.observacion}</td>
      <td className="p-2">{m.tipo === "Egreso" ? "-" : ""}${m.importe.toLocaleString()}</td>
    </tr>
     ))}
      </tbody>
        </table>
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Nuevo egreso</h3>
              <input type="date" className="border rounded px-3 py-2 w-full mb-3" value={fechaEgreso}
                onChange={(e) => setFechaEgreso(e.target.value)} />
              <input type="text" placeholder="Importe"
                className="border rounded px-3 py-2 w-full mb-3"
                value={nuevoImporte} onChange={(e) => setNuevoImporte(e.target.value)} />
              <input type="text" placeholder="Observaciones"
                className="border rounded px-3 py-2 w-full mb-3"
                value={nuevaObs} onChange={(e) => setNuevaObs(e.target.value)} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setMostrarModal(false)} className="text-gray-600 hover:text-black">Cancelar</button>
                <button onClick={guardarEgreso}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Caja;