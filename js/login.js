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

    document.getElementById('login-form').addEventListener('submit', function (event) {
        event.preventDefault();  // Prevenir el envío del formulario

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        //Confirmamos que introduce email y password
        if (!email || !password) {
            showAlert('Debe introducir email y contraseña', 'warning');
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
                    // Manejar respuesta exitosa
                    localStorage.setItem('token', data.token);
                    showAlert('Ha accedido a su cuenta de usuario', 'success');
                    document.getElementById('emailGroup').style.display="none";
                    document.getElementById('passwordGroup').style.display="none";
                    document.getElementById('botLogin').style.display="none";
                    setTimeout(function(){window.location.href='habitaciones.html';}, 3000);
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