window.addEventListener("load", iniciar);

function iniciar() {
    // funcion que muestra alertas
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;
    }

    token = localStorage.getItem('token');
    var arrayId = [];

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

        //Logout desde el menú de usuario
        document.getElementById('logout').addEventListener('click', function (event) {
            localStorage.removeItem('token');
            infoReservas.innerHTML = "";
            showAlert("Debe estar logueado para ver la lista de reservas", 'warning');
            document.getElementById('navbarDropdown').style.display="none";
            setTimeout(function(){window.location.href='Home.html';}, 3000);
        });    

        // Creamos la tabla para mostrar la lista de reservas
        infoReservas.innerHTML = "";

        let table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'table-bordered');
        let tableHeader = `
            <thead>
                <tr>
                    <th style="width: 50px;">ID</th>
                    <th style="width: 100px;">F. Reserva</th>
                    <th style="width: 120px;">Habitación</th>
                    <th style="width: 100px;">F. Inicio</th>
                    <th style="width: 100px;">F. Fin</th>
                    <th style="width: 150px;">Actividades</th>
                    <th style="width: 100px;">Transfer</th>
                    <th style="width: 80px;">Estado</th>
                    <th style="width: 80px;">Precio</th>
                    <th style="width: 50px;">Cancelar Reserva</th>
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
                        if (datosJSON[reservas].habitacionTipoId === "1") {
                            habitacionTipo = 'Doble';
                        } else if (datosJSON[reservas].habitacionTipoId === "2") {
                            habitacionTipo = 'Triple';
                        } else {
                            habitacionTipo = 'Deluxe';
                        }

                        let actividades = '';
                        var actListJSON = datosJSON[reservas].actividadDTOList;
                        for (var actividad in actListJSON) {
                            actividades += actListJSON[actividad].tipoActividad + ", ";
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
                                        <td>${datosJSON[reservas].id}</td>
                                        <td>${datosJSON[reservas].fechaReserva.substring(0, 10).split("-").reverse().join("-")}</td>
                                        <td>${habitacionTipo}</td>
                                        <td>${datosJSON[reservas].fechaInicio.split("-").reverse().join("-")}</td>
                                        <td>${datosJSON[reservas].fechaFin.split("-").reverse().join("-")}</td>
                                        <td>${actividades}</td>
                                        <td>${transfer}</td>
                                        <td>${datosJSON[reservas].estado}</td>
                                        <td>${datosJSON[reservas].precio}€</td>
                                        <td><button class="btn btn-danger cancel-btn">Cancelar</button></td>

                                    </tr>
                                `;
                    }

                    table.innerHTML += "</tbody>";
                    infoReservas.appendChild(table);

                    //Añadimos evento a cada botón de cancelar
                    const cancelButtons = document.querySelectorAll('.cancel-btn');
                    cancelButtons.forEach((btn) => {
                        btn.addEventListener('click', function (event) {
                            let row = event.target.closest('tr');
                            let idReserva = datosJSON[reservas].id;
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
            idReserva=parseInt(idReserva);
            showAlert(idReserva , 'warning');
            const token = localStorage.getItem('token');
            fetch('http://localhost:8080/reservas/${idReserva}'.replace('${idReserva}', idReserva),{
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

}
