// funcion que muestra alertas
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;
}

let token = localStorage.getItem('token');
let arrayId = [];

// Si el usuario está logueado
if (token) {

    // Obtenemos el nombre
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

    //Ocultamos el login/Registro de la barra de navegación
    document.getElementById('loginNav').style.visibility = "hidden";

    //Logout desde el menú de usuario
    document.getElementById('logout').addEventListener('click', function (event) {
        localStorage.removeItem('token');
        infoReservas.innerHTML = "";
        showAlert("Debe estar logueado para ver la lista de reservas", 'warning');
        document.getElementById('userMenu').style.display = "none";
        setTimeout(function () { window.location.href = 'Home.html'; }, 3000);
    });

    // Creamos la tabla para mostrar la lista de reservas
    infoReservas.innerHTML = "";

    let table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered');
    let tableHeader = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>F. Reserva</th>
                    <th>Habitación</th>
                    <th>F. Inicio</th>
                    <th>F. Fin</th>
                    <th>Actividades</th>
                    <th>Transfer</th>
                    <th>Estado</th>
                    <th>Precio</th>
                    <th>Cancelar Reserva</th>
                </tr>
            </thead>
            <tbody>
        `;
    table.innerHTML = tableHeader;

    // obtenemos la lista de reservas
    fetch('http://localhost:8080/reservas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                return response.text().then(errorMessage => { throw new Error(errorMessage); });
            }
        })
        .then(data => {
            datosJSON = JSON.parse(data);

            if (datosJSON.length === 0) {
                showAlert("No tiene reservas a su nombre", 'warning');
            } else {
                // Recorremos el array devuelto para rellenar la tabla de reservas
                for (var reservas in datosJSON) {
                    arrayId.push(datosJSON[reservas].id);

                    let habitacionTipo = '';

                    if (datosJSON[reservas].habitacionTipoId == "1") {
                        habitacionTipo = 'Doble';
                    } else if (datosJSON[reservas].habitacionTipoId == "2") {
                        habitacionTipo = 'Triple';
                    } else {
                        habitacionTipo = 'Deluxe';
                    }

                    let actividades = '';
                    var actListJSON = datosJSON[reservas].actividadDTOList;

                    // Extraer los nombres de las actividades en un array y unirlos con comas
                    if (actListJSON && actListJSON.length > 0) {
                        actividades = actListJSON.map(actividad => actividad.tipoActividad).join(", ");
                    }

                    let transfer = '';
                    if (datosJSON[reservas].trasladoDTO.tipoTraslado === "IDAVUELTA") {
                        transfer = "Ida y vuelta";
                    } else if (datosJSON[reservas].trasladoDTO.tipoTraslado === "IDA") {
                        transfer = "Ida";
                    } else {
                        transfer = "No reservado";
                    }

                    // Añadimos una fila a la tabla
                    table.innerHTML += `
                                    <tr>
                                        <td style="text-align: center; vertical-align: middle;">${datosJSON[reservas].id}</td>
                                        <td style="text-align: center; vertical-align: middle;">${datosJSON[reservas].fechaReserva.substring(0, 10).split("-").reverse().join("-")}</td>
                                        <td style="text-align: center; vertical-align: middle;">${habitacionTipo}</td>
                                        <td style="text-align: center; vertical-align: middle;">${datosJSON[reservas].fechaInicio.split("-").reverse().join("-")}</td>
                                        <td style="text-align: center; vertical-align: middle;">${datosJSON[reservas].fechaFin.split("-").reverse().join("-")}</td>
                                        <td style="text-align: center; vertical-align: middle;">${actividades}</td>
                                        <td style="text-align: center; vertical-align: middle;">${transfer}</td>
                                        <td style="text-align: center; vertical-align: middle;">${datosJSON[reservas].estado}</td>
                                        <td style="text-align: center; vertical-align: middle;">${datosJSON[reservas].precio}€</td>
                                        <td style="text-align: center; vertical-align: middle;"><button class="btn btn-danger cancel-btn">Cancelar</button></td>

                                    </tr>
                                `;
                }

                table.innerHTML += "</tbody>";
                infoReservas.appendChild(table);

                //Añadimos evento a cada botón de cancelar
                const cancelButtons = document.querySelectorAll('.cancel-btn');
                cancelButtons.forEach((btn, index) => {
                    btn.addEventListener('click', function (event) {
                        let row = event.target.closest('tr');
                        //Usamos el index para obtener el id de la reserva
                        let idReserva = datosJSON[index].id; 
                        cancelarReserva(idReserva, row); 
                    });
                });

                return data;
            }
        })
        .catch(error => {
            showAlert('Para poder ver las reservas debe acceder a su cuenta de usuario', 'warning');
        });

    // Funcion para cancelar reserva
    function cancelarReserva(idReserva, row) {
        idReserva = parseInt(idReserva);
        showAlert(idReserva, 'warning');
        //const token = localStorage.getItem('token');
        fetch('http://localhost:8080/reservas/${idReserva}'.replace('${idReserva}', idReserva), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    // Quitamos la fila de la tabla
                    row.remove();
                    showAlert("Reserva cancelada con éxito", 'success');
                } else {
                    showAlert("Hubo un error al cancelar la reserva", 'danger');
                }
            })
            .catch(error => {
                showAlert("Error en la solicitud", 'danger');
            });
    }


} else {
    showAlert("Debe estar logueado para ver la lista de reservas", 'warning');
}

