import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

const Formulario = ({ dispatch, contactoEditar, setContactoEditar }) => {
  const [data, setData] = useState({
    nombre: "",
    numero: "",
    sexo: "",
    cumpleanos: "",
    imagen: "",
  });

  //Aqui se desarrolla la funcion del update
  //Update
  const [errores, setErrores] = useState({});
  const [previsualizacion, setPrevisualizacion] = useState("");

  const { nombre, numero, sexo, cumpleanos, imagen } = data;

  useEffect(() => {
    if (contactoEditar) {
      setData(contactoEditar);
      setPrevisualizacion(contactoEditar.imagen);
    }
  }, [contactoEditar]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    if (errores[e.target.name]) {
      setErrores({
        ...errores,
        [e.target.name]: "",
      });
    }
  };

  const handleImagenChange = (e) => {
    const archivo = e.target.files[0];

    if (archivo) {
      if (!archivo.type.startsWith("image/")) {
        setErrores({
          ...errores,
          imagen: "Por favor selecciona un archivo de imagen válido",
        });
        return;
      }

      if (archivo.size > 2 * 1024 * 1024) {
        setErrores({
          ...errores,
          imagen: "La imagen no debe superar los 2MB",
        });
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const imagenBase64 = reader.result;
        setData({
          ...data,
          imagen: imagenBase64,
        });
        setPrevisualizacion(imagenBase64);

        if (errores.imagen) {
          setErrores({
            ...errores,
            imagen: "",
          });
        }
      };

      reader.onerror = () => {
        setErrores({
          ...errores,
          imagen: "Error al leer el archivo",
        });
      };

      reader.readAsDataURL(archivo);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (nombre.length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!numero.trim()) {
      nuevosErrores.numero = "El número es obligatorio";
    } else if (!/^\d{10}$/.test(numero)) {
      nuevosErrores.numero = "El número debe tener 10 dígitos";
    }

    if (!sexo) {
      nuevosErrores.sexo = "Selecciona un sexo";
    }

    if (!cumpleanos) {
      nuevosErrores.cumpleanos = "La fecha de nacimiento es obligatoria";
    } else {
      const fechaNacimiento = new Date(cumpleanos);
      const hoy = new Date();
      if (fechaNacimiento >= hoy) {
        nuevosErrores.cumpleanos = "La fecha debe ser anterior a hoy";
      }
    }

    if (!imagen) {
      nuevosErrores.imagen = "Debes seleccionar una imagen";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleAdd = () => {
    if (!validarFormulario()) {
      return;
    }

    if (contactoEditar) {
      const actionUpdate = {
        type: "update",
        payload: data,
      };
      dispatch(actionUpdate);
      setContactoEditar(null);
    } else {
      const newContact = {
        ...data,
        id: uuid(),
      };

      const actionAdd = {
        type: "add",
        payload: newContact,
      };
      dispatch(actionAdd);
    }

    setData({
      nombre: "",
      numero: "",
      sexo: "",
      cumpleanos: "",
      imagen: "",
    });
    setPrevisualizacion("");
    setErrores({});

    const inputImagen = document.getElementById("inputImagen");
    if (inputImagen) {
      inputImagen.value = "";
    }
  };

  return (
    <div className="container my-3">
      <div className="card">
        <div className="card-header bg-warning text-white">
          <h4>{contactoEditar ? "Modificar Contacto" : "Agregar Contacto"}</h4>
        </div>
        <div className="card-body">
          <label className="mx-1 d-grid gap-2">
            Nombre: {""}
            <input
              onChange={handleChange}
              name="nombre"
              value={nombre}
              type="text"
              className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
              autoComplete="off"
              placeholder="Ingresa el nombre completo"
            />
            {errores.nombre && (
              <div className="invalid-feedback">{errores.nombre}</div>
            )}
          </label>

          <label className="mx-1 d-grid gap-2">
            Numero: {""}
            <input
              onChange={handleChange}
              name="numero"
              value={numero}
              type="text"
              className={`form-control ${errores.numero ? "is-invalid" : ""}`}
              autoComplete="off"
              placeholder="10 dígitos"
              maxLength="10"
            />
            {errores.numero && (
              <div className="invalid-feedback">{errores.numero}</div>
            )}
          </label>

          <div className="mx-1 d-grid gap-2 mt-3">
            <label className="form-label d-block">Sexo:</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="sexo"
                id="masculino"
                value="Masculino"
                checked={sexo === "Masculino"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="masculino">
                Masculino
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="sexo"
                id="femenino"
                value="Femenino"
                checked={sexo === "Femenino"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="femenino">
                Femenino
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="sexo"
                id="otro"
                value="Otro"
                checked={sexo === "Otro"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="otro">
                Otro
              </label>
            </div>
            {errores.sexo && (
              <div className="text-danger small">{errores.sexo}</div>
            )}
          </div>

          <label className="mx-1 d-grid gap-2 mt-3">
            Fecha de Nacimiento: {""}
            <input
              onChange={handleChange}
              name="cumpleanos"
              value={cumpleanos}
              type="date"
              className={`form-control ${
                errores.cumpleanos ? "is-invalid" : ""
              }`}
            />
            {errores.cumpleanos && (
              <div className="invalid-feedback">{errores.cumpleanos}</div>
            )}
          </label>

          <label className="mx-1 d-grid gap-2 mt-3">
            Seleccionar Imagen (Avatar): {""}
            <input
              onChange={handleImagenChange}
              type="file"
              id="inputImagen"
              accept="image/*"
              className={`form-control ${errores.imagen ? "is-invalid" : ""}`}
            />
            <small className="text-muted">
              Formatos permitidos: JPG, PNG, GIF, WEBP (Máximo 2MB)
            </small>
            {errores.imagen && (
              <div className="invalid-feedback d-block">{errores.imagen}</div>
            )}
            {previsualizacion && (
              <div className="mt-3 text-center">
                <p className="mb-2">
                  <strong>Vista previa:</strong>
                </p>
                <img
                  src={previsualizacion}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </label>

          {/* Botones */}
          <div className="mx-1 d-grid gap-2">
            <button onClick={handleAdd} className="btn btn-info mt-2">
              {contactoEditar ? "Actualizar" : "Agregar"}
            </button>
            {contactoEditar && (
              <button
                onClick={() => {
                  setData({
                    nombre: "",
                    numero: "",
                    sexo: "",
                    cumpleanos: "",
                    imagen: "",
                  });
                  setPrevisualizacion("");
                  setContactoEditar(null);
                  setErrores({});
                  const inputImagen = document.getElementById("inputImagen");
                  if (inputImagen) {
                    inputImagen.value = "";
                  }
                }}
                className="btn btn-secondary mt-2"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
