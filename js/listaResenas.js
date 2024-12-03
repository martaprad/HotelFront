window.addEventListener("load", iniciar);

function iniciar() {

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

        //Logout desde el menú de usuario
        document.getElementById('logout').addEventListener('click', function (event) {
            localStorage.removeItem('token');
            showAlert("Ha salido de su cuenta de usuario", 'success');
            document.getElementById('navbarDropdown').style.display="none";
            setTimeout(function(){window.location.href='Home.html';}, 3000);
        });
        
        
    } else {
        //Si no está logueado no se ve el menú de usuario
        document.getElementById('navbarDropdown').style.display="none";
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
            var texto = "";
            for (var resenas in listaResenasJSON) {

                //let clienteId= listaResenasJSON[resenas].clienteId;

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
                texto += `<span class="star-rated">${estrellas}</span><br>` +
                listaResenasJSON[resenas].fechaResena.substring(0,10).split("-").reverse().join("-") +"<br><br>" ;
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