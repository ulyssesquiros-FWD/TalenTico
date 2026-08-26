# Plan de Pruebas y Criterios de Aceptación: JobConnect 🧪

Este documento detalla la matriz de pruebas unitarias e integrales realizadas para certificar el correcto funcionamiento de **JobConnect (TalenTico)**.

---

## 📋 Matriz de Casos de Prueba Ejecutados

| Área | Caso de Prueba | Entrada de Prueba | Comportamiento Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | Credenciales válidas | Usuario: `emilys`<br>Contraseña: `emilyspass` | Genera token, redirige al Dashboard (`/index.html`) y muestra estadísticas. | **Pasado** |
| **Login** | Credenciales inválidas | Usuario: `error`<br>Contraseña: `wrong` | Detiene el envío, muestra mensaje de error en rojo y no guarda token. | **Pasado** |
| **Seguridad** | Acceso sin autenticación | Intento de entrar a `/pages/candidatos.html` sin token. | Detecta que no hay token en `localStorage` y redirige inmediatamente al login. | **Pasado** |
| **Seguridad** | Cierre de sesión (Logout) | Clic en el botón "Cerrar sesión" del Sidebar. | Elimina el token del `localStorage` y redirige al inicio de sesión. | **Pasado** |
| **Candidatos** | Crear candidato (POST) | Formulario completo: nombre, apellido, correo, puesto, exp. | Agrega el candidato a la tabla y lo persiste en `db.json` con ID autogenerado. | **Pasado** |
| **Candidatos** | Editar candidato (PUT) | Formulario de edición con nuevos datos. | Actualiza la fila de la tabla del candidato y persiste cambios en la base local. | **Pasado** |
| **Candidatos** | Actualización rápida (PATCH) | Envío del formulario de cambio de email rápido. | Actualiza el correo electrónico del candidato en la tabla y base de datos. | **Pasado** |
| **Candidatos** | Eliminar candidato (DELETE) | Clic en "Eliminar" y confirmar alerta del navegador. | Quita la fila de la tabla y borra el registro de `db.json`. | **Pasado** |
| **Vacantes** | Crear vacante (POST) | Formulario en panel lateral (*drawer*). | Inserta tarjeta de vacante en el grid responsivo. | **Pasado** |
| **Vacantes** | Eliminar vacante (DELETE) | Clic en icono eliminar de tarjeta y confirmar. | Borra la tarjeta del grid y actualiza el conteo en el servidor local. | **Pasado** |
| **Empresas** | Formato apilado y CRUD | Agregar empresa con ID de usuario y contrataciones. | Muestra la empresa creada en la tabla inferior de forma apilada. | **Pasado** |
| **Postulaciones**| Formato apilado y CRUD | Crear y editar título de postulación. | Refleja la postulación con su respectivo ID de candidato en la tabla inferior. | **Pasado** |
| **Tareas** | Completar tareas (PATCH) | Clic en toggle de completado en listado de tareas. | Cambia el badge a verde (Completada) y actualiza el estado en `db.json`. | **Pasado** |
| **Entrevistas** | Crear y editar notas | Formulario superior con notas del candidato. | Agrega la nota cronológicamente con su ID de postulación correspondiente. | **Pasado** |

---

## 🏆 Criterios de Aceptación del Sistema

Para dar el proyecto por finalizado y listo para entrega, se debieron cumplir los siguientes puntos:
1. **Unificación Estética**: Todas las páginas CRUD deben compartir la estructura apilada lineal, el mismo Sidebar reactivo verde y el mismo Topbar superior.
2. **Consumo Local Homogéneo**: No se permiten llamadas a APIs de pruebas DummyJSON para guardar o persistir datos en caliente. Todo debe ir al servidor JSON local (`port 3000`).
3. **Manejo de Errores**: Toda llamada asíncrona a la API debe estar envuelta en un bloque `try/catch` y reportar errores en consola o interfaz si el servidor se encuentra inactivo.
4. **Compilación Limpia**: El empaquetador Vite debe generar los bundles de producción sin errores o advertencias críticas de PostCSS o JS.
