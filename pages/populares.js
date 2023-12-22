import React from "react";
import Layout from "../components/Layouts/Layout";
import DetallesProducto from "../components/Layouts/DetallesProductos";
import { css } from "@emotion/react";
import useProductos from "../hooks/useProductos";

const Populares = () => {
  const { productos } = useProductos("votos");

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
              {productos.map((producto) => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Populares;
