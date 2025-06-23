import { useState } from "react";

const PropiedadForm = () => {
  const [direccion, setDireccion] = useState("");
  const [duenio, setDuenio] = useState("");
  const [unidades, setUnidades] = useState(1);
  const [estado, setEstado] = useState("Activa");

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const nuevaPropiedad = {
    id: Date.now(), // ID único temporal
    direccion,
    duenio,
    unidades,
    estado,
  };

  // Traer propiedades guardadas
  const guardadas = JSON.parse(localStorage.getItem("propiedades") || "[]");

  // Agregar la nueva
  const actualizadas = [...guardadas, nuevaPropiedad];

  // Guardar en localStorage
  localStorage.setItem("propiedades", JSON.stringify(actualizadas));

  alert("✅ Propiedad guardada");

  // Limpiar formulario
  setDireccion("");
  setDuenio("");
  setUnidades(1);
  setEstado("Activa");
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700">Dirección</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mt-1"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Dueño</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mt-1"
          value={duenio}
          onChange={(e) => setDuenio(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Unidades</label>
        <input
          type="number"
          min={1}
          className="w-full border rounded px-3 py-2 mt-1"
          value={unidades}
          onChange={(e) => setUnidades(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option>Activa</option>
          <option>Inactiva</option>
          <option>En mantenimiento</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Guardar propiedad
      </button>
    </form>
  );
};

export default PropiedadForm;
