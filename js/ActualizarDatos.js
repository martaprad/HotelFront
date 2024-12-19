//Verifica si el token ha expirado (10 horas)
let fechaExpiracion = localStorage.getItem('expiracionToken');
let fechaActual = Date.now();

if (fechaActual > fechaExpiracion) {
    localStorage.clear();
}

// Función para mostrar alertas con Bootstrap
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
            </div>
        `;
}

let token = localStorage.getItem('token');

//Si el usuario está logueado
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
        document.getElementById('userMenu').style.display = "none";
        //showAlert("Debe de acceder a su cuenta de usuario antes de actualizar datos", 'warning');
        setTimeout(function () { window.location.href = 'Home.html'; }, 3000);
    });

    let name = "";
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
            name = data;
            return data;
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });


    document.getElementById('update-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const password = document.getElementById('password').value;
        const re_password = document.getElementById('re_password').value;

        //Confirmamos que introduce todos los campos
        if (!email) {
            showAlert('Introduzca el email, por favor', 'danger');
            event.preventDefault();

        } else if (!telefono) {
            showAlert('Introduzca el teléfono, por favor', 'danger');
            event.preventDefault();

        } else if (!password) {
            showAlert('Introduzca la contraseña, por favor', 'danger');
            event.preventDefault();

        } else {

            //Validamos todos los datos
            if (email) {
                // Expresión regular para verificar el email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                // Verificar si el email tiene el formato correcto
                if (!emailRegex.test(email)) {
                    showAlert('Por favor, introduce un email válido (ejemplo: algo@algo.com).', 'warning');
                    event.preventDefault();  // Evita el envío del formulario
                    return;
                }

            } else if (telefono) {
                // Expresión regular para verificar el teléfono (9 dígitos)
                const telefonoRegex = /^[0-9]{9}$/;
                // Verificar si el teléfono tiene 9 dígitos
                if (!telefonoRegex.test(telefono)) {
                    showAlert('El teléfono debe tener 9 dígitos.', 'warning');
                    event.preventDefault();  // Evita el envío del formulario
                    return;
                }

            } else if (password) {
                // Expresión regular para verificar la contraseña
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                // Verificar si la contraseña cumple con los requisitos
                if (!passwordRegex.test(password)) {
                    showAlert('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y un carácter especial.', 'warning');
                    event.preventDefault();  // Evita el envío del formulario
                    return;
                }

                // Verificar si las contraseñas coinciden
                if (password !== re_password) {
                    showAlert('Las contraseñas no coinciden.', 'danger');
                    event.preventDefault();  // Evita el envío del formulario
                    return;
                }

            }


            // Si las validaciones son correctas, hacemos la llamada al backend
            fetch('http://localhost:8080/auth/actualizar-perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: name,
                    email: email,
                    password: password,
                    telefono: telefono
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        return response.text().then(errorMessage => { throw new Error(errorMessage); });
                    }
                })

                .then(data => {
                    // Manejar respuesta exitosa
                    showAlert("Datos actualizados con éxito, realice el login de nuevo si desea realizar una reserva", 'success');
                    localStorage.removeItem('token');
                    setTimeout(function () { window.location.href = 'Home.html'; }, 3000)

                    return data;
                })

                .catch(error => {
                    //Manejar error
                    console.error('Error:', error.message);
                    showAlert('Error: ' + error.message, 'danger');
                });

        }
    });

} else {
    showAlert("Debe de acceder a su cuenta de usuario antes de actualizar datos", 'warning');
    setTimeout(function () { window.location.href = 'Home.html'; }, 3000);
};

