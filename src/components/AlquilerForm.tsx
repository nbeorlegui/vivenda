import React, { useEffect, useState } from "react";

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
  alquilerExistente?: Alquiler;
  onGuardarExitoso?: () => void;
}

const AlquilerForm = ({ alquilerExistente, onGuardarExitoso }: Props) => {
  const [alquilerActual, setAlquilerActual] = useState<Alquiler>({
    inquilino: "",
    dni: "",
    telefono: "",
    email: "",
    domicilio: "",
    inicio: "",
    fin: "",
    valorMensual: 0,
    tipoAumento: "",
    formaPago: "",
    archivo: "",
    inicioRenovacionCanon: "",
    proximaRenovacionCanon: "",
  });

  useEffect(() => {
    if (alquilerExistente) setAlquilerActual(alquilerExistente);
  }, [alquilerExistente]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAlquilerActual((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const alquileres = JSON.parse(localStorage.getItem("alquileres") || "[]");

    const index = alquileres.findIndex(
      (a: Alquiler) =>
        a.dni === alquilerExistente?.dni && a.inicio === alquilerExistente?.inicio
    );

    if (alquilerExistente && index !== -1) {
      alquileres[index] = alquilerActual;
      alert("Alquiler actualizado con éxito.");
    } else {
      alquileres.push(alquilerActual);
      alert("Alquiler creado con éxito.");
    }

    localStorage.setItem("alquileres", JSON.stringify(alquileres));
    onGuardarExitoso?.();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div>
        <label>Inquilino</label>
        <input
          name="inquilino"
          value={alquilerActual.inquilino}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label>DNI</label>
        <input
          name="dni"
          value={alquilerActual.dni}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label>Teléfono</label>
        <input
          name="telefono"
          value={alquilerActual.telefono}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          name="email"
          value={alquilerActual.email}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label>Domicilio</label>
        <input
          name="domicilio"
          value={alquilerActual.domicilio}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label>Inicio contrato</label>
        <input
          type="date"
          name="inicio"
          value={alquilerActual.inicio}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label>Fin contrato</label>
        <input
          type="date"
          name="fin"
          value={alquilerActual.fin}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label>Valor mensual</label>
        <input
          type="number"
          name="valorMensual"
          value={alquilerActual.valorMensual}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
      <div>
        <label>Tipo de aumento</label>
        <select
          name="tipoAumento"
          value={alquilerActual.tipoAumento}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Seleccionar</option>
          <option value="Mensual">Mensual</option>
          <option value="Trimestral">Trimestral</option>
          <option value="Semestral">Semestral</option>
          <option value="Anual">Anual</option>
        </select>
      </div>
      <div>
        <label>Forma de pago</label>
        <select
          name="formaPago"
          value={alquilerActual.formaPago}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Seleccionar</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Débito">Débito</option>
          <option value="Crédito">Crédito</option>
        </select>
      </div>
      <div>
        <label>Archivo (PDF o Word)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setAlquilerActual((prev) => ({
                ...prev,
                archivo: file.name,
              }));
            }
          }}
          className="border rounded px-3 py-2 w-full bg-white"
        />
      </div>
      <div>
        <label>Inicio renovación</label>
        <input
          type="date"
          name="inicioRenovacionCanon"
          value={alquilerActual.inicioRenovacionCanon}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div className="col-span-2 flex justify-end gap-4 mt-4">
        <button
          type="button"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
          onClick={onGuardarExitoso}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {alquilerExistente ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default AlquilerForm;
