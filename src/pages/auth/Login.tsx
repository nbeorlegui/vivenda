import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ingresoExitoso, setIngresoExitoso] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const user = usuarios.find(
      (u: any) => u.usuario === usuario && u.password === password
    );

    if (user) {
      setIngresoExitoso(true);
      setTimeout(() => {
        localStorage.setItem("usuarioActivo", JSON.stringify(user));
        navigate("/");
      }, 800); // espera breve para mostrar el check
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        {ingresoExitoso && (
          <div className="flex justify-center items-center mb-4">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center animate-bounce text-lg">
              ✓
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            type="text"
            placeholder="Usuario"
            className="border w-full p-2 mb-3 rounded"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border w-full p-2 mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
