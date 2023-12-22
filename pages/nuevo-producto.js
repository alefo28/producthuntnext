import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/userInterface/Formulario";
import { css } from "@emotion/react";
import Router, { useRouter } from "next/router";
import firebase, { FirebaseContext } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import Error404 from "../components/Layouts/404";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  imagen: "",
  url: "",
  descripcion: "",
};

export default function NuevoProducto() {
  //State de las imagenes
  const [nombreimagen, setNombreimagen] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImagen, setUrlImagen] = useState("");

  const [error, setError] = useState(false);

  const { valores, errores, handleChange, handleSubmit, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  //hook de routing para redireccionar
  const router = useRouter();

  //context con las operacioes crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);


  async function crearProducto() {
    //si el usuario no esta autenticado llevar al login
    if (!usuario) {
      return router.push("/login");
    }

    //Crear el objeto de nuevo Producto
    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: { id: usuario.uid, nombre: usuario.displayName },
      haVotado: [],
    };

    //Insertar en la base de datos
    try {
      await addDoc(collection(firebase.db, "productos"), producto);
    } catch (error) {
      console.error(error);
    }
    return router.push("/");

  }

  const handleImageUpload = (e) => {
    // Se obtiene referencia de la ubicación donde se guardará la imagen
    const file = e.target.files[0];
    const imageRef = ref(firebase.storage, "products/" + file.name);

    // Se inicia la subida
    setSubiendo(true);
    const uploadTask = uploadBytesResumable(imageRef, file);

    // Registra eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on(
      "state_changed",
      // Muestra progreso de la subida
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log(`Subiendo imagen: ${progress}% terminado`);
      },
      // En caso de error
      (error) => {
        setSubiendo(false);
        console.error(error);
      },
      // Subida finalizada correctamente
      () => {
        setSubiendo(false);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUrlImagen(url);
        });
      }
    );
  };

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo Producto
            </h1>
            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Informacio General</legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre de la Empresa o Compañia"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>

                  <input
                    accept="image/*"
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageUpload}
                  />
                </Campo>

                <Campo>
                  <label htmlFor="url">Url</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    placeholder="URL de tu producto"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>Sobre tu Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>

              {error && <Error>{error}</Error>}

              <InputSubmit type="submit" value={"Crear Producto"} />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
}
