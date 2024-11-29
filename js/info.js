window.addEventListener("load", iniciar);

function iniciar() {

    document.getElementById('logout').addEventListener('click', function (event) {
        localStorage.removeItem('token');
    });
}