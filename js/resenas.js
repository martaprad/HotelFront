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
                showAlert("Introduzca reseña y puntuación", 'warning');

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
                        showAlert("Reseña guardada", 'success');
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
        showAlert("Debe de acceder a su cuenta de usuario antes de realizar una reserva", 'warning');
    }

}

