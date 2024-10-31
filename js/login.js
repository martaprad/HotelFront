document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir el envío del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Hacer la llamada a la API de login
    fetch('http://localhost:8080/auth/login', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            //'Authorization': 'Bearer' + token,
            //'Access-Control-Allow-Origin' 
            //'Authorization': 'Bearer' + token,
            //'Access-Control-Allow-Origin' 
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (response.ok) {
            // La respuesta es exitosa (código 2xx)
            return response.text();
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
        console.log(data);
        let token = data;
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = 'reservas.html';
        return data;
            // La respuesta tiene un código de error
            return response.text().then(errorMessage => { throw new Error(errorMessage); });
        }
    })
    .then(data => {
        // Manejar respuesta exitosa
        console.log(data);
        let token = data;
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = 'reservas.html';
        return data;
    })
    .catch(error => {
        // Manejar error
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
        // Manejar error
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
    });
});