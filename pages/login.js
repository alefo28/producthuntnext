import React, { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/userInterface/Formulario";
import { css } from "@emotion/react";
import Router from "next/router";
import firebase from "../firebase";

//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const STATE_INICIAL = {
  email: "",
  password: "",
};

function Login() {
  const [error, setError] = useState(false);

  const { valores, errores, handleChange, handleSubmit, handleBlur } =
    useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push("/");
    } catch (error) {
      console.error("Hubo un error al autenticar el usuario", error.message);
      setError(error.message);
    }
  }
  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Iniciar Sesión
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Tu Email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Tu Contraseña"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}

            {error && <Error>{error} </Error>}
            <InputSubmit type="submit" value={"Iniciar Sesión"} />
          </Formulario>
        </>
      </Layout>
    </div>
  );
}

export default Login;
