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

    //Logout desde el menú de usuario
    document.getElementById('logout').addEventListener('click', function (event) {
        localStorage.removeItem('token');
        document.getElementById('verReservas').style.display="none";
        document.getElementById('idCancelar').style.display="none";
        document.getElementById('cancelarReserva').style.display="none";
        showAlert("Debe estar logueado para ver la lista de reservas", 'warning');
    });

    token = localStorage.getItem('token');
    var arrayId = [];

    //Si el usuario está logeado
    if (token) {

        //Obtenemos el nombre del usuario
        fetch('http://localhost:8080/auth/cliente', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.text())
            .then(data => {
                let name = data.charAt(0).toUpperCase() + data.slice(1);
                document.getElementById('navbarDropdown').innerHTML = name; 
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

            document.getElementById('verReservas').addEventListener('click', function (event) {
                // Vacío el contenido anterior de infoReservas para evitar que se acumulen los datos
                infoReservas.innerHTML = "";

                // Hacer la llamada a la API de reservas
                fetch('http://localhost:8080/reservas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
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
                        datosJSON = JSON.parse(data);
                        var texto = "";

                        if (datosJSON.length === 0) {
                            showAlert("No tiene reservas a su nombre", 'warning');
                        } else {
                            // Recorrer JSON para imprimir los datos
                            for (var reservas in datosJSON) {

                                //Guardamos en un array el id de las reservas usuario loggeado
                                arrayId.push(datosJSON[reservas].id);

                                texto += "- Reserva" + " (id: " + datosJSON[reservas].id +
                                    ", fecha reserva: " + datosJSON[reservas].fechaReserva.substring(0, 10).split("-").reverse().join("-") + "): ";

                                if (datosJSON[reservas].habitacionTipoId === "1") {
                                    texto += "habitación Doble";
                                } else if (datosJSON[reservas].habitacionTipoId === "2") {
                                    texto += "habitación Triple";
                                } else {
                                    texto += "habitación Deluxe";
                                }

                                texto += " desde el: " + datosJSON[reservas].fechaInicio.split("-").reverse().join("-");
                                texto += " hasta: " + datosJSON[reservas].fechaFin.split("-").reverse().join("-");
                                texto += ", actividades: ";

                                var actListJSON = datosJSON[reservas].actividadDTOList;

                                for (var actividad in actListJSON) {
                                    texto += actListJSON[actividad].tipoActividad + ", ";
                                }

                                if (datosJSON[reservas].trasladoDTO.tipoTraslado === "IDAVUELTA") {
                                    texto += "transfer: ida y vuelta";
                                } else if (datosJSON[reservas].trasladoDTO.tipoTraslado === "IDA") {
                                    texto += "transfer: ida";
                                } else {
                                    texto += "transfer: no reservado";
                                };

                                texto += ",  estado: " + datosJSON[reservas].estado +
                                    ", precio: " + datosJSON[reservas].precio + "€<br>";

                            }

                            infoReservas.innerHTML += texto;
                            return data;
                        }
                    })

                    .catch(error => {
                        // Manejar error
                        showAlert('Para poder ver las reservas debe acceder a su cuenta de usuario', 'warning');
                    });

            });


        document.getElementById('cancelarReserva').addEventListener('click', function (event) {

            var idReserva = parseInt(document.getElementById("idCancelar").value);

            //Si el id está en el array del usuario hacemos la llamada a la API
            if (arrayId.includes(idReserva)) {

                fetch('http://localhost:8080/reservas/${idReserva}'.replace('${idReserva}', idReserva), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
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
                        infoReservas.innerHTML = "";
                        document.getElementById("idCancelar").value = "";
                        showAlert('Reserva cancelada', 'success');
                    })
                    .catch(error => {
                        // Manejar error
                        showAlert('Error: ' + error.message, 'danger');
                    });


            } else {
                showAlert("Debe introducir el id de una de sus reservas", 'warning');
            }

        });

    } else {
        //Si no está logueado se oculta el formulario, excepto la alerta
        document.getElementById('verReservas').style.display="none";
        document.getElementById('idCancelar').style.display="none";
        document.getElementById('cancelarReserva').style.display="none";
        showAlert("Debe estar logueado para ver la lista de reservas", 'warning');
    }

}
