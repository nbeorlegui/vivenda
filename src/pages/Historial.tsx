import Layout from "../components/Layout";

interface Movimiento {
  fecha: string;
  monto: number;
  formaPago: string;
  observacion?: string;
  inquilino: string;
  domicilio: string;
}

const Historial = () => {
  const alquileres = JSON.parse(localStorage.getItem("alquileres") || "[]");

  const movimientos: Movimiento[] = alquileres.flatMap((a: any) =>
    (a.historial || []).map((mov: any) => ({
      fecha: mov.fecha,
      monto: mov.monto,
      formaPago: mov.formaPago,
      observacion: mov.observacion,
      inquilino: a.inquilino,
      domicilio: a.domicilio,
    }))
  );

  movimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">📄 Historial de cobros</h2>

      {movimientos.length === 0 ? (
        <p className="text-gray-500">No hay cobros registrados todavía.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Inquilino</th>
                <th className="p-3">Domicilio</th>
                <th className="p-3">Importe</th>
                <th className="p-3">Forma de pago</th>
                <th className="p-3">Observación</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">{mov.fecha}</td>
                  <td className="p-3">{mov.inquilino}</td>
                  <td className="p-3">{mov.domicilio}</td>
                  <td className="p-3">${mov.monto.toLocaleString()}</td>
                  <td className="p-3">{mov.formaPago}</td>
                  <td className="p-3">{mov.observacion || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Historial;
