import React, { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import DetallesProducto from "../components/Layouts/DetallesProductos";
import { css } from "@emotion/react";
import useProductos from "../hooks/useProductos";
import { useRouter } from "next/router";

const Buscar = () => {
  const router = useRouter();
  const {
    query: { q },
  } = router;
  //Todos los productos
  const { productos } = useProductos("votos");
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();
    const filtro = productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
      );
    });
    setResultado(filtro);
  }, [q, productos]);

  return (
    <div>
      <Layout>
        <div
          css={css`
            background-color: #f3f3f3;
          `}
        >
          <div
            css={css`
              max-width: 1200px;
              width: 95%;
              padding: 5rem 0;
              margin: 0 auto;
            `}
          >
            <ul
              css={css`
                background-color: #f3f3f3;
              `}
            >
              {resultado.map((producto) => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Buscar;
