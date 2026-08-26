# Planificación del Proyecto: JobConnect 💼

Este documento detalla el alcance, los requerimientos y la asignación de responsabilidades iniciales del proyecto **JobConnect (TalenTico)**.

---

## 1. Alcance Completo del Proyecto

El sistema es una plataforma web puramente frontend desarrollada con HTML, CSS y JavaScript que se comunica de forma asíncrona con una API simulada. El objetivo principal es permitir a un reclutador autenticado administrar seis áreas operativas de reclutamiento (candidatos, vacantes, empresas, postulaciones, notas de entrevistas y tareas) desde un único panel administrativo.

---

## 2. Requerimientos Funcionales (RF)

| Código | Requerimiento Funcional | Estado |
| :--- | :--- | :--- |
| **RF-01** | Iniciar sesión ingresando usuario y contraseña contra el endpoint de autenticación. | **Completado** |
| **RF-02** | Almacenar el token de sesión y agregarlo como cabecera `Authorization` en llamadas protegidas. | **Completado** |
| **RF-03** | Restringir el acceso a todas las páginas de los módulos protegidos si no hay sesión activa. | **Completado** |
| **RF-04** | Cerrar sesión limpiando el token de sesión de la memoria local y redirigir al login. | **Completado** |
| **RF-05** | Listar registros (GET) de cada uno de los 6 módulos de negocio de forma clara. | **Completado** |
| **RF-06** | Crear registros (POST) en cada uno de los 6 módulos a través de formularios dedicados. | **Completado** |
| **RF-07** | Editar registros existentes (PUT / PATCH) en cada módulo según corresponda. | **Completado** |
| **RF-08** | Eliminar registros (DELETE) de cada uno de los 6 módulos de forma individual con confirmación. | **Completado** |
| **RF-09** | Mostrar mensajes de retroalimentación (éxito/error) al usuario en cada acción del CRUD. | **Completado** |
| **RF-10** | Navegar fluida y dinámicamente entre todos los módulos desde una interfaz principal (Sidebar reactivo). | **Completado** |

---

## 3. Requerimientos No Funcionales (RNF)

- **RNF-01**: Sistema únicamente frontend desarrollado con HTML5, CSS3 y JavaScript Vanilla (sin frameworks pesados).
- **RNF-02**: Organización modular de carpetas dividida por propósitos claros (`/pages`, `/src/js`, `/src/css`, `/docs`).
- **RNF-03**: Consumo asíncrono de API mediante la función `fetch` nativa utilizando la sintaxis moderna `async/await` con control de errores mediante bloques `try/catch`.
- **RNF-04**: Interfaz de usuario responsiva, limpia, intuitiva y optimizada para uso en resoluciones de escritorio, tabletas y dispositivos móviles.
- **RNF-05**: Seguridad en la transferencia del token, impidiendo la exposición de credenciales o accesos no autorizados en el código estático.
- **RNF-06**: Uso obligatorio de Git para control de versiones con flujo de ramas por características (*feature branches*).

---

## 4. División de Roles y Responsabilidades

| Integrante | Rol Principal | Área / Módulos de Trabajo |
| :--- | :--- | :--- |
| **C1 · Líder** | Arquitectura y Autenticación | Creación de estructura inicial de directorios, configuración de API compartida (`src/js/api.js`), lógica de autenticación (`auth.js`), protección de rutas (`page-shell.js`) e integración de ramas en GitHub. |
| **C2** | Desarrollador CRUD 1 | Implementación de las vistas y operaciones CRUD de **Candidatos** y **Vacantes**. |
| **C3** | Desarrollador CRUD 2 | Implementación de las vistas y operaciones CRUD de **Empresas Clientes** y **Postulaciones**. |
| **C4** | Desarrollador CRUD 3 | Implementación de las vistas y operaciones CRUD de **Entrevistas/Notas** y **Tareas**. |
| **C5** | UI / QA / Documentador | Homologación visual de CSS global, variables de marca en `tokens.css`, verificación de responsive, matriz de pruebas de integración y redacción de entregables finales. |

---

## 5. Cronograma Operativo Recomendado

1. **Fase 1: Planificación (Día 1)**:
   - Configuración del repositorio inicial y ramas.
   - Definición de los contratos de API y mapeo de datos en `db.json`.
   - Propuesta de wireframes y paleta de colores de marca corporativos.
2. **Fase 2: Desarrollo (Día 2)**:
   - C1 implementa login, logout y protección base de navegación.
   - C2, C3 y C4 programan los CRUDs de manera independiente en sus respectivas ramas.
   - C5 normaliza estilos comunes de tablas, formularios y sidebars de forma responsiva.
3. **Fase 3: Cierre e Integración (Día 3)**:
   - Integración de todas las ramas en `integration/final-talento` y resolución de conflictos.
   - Ejecución de pruebas integrales para comprobar la persistencia en el servidor local.
   - Generación de documentación final, bitácora de NotebookLM e infografía de entrega.
