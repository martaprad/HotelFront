# 🏨 HotelFront

**Hotel MDV** es una aplicación web desarrollada como proyecto final del Ciclo Superior de Desarrollo de Aplicaciones Web. Esta plataforma permite a los usuarios realizar reservas en un hotel, incluyendo habitaciones, actividades y transfers, todo ello desde una interfaz moderna, accesible y segura. Este repositorio contiene la **parte frontend**.

🔗 [Repositorio del backend [Hotel (Spring Boot)](https://github.com/DavidRNMR/Hotel)

---

## 🌟 Funcionalidades principales

- Registro e inicio de sesión de usuarios con validación segura
- Gestión de reservas: habitaciones, actividades y traslados
- Visualización de reseñas y posibilidad de escribir valoraciones
- Visualización de habitaciones y servicios disponibles
- Perfil de usuario: consultar y actualizar datos personales
- Gestión de reservas activas y cancelaciones
- Panel de administración para consultar todas las reservas
- Interfaz clara, responsiva y optimizada para navegadores modernos

## 🖥️ Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- Fetch API (para llamadas HTTP al backend)

### Backend

- Java 17 + Spring Boot 3
- Spring Security + JWT
- MySQL
- Maven
- Docker + Docker Compose

---

## 🚀 Cómo ejecutar el proyecto

### ✅ Opción 1: Usando Docker (recomendado)

> Requiere tener instalados Docker y Docker Compose

1. Clona ambos repositorios:
   ```bash
  git clone https://github.com/martaprad/HotelFront.git
  git clone https://github.com/DavidRNMR/Hotel.git

2. Asegúrate de tener el archivo docker-compose.yml (proporcionado en el backend)

3. Desde la raíz del proyecto donde esté el docker-compose.yml, ejecuta:
  docker-compose up --build

4. Accede desde el navegador:
  🌐 Frontend: http://localhost:3002/Home.html
  🛠️ Backend: http://localhost:8080

### 🛠️ Opción 2: Manualmente (sin Docker)
1. Abre los archivos HTML desde un servidor local (por ejemplo, usando la extensión Live Server de VSCode)

2. Asegúrate de que el backend esté en ejecución en localhost:8080 con acceso a la base de datos MySQL

3. Accede desde tu navegador a Home.html

👥 Autores
- Marta Pradillo
- David Rivera
- Verónica Gómez
