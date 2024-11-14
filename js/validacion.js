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

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    
    const password = document.getElementById('password').value;
    const re_password = document.getElementById('re_password').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const nombre = document.getElementById('nombre').value;

    // Expresión regular para verificar la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Expresión regular para verificar el teléfono (9 dígitos)
    const telefonoRegex = /^[0-9]{9}$/;

    // Expresión regular para verificar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Verificar si el teléfono tiene 9 dígitos
    if (!telefonoRegex.test(telefono)) {
        showAlert('El teléfono debe tener 9 dígitos.', 'warning');
        event.preventDefault();  // Evita el envío del formulario
        return;
    }

    // Verificar si el email tiene el formato correcto
    if (!emailRegex.test(email)) {
        showAlert('Por favor, introduce un email válido (ejemplo: algo@algo.com).', 'warning');
        event.preventDefault();  // Evita el envío del formulario
        return;
    }

    // Si las validaciones son correctas, hacemos la llamada al backend
    if (password === re_password) {
        fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password,
                telefono: telefono
            })
        })
        .then(response => {
            if (response.ok) {
                // La respuesta es exitosa (código 2xx)
                return response.text(); // O response.json() si el servidor devuelve JSON
            } else {
                // La respuesta tiene un código de error
                return response.text().then(errorMessage => { throw new Error(errorMessage); });
            }
        })
        .then(data => {
            // Manejar respuesta exitosa
            showAlert('Éxito: ' + data, 'success'); // Muestra el mensaje del servidor
            // Puedes redirigir al usuario o limpiar el formulario aquí
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000); // Redirigir después de 2 segundos
        })
        .catch(error => {
            // Manejar error
            console.error('Error:', error.message);
            showAlert('Error: ' + error.message, 'danger');
        });
    };

});