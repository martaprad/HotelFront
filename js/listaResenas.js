let token = localStorage.getItem('token');

//Si el usuario está logueado
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
        document.getElementById('userMenu').style.display = "none";
        setTimeout(function () { window.location.href = 'Home.html'; }, 3000);
    });


} else {
    //Si no está logueado no se ve el menú de usuario
    document.getElementById('userMenu').style.display = "none";
}

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
        let texto = "";
        let totalResenas=0;
        let puntuacion=0;
        for (var resenas in listaResenasJSON) {

            //Variable para almacenar el nombre e imprimirlo
            let nombre = listaResenasJSON[resenas].nombreCliente;
            texto += nombre.charAt(0).toUpperCase() + nombre.slice(1) + ": <br>";

            //Se imprime la descripción
            texto += "\"" + listaResenasJSON[resenas].descripcion + "\" ";

            // Variable para almacenar las estrellas
            let estrellas = '';

            if (listaResenasJSON[resenas].resenaPuntuacion == "one") {
                estrellas = '★';
                puntuacion+=1;
            } else if (listaResenasJSON[resenas].resenaPuntuacion == "two") {
                estrellas = '★ ★';
                puntuacion+=2;
            } else if (listaResenasJSON[resenas].resenaPuntuacion == "three") {
                estrellas = '★ ★ ★';
                puntuacion+=3;
            } else if (listaResenasJSON[resenas].resenaPuntuacion == "four") {
                estrellas = '★ ★ ★ ★';
                puntuacion+=4;
            } else {
                estrellas = '★ ★ ★ ★ ★';
                puntuacion+=5;
            }
            totalResenas++;
            // Agregar las estrellas y aplicar el color amarillo
            texto += `<span class="star-rated">${estrellas}</span><br>` +
                listaResenasJSON[resenas].fechaResena.substring(0, 10).split("-").reverse().join("-") + "<br>";
        }
        // Añadir el texto con las estrellas al contenedor en el HTML
        //se añade un if para que aparezca un texto en caso de no tener valoraciones aún
        if (totalResenas === 0) {
            infoPuntuacionResenas.innerHTML += "Puntuación Hotel: sin valoraciones aún";
            } else {
            totalPuntuacion = puntuacion/totalResenas;
            infoListaResenas.innerHTML += texto + '<br></br>';
            infoPuntuacionResenas.innerHTML += "Puntuación Hotel: " + totalPuntuacion.toFixed(2);
            }
        return data;
    })

    .catch(error => {
        // Manejar error
        showAlert('Error: ' + error.message, 'danger');
    });
