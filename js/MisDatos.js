// funcion que muestra alertas
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;
}

let token = localStorage.getItem('token');

// Si el usuario está logueado
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
        infoDatos.innerHTML = "";
        showAlert("Debe estar logueado para actualizar sus datos", 'warning');
        document.getElementById('userMenu').style.display = "none";
        setTimeout(function () { window.location.href = 'Home.html'; }, 3000);
    });

    // Creamos la tabla para mostrar los datos de usuario
    infoDatos.innerHTML = "";

    let table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered');
    let tableHeader = `
            <thead>
                <tr>
                    <th style="width: 50px;">Dato</th>
                    <th style="width: 50px;">Valor</th>
                </tr>
            </thead>
            <tbody>
        `;
    table.innerHTML = tableHeader;

    // obtenemos los datos de usuario
    fetch('http://localhost:8080/auth', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                return response.text().then(errorMessage => { throw new Error(errorMessage); });
            }
        })
        .then(data => {
            datosJSON = JSON.parse(data);

            // Añadimos tantas filas como datos a la tabla
            table.innerHTML += `
            <tr>
                <td>Nombre</td>
                <td>${datosJSON.nombre}</td>              
            </tr>
            <tr>
                <td>Email</td>
                <td>${datosJSON.email}</td>     
            </tr>
            <tr>
                <td>Password</td>
                <td>********</td> 
            </tr>
            <tr>
                <td>Teléfono</td>
                <td>${datosJSON.telefono}</td>
            </tr>
 
            `;


            table.innerHTML += "</tbody>";
            infoDatos.appendChild(table);

            return data;

        })
        .catch(error => {
            //console.error('Error:', error.message);
            showAlert('Para poder ver sus datos debe acceder a su cuenta de usuario', 'warning');
        });

} else {
    showAlert('Para poder ver sus datos debe acceder a su cuenta de usuario', 'warning');
}

