token = localStorage.getItem('token');
var arrayId = [];

document.getElementById('verReservas').addEventListener('click', function (event) {

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

            if (datosJSON.length ===0) {
                alert("No tiene reservas a su nombre");
            } else {
                // Recorrer JSON para imprimir los datos
                for (var reservas in datosJSON) {

                    //Guardamos en un array el id de las reservas usuario loggeado
                    arrayId.push(datosJSON[reservas].id);

                    texto += "- Reserva (id: " + datosJSON[reservas].id + "): ";

                    if (datosJSON[reservas].habitacionTipoId === "1") {
                        texto += "habitación Doble";
                    } else if (datosJSON[reservas].habitacionTipoId === "2") {
                        texto += "habitación Triple";
                    } else {
                        texto += "habitación Deluxe";
                    }

                    texto += " desde el: " + datosJSON[reservas].fechaInicio.split("-").reverse().join("-") + "<br>";
                    texto += " hasta: " + datosJSON[reservas].fechaFin.split("-").reverse().join("-");
                    texto += ", actividades: ";

                    var actListJSON = datosJSON[reservas].actividadDTOList;

                    for (var actividad in actListJSON) {
                        texto += actListJSON[actividad].tipoActividad + ", ";
                    }

                    if (datosJSON[reservas].trasladoDTO.tipoTraslado === "IDAVUELTA") {
                        texto += "<br>transfer: ida y vuelta";
                    } else if (datosJSON[reservas].trasladoDTO.tipoTraslado === "IDA") {
                        texto += "<br>transfer: ida";
                    } else {
                        texto += "<br>transfer: no reservado";
                    };

                    texto += ",  estado: " + datosJSON[reservas].estado + "<br>";

                }

                infoReservas.innerHTML += texto;
                return data;
            }
        })

        .catch (error => {
        // Manejar error
        alert('Para poder imprimir las reservas debe acceder a su cuenta de usuario');
    });

});


document.getElementById('borrarReserva').addEventListener('click', function (event) {

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
                alert(data);
            })
            .catch(error => {
                // Manejar error
                alert('Error: ' + error.message);
            });


    } else {
        alert("Debe introducir el id de una de sus reservas");
    }

});
