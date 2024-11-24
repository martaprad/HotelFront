window.addEventListener("load", iniciar);

function iniciar() {
    let estrellas = document.getElementsByName('rating');
    token = localStorage.getItem('token');

    //Si el usuario está logeado
    if (token) {

        document.getElementById('resenas-form').addEventListener('submit', function (event) {
            event.preventDefault();

            let resena = document.getElementById('textAreaResena').value;
            let puntuacion = "";

            //Si hemos chequeamos una puntuación guardamos el valor
            for (let estrella of estrellas) {
                if (estrella.checked)
                    puntuacion = estrella.value;

            };

            //Se debe introducir reseña y puntuación
            if (puntuacion.length === 0 || resena.length === 0) {
                alert("Debe introducir reseña y puntuación");

            } else {
                // Hacer la llamada a la API de reseñas
                fetch('http://localhost:8080/resenas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        resenaPuntuacion: puntuacion,
                        descripcion: resena
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
                        alert("Reseña guardada");
                        // Resetear el formulario después de una respuesta exitosa
                        document.getElementById('resenas-form').reset();
                        return data;

                    })

                    .catch(error => {
                        // Manejar error
                        //alert('Error' + errorMessage);
                    });
            }
        });

        //Si el usuario no se ha logueado se dehabilita el botón y se informa
    } else {
        document.getElementById("enviarResena").disabled = true;
        alert("Debe de acceder a su cuenta de usuario antes de realizar una reserva");
    }

}

