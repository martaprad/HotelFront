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

    let token = localStorage.getItem('token');

    //Si el usuario está logueado
    if (token) {

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
}

