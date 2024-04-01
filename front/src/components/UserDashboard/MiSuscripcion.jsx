import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserById, cancelSuscription } from '../../redux/action';
import PropagateLoader from "react-spinners/PropagateLoader";
import swal from 'sweetalert';

export const MiSuscripcion = () => {
  //Codigo para reemplazar cuando la ruta este ok
  const userLogin = useSelector((state) => state.user);
  const userId = userLogin ? userLogin.id : null;
  const user = userId ? useSelector((state) => state.userById) : null;

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  //Estado para el spinner
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setTimeout(() => {
        dispatch(getUserById(userId))
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      }, 1000)
    }
  }, [dispatch, userId]);

  const cancelHandler = async (userId) => {
    setShowModal(true)
    await dispatch(cancelSuscription(userId))
    dispatch(getUserById(userId))
    setTimeout(() => {
      setShowModal(false)
    }, 2500);

    // swal({
    //   title: "¿Estás seguro?",
    //   text: "¡Te vas a perder de los beneficios de formar parte de Rayuela!",
    //   icon: "warning",
    //   buttons: ["Atrás", "Cancelar suscripción"]
    // })
    // .then((willDelete) => {
    //   if (willDelete) {
    //     dispatch(cancelSuscription(userId))
    //     dispatch(getUserById(userId))
    //     setShowModal(true)
    //     setTimeout(() => {
    //     setShowModal(false)
    // }, 2500);
    //   }
    // });
  }

  return (
    <div>
      {loading ? (
        <div className="text-center d-flex flex-column align-items-center" style={{ marginTop: '100px' }}>
          <PropagateLoader size={25} />
        </div>
      ) : !user.suscribed ? (
        <div>
          <h2 className="text-center">Mi suscripción</h2>
          <div className="d-flex justify-content-center my-3">
            <div className="card mb-3 d-flex justify-content-center" style={{ width: '90%' }}>
              <div className="row g-0">
                <div className="col-md-6">
                  <div style={{ maxHeight: '450px', overflow: 'hidden', width: '85%' }}> {/* Contenedor para recortar la altura */}
                    <img src="./images/miSuscripcion.jpg" className="img-fluid rounded-start" alt="Imagen de libros abiertos con un señalador" />
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <div className="text-center d-flex flex-column align-items-center" style={{ marginTop: '200px' }}>
                    <h5>Aún no estás suscripto...</h5>
                    <h6>¡Conocé más sobre los beneficios de la <Link to={'/suscripcion'} className="text-reset text-decoration-none fw-bold">suscripción</Link>!</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-center">Mi suscripción</h2>
          <div className="d-flex justify-content-center my-3">
            <div className="card mb-3 d-flex justify-content-center" style={{ width: '90%' }}>
              <div className="row g-0">
                <div className="col-md-6">
                  <div style={{ maxHeight: '450px', overflow: 'hidden', width: '85%' }}> {/* Contenedor para recortar la altura */}
                    <img src="./images/miSuscripcion.jpg" className="img-fluid rounded-start" alt="Imagen de libros abiertos con un señalador" />
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column align-items-center p-3">
                  <div className="align-items-center">
                    <div>
                      <h5>Tu suscripción comenzó el {user.date_suscription}</h5>
                      <p>Tiene una validez de un año, pasado ese plazo deberás renovarla</p>
                    </div>
                    <hr />
                    <div>
                      <h5 className="mb-3">Los datos para el envío mensual son:</h5>
                      <div className="d-flex">
                        <p className="card-text fw-bold">Calle y número:</p>
                        <p className="card-text ms-3">{user.orders[0].street_and_number}</p>
                      </div>
                      {user.orders[0].floor_and_department ? (
                        <div className="d-flex">
                          <p className="card-text fw-bold">Piso y departamento</p>
                          <p className="card-text ms-3">{user.orders[0].floor_and_department}</p>
                        </div>
                      ) : null}
                      <div className="d-flex">
                        <p className="card-text fw-bold">Ciudad:</p>
                        <p className="card-text ms-3">{user.orders[0].city}</p>
                      </div>
                      <div className="d-flex">
                        <p className="card-text fw-bold">CP:</p>
                        <p className="card-text ms-3">{user.orders[0].CP}</p>
                      </div>
                      <div className="d-flex">
                        <p className="card-text fw-bold">Provincia:</p>
                        <p className="card-text ms-3">{user.orders[0].province}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="text-center d-flex flex-column align-items-center">
                        <p>¿Querés cancelar tu suscripción?</p>
                        <div className="d-flex align-items-center">
                          <button className="btn btn-dark w-100  mb-3" onClick={(userId) => { cancelHandler(user.id) }}>Cancelar suscripción</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <p>¿Querés modificar tus datos o tenés alguna duda? Escribinos por mail a: <a href='http://mail.google.com/'><i className="bi bi-envelope p-1"></i></a>rayuela@email.com</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered" style={{ marginTop: "7%" }}>
            <div className="modal-content bg-white border-4">
              <div className="modal-body d-flex justify-content-center align-items-center">
                <img className="w-100 p-3 h-50 d-inline-block" src='.\images\suscripcionOff.png' alt='desuscripción' /> {/* Reemplaza "ruta-de-la-imagen.jpg" con la ruta de tu imagen */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiSuscripcion;



