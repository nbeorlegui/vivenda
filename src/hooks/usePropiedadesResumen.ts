interface RegistroPropiedad {
  tipo: string;
  nombre: string;
  domicilio: string;
  inicio: string;
  fin: string;
  estado: string;
}

const usePropiedadesResumen = () => {
  const alquileres = JSON.parse(localStorage.getItem("alquileres") || "[]");

  const hoy = new Date();

  const alertaAlquileres = alquileres.filter((a: any) => {
    const fin = new Date(a.fin);
    const diferencia = (fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return diferencia <= 30 && diferencia >= 0;
  });

  const tabla: RegistroPropiedad[] = alquileres.map((a: any) => ({
    tipo: "alquiler",
    nombre: a.inquilino,
    domicilio: a.domicilio,
    inicio: a.inicio,
    fin: a.fin,
    estado: "Activo",
  }));

  return {
    alertaAlquileres,
    tabla,
  };
};

export default usePropiedadesResumen;
