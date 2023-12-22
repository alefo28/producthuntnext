export default function validarCrearProducto(valores) {
  let errores = {};

  //Validar el nombre del usuario
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }

  //validar empresa
  if (!valores.empresa) {
    errores.empresa = "Nombres de Empresa es obligatorio";
  }

  //validar url
  if (!valores.url) {
    errores.url = "lA URL del producto es obligatorio";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL mal formateada o no válida";
  }

  //validar descripcion
  if (!valores.descripcion) {
    errores.descripcion = "Agregar una descripcion de tu producto";
  }

  return errores;
}
