window.addEventListener("load", iniciar);

function iniciar() {
    // Hacer la llamada a la API de reseñas
    fetch('http://localhost:8080/resenas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }

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
            listaResenasJSON = JSON.parse(data);
            var texto = "";
            for (var resenas in listaResenasJSON) {
                texto += "\"" + listaResenasJSON[resenas].descripcion + "\" ";

                // Variable para almacenar las estrellas
                let estrellas = '';

                if (listaResenasJSON[resenas].resenaPuntuacion == "one") {
                    estrellas = '★';
                } else if (listaResenasJSON[resenas].resenaPuntuacion == "two") {
                    estrellas = '★ ★';
                } else if (listaResenasJSON[resenas].resenaPuntuacion == "three") {
                    estrellas = '★ ★ ★';
                } else if (listaResenasJSON[resenas].resenaPuntuacion == "four") {
                    estrellas = '★ ★ ★ ★';
                } else {
                    estrellas = '★ ★ ★ ★ ★';
                }

                // Agregar las estrellas y aplicar el color amarillo
                texto += `<span class="star-rated">${estrellas}</span><br><br>`;
            }
            // Añadir el texto con las estrellas al contenedor en el HTML
            infoListaResenas.innerHTML += texto;
            return data;

        })

        .catch(error => {
            // Manejar error
            showAlert('Error: ' + error.message, 'danger');
        });
}