import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import Error404 from "../../components/Layouts/404";
import Layout from "../../components/Layouts/Layout";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/userInterface/Formulario";
import Boton from "../../components/userInterface/Boton";
import { deleteObject } from "firebase/storage";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  //State del componente
  const [producto, setProducto] = useState({});
  const [error, seterror] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setConsultarDB] = useState(true);

  //Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //Context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await doc(
          collection(firebase.db, "productos"),
          id
        );
        const producto = await getDoc(productoQuery);

        if (producto.exists()) {
          setProducto(producto.data());
          setConsultarDB(false);
        } else {
          seterror(true);
          setConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  //TODO: Spinner
  if (Object.keys(producto).length === 0 && !error) return "Cargando...log";

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlImagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //Administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }
    //Obtener y sumar nuevo voto
    const nuevoTotal = votos + 1;

    //Verificar si el usuario actual
    if (haVotado.includes(usuario.uid)) return;

    //Guardar el ID del usuario que ha votado
    const nuevohaVotado = [...haVotado, usuario.uid];

    //Actualizar en la DB
    const docRef = doc(firebase.db, "productos", `${id}`);

    updateDoc(docRef, {
      votos: increment(nuevoTotal),
      haVotado: nuevohaVotado,
    });

    //Actualizar en el state
    setProducto({ ...producto, votos: nuevoTotal });
    setConsultarDB(true);
  };

  //Funciones para crear Comentarios
  const ComentarioChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //Identifica si el Comentario es edl creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = async (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }
    //Informacion Extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //Tomar copia de comentarioas y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //Actualizar la DB
    const productoQuery = await doc(collection(firebase.db, "productos"), id);

    updateDoc(productoQuery, {
      comentarios: nuevosComentarios,
    });

    //Actualizar el state
    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    setConsultarDB(true);
  };

  // Funcio que revisa que el creador del producto sea el mismo que esta autenticado
  const puedeBorrar = () => {
    if (!usuario) return false;
    if (creador.id === usuario.uid) return true;
  };

  //Elimina un producto de la db
  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }

    if (creador.id !== usuario.uid) return router.push("/login");

    try {
      // Eliminar Producto
      await deleteDoc(doc(firebase.db, "productos", id));
      // Eliminar imagen
      const storage = getStorage();
      const imgRef = ref(storage, urlImagen);
      deleteObject(imgRef)
        .then(() => {
          // Imagen eliminada correctamente
        })
        .catch((error) => {
          console.log(error);
        });
        router.push("/");
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div
            css={css`
              max-width: 1200px;
              width: 95%;
              padding: 5rem 0;
              margin: 0 auto;
            `}
          >
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p
                  css={css`
                    text-transform: capitalize;
                  `}
                >
                  por: {creador.nombre} de {empresa}
                </p>

                <img src={urlImagen} />
                <p>{descripcion}</p>

                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          onChange={ComentarioChange}
                          type="text"
                          name="mensaje"
                        />
                      </Campo>
                      <InputSubmit type="submit" value={"Agrear Comentario"} />
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aun no hay Comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:{" "}
                          <span
                            css={css`
                              font-weight: bold;
                              text-transform: capitalize;
                            `}
                          >
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <a target="_blank" href={url}>
                  <Boton bgColor="true">Visitar Url</Boton>
                </a>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votos} Votos
                  </p>
                  {usuario && (
                    <Boton onClick={votarProducto} votos="true">
                      Votar
                    </Boton>
                  )}
                </div>
              </aside>
            </ContenedorProducto>
            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
