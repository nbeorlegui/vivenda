import { useEffect, useState } from "react";

const ContratoForm = () => {
  const [propiedad, setPropiedad] = useState("");
  const [inquilino, setInquilino] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [estado, setEstado] = useState("Activo");

  const [opcionesPropiedades, setOpcionesPropiedades] = useState<string[]>([]);
  const [opcionesInquilinos, setOpcionesInquilinos] = useState<any[]>([]);

  useEffect(() => {
    const propiedades = JSON.parse(localStorage.getItem("propiedades") || "[]");
    const inquilinos = JSON.parse(localStorage.getItem("inquilinos") || "[]");

    const direcciones = propiedades.map((p: any) => p.direccion);
    setOpcionesPropiedades(direcciones);
    setOpcionesInquilinos(inquilinos);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoContrato = {
      id: Date.now(),
      propiedad,
      inquilino,
      desde,
      hasta,
      estado,
    };

    const guardados = JSON.parse(localStorage.getItem("contratos") || "[]");
    const actualizados = [...guardados, nuevoContrato];
    localStorage.setItem("contratos", JSON.stringify(actualizados));

    alert("✅ Contrato guardado");

    setPropiedad("");
    setInquilino("");
    setDesde("");
    setHasta("");
    setEstado("Activo");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700">Propiedad</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={propiedad}
          onChange={(e) => setPropiedad(e.target.value)}
          required
        >
          <option value="">Seleccione una propiedad</option>
          {opcionesPropiedades.map((dir, idx) => (
            <option key={idx} value={dir}>
              {dir}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Inquilino</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={inquilino}
          onChange={(e) => setInquilino(e.target.value)}
          required
        >
          <option value="">Seleccione un inquilino</option>
          {opcionesInquilinos.map((inq) => (
            <option key={inq.id} value={inq.nombre}>
              {inq.nombre} – DNI {inq.dni}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Desde</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 mt-1"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Hasta</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 mt-1"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option>Activo</option>
          <option>Finalizado</option>
          <option>Cancelado</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Guardar contrato
      </button>
    </form>
  );
};

export default ContratoForm;
