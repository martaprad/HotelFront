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
    .then(response => {
        if (response.ok) {
            return response.json(); // Decodifica la respuesta JSON si es exitoso
        } else {
            throw new Error('Error en el inicio de sesión');
        }
    })
    .then(data => {
        // Guarda el token en localStorage o sessionStorage
        localStorage.setItem('token', data.jwt);  // 'jwt' es el campo en AuthResponseDTO
        console.log('Token guardado:', data.jwt);
        // Redirige al usuario o realiza otra acción según el flujo de tu app
    })
    .catch(error => console.error('Error:', error));
});
