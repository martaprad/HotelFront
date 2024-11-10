document.getElementById('reservas-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir el envío del formulario

    let fInicio = document.getElementById('fechaInicio').value;
    let fFin = document.getElementById('fechaFin').value;
    let habTipoId = document.getElementById('tipoHab').value;
    //let transf = document.getElementById('transfer').value;
    //let actividades = document.getElementById('actividades');
    //let tipoActividad = [];
    //let listActividades = {tipoActividad : []};

    if (habTipoId ==="1" || habTipoId ==="2" ||  habTipoId ==="3" ){
        
        /*Array.from(actividades.options).forEach(function (option) {

            if (option.selected === true) {
                
                tipoActividad.push(option.value);
                
                
            };
        });
        //listActividades = { tipoActividad: listActividades }; 

        transf = {tipoTraslado: transf}; 

        alert(fInicio + " " + fFin + " " + habitacionTipoId +" " + listActividades + " " + transf);*/
        alert(fInicio + " " + fFin + " " + habTipoId );
    } else {

        alert("Tienes que seleccionar una habitación");
    }


    let token = localStorage.getItem('token');
    console.log(token);

    // Hacer la llamada a la API de reservas
    
    fetch('http://localhost:8080/reservas', {  
        method: 'POST',
        //mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            fechaInicio: fInicio,
            fechaFin: fFin,
            habitacionTipoId: habTipoId
            //actividadDTOList: listActividades,
            //trasladoDTO: transf
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

