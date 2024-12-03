window.addEventListener("load", iniciar);

function iniciar() {

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

        //Logout desde el menú de usuario
        document.getElementById('logout').addEventListener('click', function (event) {
            localStorage.removeItem('token');
            document.getElementById('navbarDropdown').style.display="none";
            showAlert("Ha salido de su cuenta de usuario", 'success');
            //setTimeout(function(){window.location.href='Home.html';}, 3000);
        });
        
        
    } else {
        //Si no está logueado no se ve el menú de usuario
        document.getElementById('navbarDropdown').style.display="none";
    }
}