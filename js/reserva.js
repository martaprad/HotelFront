window.addEventListener("load", iniciar);

function iniciar() {
    // Función para mostrar alertas con Bootstrap
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    }

    let token = localStorage.getItem('token');

    //Si el usuario está logeado
    if (token) {

        document.getElementById('reservas-form').addEventListener('submit', function (event) {
            event.preventDefault();  // Prevenir el envío del formulario

            let habTipoId = document.getElementById('tipoHab').value;
            let transf = document.getElementById('transfer').value;
            let actividadesList = document.querySelectorAll('#actividades .form-check-input');
            let fHoy = new Date().toISOString();
            let fechaActual = fHoy.substring(0, 10);
            let fInicio = document.getElementById('fechaInicio').value;
            let fFin = document.getElementById('fechaFin').value;

            if (!habTipoId || !transf || !actividadesList) {
                showAlert('Debe elegir fechas, habitación, actividades y transfer', 'warning');
            } else {

                //Validamos las fechas
                if ((fInicio < fechaActual) || (fFin < fechaActual)) {
                    showAlert('La fecha de la reserva no puede ser anterior a la fecha de hoy', 'warning');
                    event.preventDefault();  // Evita el envío del formulario
                    return;

                } else if (fFin < fInicio) {
                    showAlert('La fecha inicial de la reserva tiene que ser anterior a la fecha final de la reserva', 'warning');
                    event.preventDefault();  // Evita el envío del formulario
                    return;

                } else {

                    //Crear el Json para enviar en el body del fetch
                    var myJson = {
                        fechaInicio: fInicio,
                        fechaFin: fFin,
                        habitacionTipoId: habTipoId,
                        actividadDTOList: [],
                        trasladoDTO: {
                            tipoTraslado: transf
                        }
                    };

                    // Recorrer las actividades seleccionadas
                    actividadesList.forEach(checkbox => {
                        if (checkbox.checked) {
                            myJson.actividadDTOList.push({ tipoActividad: checkbox.value });
                        }
                    });

                    if (myJson.actividadDTOList.length === 0) {
                        showAlert("Debe escoger una actividad o indicar sin actividades", 'warning');
                    } else {
                        // Hacer la llamada a la API de reservas
                        fetch('http://localhost:8080/reservas', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(myJson)
                        })

                            .then(response => {
                                if (response.ok) {
                                    // La respuesta es exitosa (código 2xx)
                                    return response.text();
                                } else {
                                    // La respuesta tiene un código de error
                                    return response.text().then(errorMessage => { throw new Error(errorMessage); });
                                }
                            })

                            .then(data => {
                                // Manejar respuesta exitosa

                                // Hacer la llamada a la API calcularPrecio
                                fetch('http://localhost:8080/reservas/calcularPrecio', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify(myJson)
                                })
                                    .then(response => {
                                        if (response.ok) {
                                            // La respuesta es exitosa (código 2xx)
                                            return response.text();
                                        } else {
                                            // La respuesta tiene un código de error
                                            return response.text().then(errorMessage => { throw new Error(errorMessage); });
                                        }
                                    })
                                    .then(data => {

                                        // Manejar respuesta exitosa
                                        if (habTipoId == "1") {
                                            showAlert("Ha reservado una habitación Doble desde el " + fInicio.split("-").reverse().join("-") +
                                                " hasta el " + fFin.split("-").reverse().join("-") + " el precio total es de " + data + "€", 'success');
                                        } else if (habTipoId == "2") {
                                            showAlert("Ha reservado una habitación Triple desde el " + fInicio.split("-").reverse().join("-") +
                                                " hasta el " + fFin.split("-").reverse().join("-") + " el precio total es de " + data + "€", 'success');
                                        } else {
                                            showAlert("Ha reservado una habitación Deluxe desde el " + fInicio.split("-").reverse().join("-") +
                                                " hasta el " + fFin.split("-").reverse().join("-") + " el precio total es de " + data + "€", 'success');
                                        }
                                        //window.location.href = 'listaReservas.html';
                                        return data;
                                    })
                                    .catch(error => {
                                        // Manejar error
                                        console.error('Error:', error.message);
                                        showAlert('Error: ' + error.message, 'danger');
                                    });

                                return data;
                            })


                            .catch(error => {
                                // Manejar error
                                showAlert('Error: ' + error.message, 'danger');
                            });
                    }
                }
            }
        });

        // Añadir la funcionalidad de selección y deselección de checkboxes
        const actividadNinguna = document.getElementById('actividadNINGUNA');
        const actividades = document.querySelectorAll('#actividades .form-check-input');

        actividades.forEach(actividad => {
            actividad.addEventListener('change', function () {
                if (this.id === 'actividadNINGUNA' && this.checked) {
                    // Desmarcar todas las demás actividades si se selecciona "SIN ACTIVIDADES"
                    actividades.forEach(act => {
                        if (act.id !== 'actividadNINGUNA') {
                            act.checked = false;
                        }
                    });
                } else if (this.id !== 'actividadNINGUNA' && this.checked) {
                    // Desmarcar "SIN ACTIVIDADES" si se selecciona cualquier otra actividad
                    actividadNinguna.checked = false;
                }
            });
        });

    } else {
        document.getElementById("realizarReserva").disabled = true;
        showAlert("Debe de acceder a su cuenta de usuario antes de realizar una reserva", 'warning');
    }
}

