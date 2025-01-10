window.addEventListener("load", iniciar);

// Revisar si las Cookies han sido aceptads antes
if (!localStorage.getItem('cookiesAccepted')) {
    // Si no han sido redirige al Home
    window.location.href = 'Home.html';
}

function iniciar() {

    // Función para mostrar alertas con Bootstrap
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;
    }

    document.getElementById('login-form').addEventListener('submit', function (event) {
        event.preventDefault();  // Prevenir el envío del formulario

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        //Confirmamos que introduce email y password
        if (!email) {
            showAlert('Debe introducir email', 'warning');

        } else if (!password){
            showAlert('Debe introducir la contraseña', 'warning');

        } else {

            // Hacer la llamada a la API de login
            fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
                .then(response => {
                    if (response.ok) {
                        // La respuesta es exitosa (código 2xx)
                        return response.json();
                    } else {
                        // La respuesta tiene un código de error
                        return response.text().then(errorMessage => { throw new Error(errorMessage); });
                    }
                })

                .then(data => {
                    // Manejar respuesta exitosa, almacenamos el token y su fecha de expiración, mostramos alerta 
                    // ocultamos los campos del formulario y redigirimos a Home
                    localStorage.setItem('token', data.token);
                    // 10 hours en milisegundos
                    let expiracionToken = Date.now() + 10 * 60 * 60 * 1000; 
                    localStorage.setItem('expiracionToken', expiracionToken);
                    showAlert('Ha accedido a su cuenta de usuario', 'success');
                    document.getElementById('emailGroup').style.display="none";
                    document.getElementById('passwordGroup').style.display="none";
                    document.getElementById('botLogin').style.display="none";
                    setTimeout(function(){window.location.href='Home.html';}, 3000);
                    return data;
                })

                .catch(error => {
                    // Manejar error
                    console.error('Error:', error.message);
                    showAlert('Error: ' + error.message, 'danger');
                });
        }
    });

}