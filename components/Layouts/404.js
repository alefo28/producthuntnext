import { css } from "@emotion/react";
import React from "react";

const Error404 = () => {
  return (
    <h1
      css={css`
        margin-top: 5rem;
        text-align: center;
        text-transform: capitalize;
      `}
    >
      No se puede Mostrar
    </h1>
  );
};

export default Error404;
