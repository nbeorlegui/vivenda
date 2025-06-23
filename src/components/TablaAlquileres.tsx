import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import AlquilerForm from "./AlquilerForm";

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

interface Props {
  datos: Alquiler[];
  onActualizar?: () => void;
  mostrarDetalles?: boolean;
  seleccionables?: boolean;
  seleccionados?: Alquiler[];
  onSeleccionar?: (a: Alquiler) => void;
}

const TablaAlquileres = ({
  datos,
  onActualizar,
  mostrarDetalles = true,
  seleccionables = false,
  seleccionados = [],
  onSeleccionar,
}: Props) => {
  const [alquilerSeleccionado, setAlquilerSeleccionado] = useState<Alquiler | null>(null);
  const [menuIndexAbierto, setMenuIndexAbierto] = useState<number | null>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarEdicion, setMostrarEdicion] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [pagos, setPagos] = useState<{ fecha: string; monto: number; metodo: string }[]>([]);
  const [subas, setSubas] = useState<{ fecha: string; porcentaje: number; nuevoCanon: number }[]>([]);
  const [nuevoMonto, setNuevoMonto] = useState("");
  const [nuevoMetodo, setNuevoMetodo] = useState("Efectivo");

  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);

  const cerrarMenu = () => setMenuIndexAbierto(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-acciones") && !target.closest(".menu-btn")) {
        cerrarMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cargarHistorial = (a: Alquiler) => {
    const pagosKey = `pagos_${a.dni}_${a.inicio}`;
    const subasKey = `subas_${a.dni}_${a.inicio}`;
    const historialPagos = JSON.parse(localStorage.getItem(pagosKey) || "[]");
    const historialSubas = JSON.parse(localStorage.getItem(subasKey) || "[]");
    setPagos(historialPagos);
    setSubas(historialSubas);
    setMostrarPago(false);
    setMostrarHistorial(true);
  };

  const registrarPago = () => {
    if (!alquilerSeleccionado || !nuevoMonto) return;
    const key = `pagos_${alquilerSeleccionado.dni}_${alquilerSeleccionado.inicio}`;
    const historial = JSON.parse(localStorage.getItem(key) || "[]");
    const nuevoPago = {
      fecha: new Date().toLocaleDateString("es-AR"),
      monto: parseFloat(nuevoMonto),
      metodo: nuevoMetodo,
    };
    const actualizado = [...historial, nuevoPago];
    localStorage.setItem(key, JSON.stringify(actualizado));
    setMostrarPago(false);
    setNuevoMonto("");
    setNuevoMetodo("Efectivo");
  };

  const abrirMenu = (idx: number, alquiler: Alquiler) => {
    setAlquilerSeleccionado(alquiler);
    setTimeout(() => {
      const btn = btnRefs.current[idx];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setMenuCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX - 100,
        });
        setMenuIndexAbierto(idx);
      }
    }, 0);
  };

  const eliminarAlquiler = (alquiler: Alquiler) => {
    if (!confirm("¿Eliminar este alquiler?")) return;
    const alquileres = JSON.parse(localStorage.getItem("alquileres") || "[]");
    const filtrados = alquileres.filter(
      (a: Alquiler) => a.dni !== alquiler.dni || a.inicio !== alquiler.inicio
    );
    localStorage.setItem("alquileres", JSON.stringify(filtrados));
    cerrarMenu();
    onActualizar?.();
  };

  return (
    <div className="relative">
      <table className="w-full text-sm bg-white rounded shadow overflow-hidden">
        <thead className="bg-blue-100 text-left">
          <tr>
            {seleccionables && <th className="p-2">✔</th>}
            <th className="p-2">Inquilino</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Domicilio</th>
            <th>Inicio</th>
            <th>Fin</th>
            {mostrarDetalles && <th />}
          </tr>
        </thead>
        <tbody>
          {datos.map((a, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {seleccionables && (
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={seleccionados?.some(
                      (s) => s.dni === a.dni && s.inicio === a.inicio
                    )}
                    onChange={() => onSeleccionar?.(a)}
                  />
                </td>
              )}
              <td className="p-2">{a.inquilino}</td>
              <td>{a.dni}</td>
              <td>{a.telefono}</td>
              <td>{a.email}</td>
              <td>{a.domicilio}</td>
              <td>{new Date(a.inicio).toLocaleDateString("es-AR")}</td>
              <td>{new Date(a.fin).toLocaleDateString("es-AR")}</td>
              {mostrarDetalles && (
                <td className="text-right pr-4 relative">
                  <button
                    ref={(el) => {
                      btnRefs.current[idx] = el;
                    }}
                    className="menu-btn p-2 rounded hover:bg-gray-100"
                    onClick={() => abrirMenu(idx, a)}
                  >
                    <BsThreeDotsVertical />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Menú flotante */}
      {menuIndexAbierto !== null && menuCoords && mostrarDetalles && (
        <div
          className="menu-acciones fixed bg-white border rounded shadow-md z-50"
          style={{
            top: `${menuCoords.top}px`,
            left: `${menuCoords.left}px`,
          }}
        >
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                alquilerSeleccionado && cargarHistorial(alquilerSeleccionado);
                cerrarMenu();
              }}
            >
              Historial
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setMostrarPago(true);
                setMostrarHistorial(false);
                cerrarMenu();
              }}
            >
              Pago
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setMostrarEdicion(true);
                cerrarMenu();
              }}
            >
              Editar
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setMostrarVer(true);
                cerrarMenu();
              }}
            >
              Ver más
            </li>
            <li
              className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
              onClick={() => {
                alquilerSeleccionado && eliminarAlquiler(alquilerSeleccionado);
              }}
            >
              Eliminar
            </li>
          </ul>
        </div>
      )}

      {/* Modales */}
      {mostrarEdicion && alquilerSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
            <h2 className="text-xl font-semibold mb-4">Editar alquiler</h2>
            <AlquilerForm
              alquilerExistente={alquilerSeleccionado}
              onGuardarExitoso={() => {
                setMostrarEdicion(false);
                onActualizar?.();
              }}
            />
          </div>
        </div>
      )}

      {mostrarHistorial && alquilerSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
            <h2 className="text-xl font-semibold mb-4">Historial</h2>
            {pagos.length > 0 && (
              <>
                <h3 className="font-bold mb-2">Pagos:</h3>
                <ul className="space-y-2 mb-4">
                  {pagos.map((p, i) => (
                    <li key={i} className="border-b pb-2">
                      {p.fecha} – ${p.monto} ({p.metodo})
                    </li>
                  ))}
                </ul>
              </>
            )}
            {subas.length > 0 && (
              <>
                <h3 className="font-bold mb-2">Subas de canon:</h3>
                <ul className="space-y-2">
                  {subas.map((s, i) => (
                    <li key={i} className="border-b pb-2">
                      {s.fecha} – {s.porcentaje}% → ${s.nuevoCanon}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {pagos.length === 0 && subas.length === 0 && (
              <p>No hay movimientos registrados.</p>
            )}
            <button
              className="mt-4 text-gray-600 hover:text-gray-900"
              onClick={() => setMostrarHistorial(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {mostrarPago && alquilerSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Registrar pago</h2>
            <input
              type="number"
              placeholder="Monto"
              value={nuevoMonto}
              onChange={(e) => setNuevoMonto(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <select
              value={nuevoMetodo}
              onChange={(e) => setNuevoMetodo(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Débito">Débito</option>
              <option value="Crédito">Crédito</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={registrarPago}
              >
                Guardar
              </button>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setMostrarPago(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarVer && alquilerSeleccionado && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
      <h2 className="text-xl font-semibold mb-6">Detalles del alquiler</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Inquilino:</strong> {alquilerSeleccionado.inquilino}</div>
        <div><strong>DNI:</strong> {alquilerSeleccionado.dni}</div>
        <div><strong>Teléfono:</strong> {alquilerSeleccionado.telefono}</div>
        <div><strong>Email:</strong> {alquilerSeleccionado.email}</div>
        <div><strong>Domicilio:</strong> {alquilerSeleccionado.domicilio}</div>
        <div><strong>Inicio:</strong> {new Date(alquilerSeleccionado.inicio).toLocaleDateString("es-AR")}</div>
        <div><strong>Fin:</strong> {new Date(alquilerSeleccionado.fin).toLocaleDateString("es-AR")}</div>
        <div><strong>Valor mensual:</strong> ${alquilerSeleccionado.valorMensual}</div>
        <div><strong>Forma de pago:</strong> {alquilerSeleccionado.formaPago}</div>
        <div><strong>Tipo de aumento:</strong> {alquilerSeleccionado.tipoAumento}</div>
        <div><strong>Inicio renovación canon:</strong> {alquilerSeleccionado.inicioRenovacionCanon}</div>
        <div><strong>Archivo:</strong> {alquilerSeleccionado.archivo || "No cargado"}</div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={() => setMostrarVer(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default TablaAlquileres;
