let token = localStorage.getItem('token');

document.getElementById('reservas-form').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevenir el envío del formulario

    //Validamos las fechas
    let fHoy = new Date().toISOString();
    let fechaActual = fHoy.substring(0, 10);
    let fInicio = document.getElementById('fechaInicio').value;
    let fFin = document.getElementById('fechaFin').value;

    if ((fInicio < fechaActual) || (fFin < fechaActual)) {
        alert('La fecha de la reserva no puede ser anterior a la fecha de hoy');

    } else if (fFin < fInicio) {
        alert('La fecha inicial de la reserva tiene que ser anterior a la fecha final de la reserva');

    } else {
        let habTipoId = document.getElementById('tipoHab').value;
        let transf = document.getElementById('transfer').value;
        let actividadesList = document.getElementById('actividades');

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

        //Recorrer las actividades seleccionadas 
        for (let i = 0; i < actividadesList.selectedOptions.length; i++) {
            myJson.actividadDTOList.push({ tipoActividad: actividadesList.selectedOptions[i].value });
        }

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
                //alert("Ha reservado una habitacion " + data);

                // Hacer la llamada a la API calcularPrecio
                fetch('http://localhost:8080/reservas/calcularPrecio', {
                    method: 'POST',
                    //mode: 'no-cors',
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
                            alert("Ha reservado una habitación Doble desde " + fInicio.split("-").reverse().join("-") +
                                " hasta " + fFin.split("-").reverse().join("-") + " el precio total es " + data);
                        } else if (habTipoId == "2") {
                            alert("Ha reservado una habitación Triple desde " + fInicio.split("-").reverse().join("-") +
                                " hasta " + fFin.split("-").reverse().join("-") + " el precio total es " + data);
                        } else {
                            alert("Ha reservado una habitación Deluxe desde " + fInicio.split("-").reverse().join("-") +
                                " hasta " + fFin.split("-").reverse().join("-") + " el precio total es " + data);
                        }
                        //window.location.href = 'listaReservas.html';
                        return data;
                    })
                    .catch(error => {
                        // Manejar error
                        console.error('Error:', error.message);
                        alert('Error: ' + error.message);
                    });

                return data;
            })
            
            .catch(error => {
                // Manejar error
                alert('Error: ' + error.message);
            });
    }
});




