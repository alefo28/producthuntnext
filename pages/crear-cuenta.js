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
import validarCrearCuenta from "../validacion/validarCrearCuenta";

const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: "",
};
 
function CrearCuenta() {
  const [error, setError] = useState(false);

  const { valores, errores, handleChange, handleSubmit, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearCuenta, crearcuenta);

  const { nombre, email, password } = valores;

  async function crearcuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push("/login");
    } catch (error) {
      console.error("Hubo un error al crear el usuario", error.message);
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
            Crear Cuenta
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu Nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}
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
            <InputSubmit type="submit" value={"Crear Cuenta"} />
          </Formulario>
        </>
      </Layout>
    </div>
  );
}

export default CrearCuenta;
