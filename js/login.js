document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir el envío del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Inicio de sesión exitoso.');
            window.location.href = 'dashboard.html'; // Redirigir al dashboard o página principal
        } else {
            alert('Error al iniciar sesión: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al iniciar sesión.');
    });
});
