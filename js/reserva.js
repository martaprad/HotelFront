document.getElementById('reservas-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir el envío del formulario

    let fechaInicio = document.getElementById('fechaInicio').value;
    let fechaFin = document.getElementById('fechaFin').value;
    let habitacionTipo = document.getElementById('tipoHab').value;
    let transfer = document.getElementById('transfer').value;
    let habitacionTipoId = 0;

    if (habitacionTipo ==="1" || habitacionTipo ==="2" ||  habitacionTipo ==="1" ){
        listActividades = "Actividades: ";
        Array.from(actividades.options).forEach(function (option) {

            if (option.selected === true) {
                
                listActividades = listActividades + " " + option.value;
            };
        });
            
        alert(fechaInicio + " " + fechaFin + " " + habitacionTipo +" " + transfer + " " + listActividades);
    } else {

        alert("tienes que seleccionar una habitación");
    }

    

    

    let token = localStorage.getItem('authToken');
    console.log(token);

    // Hacer la llamada a la API de reservas
    
    fetch('http://localhost:8080/reservas', {  
        method: 'POST',
        
        //mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${token}'
        },
        body: JSON.stringify({
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            habitacionTipoId: habitacionTipoId,
            actividadDTOList:{
                tipoActividad: "SURF"
                },
            trasladoDTO: {
                tipoTraslado: transfer
                }
            })
        
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
        console.log(data);
        alert(data);
        return data;
     })
    .catch(error => {
        // Manejar error
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
    });
    
 });

