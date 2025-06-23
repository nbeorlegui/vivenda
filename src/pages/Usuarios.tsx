import { useEffect, useState } from "react";
import Layout from "../components/Layout";

type Usuario = {
  nombre: string;
  usuario: string;
  password: string;
  rol: "usuario" | "admin" | "superadmin";
  empresaId: string;
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [indexEditando, setIndexEditando] = useState<number | null>(null);
  const [nuevoUsuario, setNuevoUsuario] = useState<Usuario>({
    nombre: "",
    usuario: "",
    password: "",
    rol: "usuario",
    empresaId: "",
  });

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo") || "null");

  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(lista);
  }, []);

  const abrirModalNuevo = () => {
    setNuevoUsuario({
      nombre: "",
      usuario: "",
      password: "",
      rol: "usuario",
      empresaId: "",
    });
    setModoEdicion(false);
    setMostrarModal(true);
  };

  const abrirModalEditar = (usuario: Usuario, index: number) => {
    setNuevoUsuario(usuario);
    setIndexEditando(index);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const handleGuardar = () => {
    let empresaId = nuevoUsuario.empresaId;

    // Si NO es superadmin, asignar empresa automáticamente
    if (usuarioActivo.rol !== "superadmin") {
      empresaId = usuarioActivo.empresaId;
    }

    const yaExiste = usuarios.some(
      (u, idx) =>
        u.usuario === nuevoUsuario.usuario &&
        u.empresaId === empresaId &&
        idx !== indexEditando
    );

    if (yaExiste) {
      alert("Ese nombre de usuario ya existe en esta empresa.");
      return;
    }

    const usuarioFinal: Usuario = { ...nuevoUsuario, empresaId };
    let actualizados: Usuario[] = [...usuarios];

    if (modoEdicion && indexEditando !== null) {
      const empresaIdAnterior = usuarios[indexEditando].empresaId;

      // Reemplazar usuario editado
      actualizados[indexEditando] = usuarioFinal;

      // Si el superadmin cambió el empresaId de un admin, propagar a sus usuarios
      if (
        usuarioActivo.rol === "superadmin" &&
        empresaIdAnterior !== empresaId
      ) {
        actualizados = actualizados.map((u, i) =>
          i !== indexEditando && u.empresaId === empresaIdAnterior
            ? { ...u, empresaId }
            : u
        );
      }
    } else {
      actualizados.push(usuarioFinal);
    }

    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setUsuarios(actualizados);
    setMostrarModal(false);
    setModoEdicion(false);
    setIndexEditando(null);
  };

  const handleEliminar = (index: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      const actualizados = usuarios.filter((_, i) => i !== index);
      localStorage.setItem("usuarios", JSON.stringify(actualizados));
      setUsuarios(actualizados);
    }
  };

  return (
    <Layout className="p-8">
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Usuarios</h2>
          <button
            onClick={abrirModalNuevo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Nuevo usuario
          </button>
        </div>

        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Empresa ID</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2">{u.nombre}</td>
                <td className="p-2">{u.usuario}</td>
                <td className="p-2 capitalize">{u.rol}</td>
                <td className="p-2">{u.empresaId}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => abrirModalEditar(u, i)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleEliminar(i)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                {modoEdicion ? "Editar usuario" : "Nuevo usuario"}
              </h3>

              <input
                type="text"
                placeholder="Nombre completo"
                className="border rounded px-3 py-2 w-full mb-3"
                value={nuevoUsuario.nombre}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Usuario"
                className="border rounded px-3 py-2 w-full mb-3"
                value={nuevoUsuario.usuario}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, usuario: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="border rounded px-3 py-2 w-full mb-3"
                value={nuevoUsuario.password}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                }
              />

              <select
                className="border rounded px-3 py-2 w-full mb-3"
                value={nuevoUsuario.rol}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    rol: e.target.value as Usuario["rol"],
                  })
                }
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
                {usuarioActivo?.rol === "superadmin" && (
                  <option value="superadmin">Superadmin</option>
                )}
              </select>

              {/* Campo Empresa ID visible solo para superadmin y solo si el usuario no es superadmin */}
              {usuarioActivo?.rol === "superadmin" && nuevoUsuario.rol !== "superadmin" && (
                <input
                  type="text"
                  placeholder="ID de empresa"
                  className="border rounded px-3 py-2 w-full mb-3"
                  value={nuevoUsuario.empresaId}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, empresaId: e.target.value })
                  }
                />
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-600 hover:text-black"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Usuarios;
