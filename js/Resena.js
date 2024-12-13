// Función para mostrar alertas con Bootstrap
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;
}

let estrellas = document.getElementsByName('rating');
let token = localStorage.getItem('token');

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
    
    //Ocultamos el login/Registro de la barra de navegación
    document.getElementById('loginNav').style.visibility = "hidden";

    //Logout desde el menú de usuario
    document.getElementById('logout').addEventListener('click', function (event) {
        localStorage.removeItem('token');
        document.getElementById('rating').style.display = "none";
        document.getElementById('textAreaResena').style.display = "none";
        document.getElementById('enviarResena').style.display = "none";
        document.getElementById('userMenu').style.display = "none";
        showAlert('Para escribir una reseña debe de acceder a su cuenta de usuario', 'warning');
        setTimeout(function () { window.location.href = 'Home.html'; }, 3000);
    });

    document.getElementById('resenas-form').addEventListener('submit', function (event) {
        event.preventDefault();

        let resena = document.getElementById('textAreaResena').value;
        let puntuacion = "";

        //Si hemos chequeado una puntuación guardamos el valor
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
                    //Redirige a la lista de Reseñasa los 3 seg de rellenar una reseña
                    setTimeout(function () { window.location.href = 'ListaResenas.html'; }, 3000);
                    return data;

                })

                .catch(error => {
                    // Manejar error
                    //alert('Error' + errorMessage);
                });
        }
    });

    //Si el usuario no se ha logueado se dehabilita el botón, no se ve el menú usuario y se informa
} else {

    document.getElementById('userMenu').style.display = "none";
    document.getElementById('rating').style.display = "none";
    document.getElementById('textAreaResena').style.display = "none";
    document.getElementById('enviarResena').style.display = "none";
    showAlert('Para escribir una reseña debe de acceder a su cuenta de usuario', 'warning');
}



