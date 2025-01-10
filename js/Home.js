
  // Revisar si las Cookies han sido aceptads antes
  if (!localStorage.getItem('cookiesAccepted')) {
    // Si no han sido muestra el mensaje
    var cookieModal = new bootstrap.Modal(document.getElementById('cookieConsentModal'));
    cookieModal.show();
  }

  // Manejamos el consentimiento de las Cookies
  document.getElementById('acceptCookiesBtn').addEventListener('click', function () {
    //Almacenamos en LocalStorage
    localStorage.setItem('cookiesAccepted', 'true');
    //Ocultamos el mensaje de las Cookies
    var cookieModal = bootstrap.Modal.getInstance(document.getElementById('cookieConsentModal'));
    cookieModal.hide();
  });


//Verifica si el token ha expirado (10 horas)
let fechaExpiracion = localStorage.getItem('expiracionToken');
let fechaActual = Date.now();

if (fechaActual > fechaExpiracion) {
    localStorage.clear();
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
    });


} else {
    //Si no está logueado no se ve el menú de usuario
    document.getElementById('userMenu').style.display = "none";
}
