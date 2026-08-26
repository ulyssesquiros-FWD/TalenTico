# TALENTICO | JobConnect 💼

¡Bienvenido a **TalenTico** (JobConnect)! Este proyecto es una plataforma web (únicamente frontend) diseñada para la gestión integral de talento, reclutamiento y empleabilidad de candidatos. Permite a los reclutadores gestionar vacantes, empresas clientes, postulaciones, programar entrevistas, tomar notas y registrar tareas de seguimiento desde un panel de control unificado y responsivo.

El sistema consume de forma asíncrona un servicio centralizado de persistencia de datos (JSON Server) que simula el flujo de operaciones en producción.

---

## 🚀 Características Principales

- **Control de Acceso y Sesión (Login)**: Formulario de inicio de sesión con persistencia de token en `localStorage`. Bloqueo automático de acceso a las páginas protegidas si no se detecta una sesión activa.
- **Logotipo de Google Integrado**: Botón con el isotipo oficial multicolor de Google para inicio de sesión por demostración.
- **6 Módulos CRUD Completos**:
  1. 👤 **Candidatos**: Registro, edición, eliminación y parcheo rápido de emails de candidatos, mostrados en un formato de tabla responsivo.
  2. 💼 **Vacantes**: Creación y actualización de vacantes mediante un panel lateral animado (*drawer*).
  3. 🏢 **Empresas**: Gestión de empresas asociadas y conteo de contrataciones.
  4. 📝 **Postulaciones**: Registro de postulaciones vinculadas a candidatos por ID.
  5. 💬 **Entrevistas / Notas**: Muro de notas rápidas de candidatos de forma cronológica.
  6. 📋 **Tareas**: Lista de pendientes (*to-do list*) para reclutadores con estados dinámicos (Completado / Pendiente).
- **Diseño Corporativo Premium**: Paleta de colores optimizada inspirada en el verde bosque de marca, blanco orgánico y acentos oro/naranja, con transiciones suaves y total adaptabilidad móvil (responsive).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, Vanilla CSS (Mobile-First, Variables y Flexbox/Grid) y JavaScript Moderno (ES Modules).
- **Herramienta de Construcción**: Vite.
- **API y Persistencia**: JSON Server local (consumido mediante la API `fetch` nativa utilizando funciones asíncronas `async/await`).
- **Control de Versiones**: Git & GitHub.
- **Asistente de Investigación**: NotebookLM.

---

## 📁 Estructura del Proyecto

El código fuente está estructurado de manera modular para facilitar el trabajo cooperativo y evitar colisiones:

```text
talentico/
├── db.json                     # Base de datos local de JSON Server
├── index.html                  # Página de entrada (Dashboard del sistema)
├── package.json                # Configuración de scripts y dependencias
├── vite.config.js              # Configuración del empaquetador Vite
├── pages/                      # Páginas y vistas HTML de los módulos protegidos
│   ├── login.html              # Pantalla de Inicio de Sesión
│   ├── registro.html           # Creación de cuentas de Reclutador
│   ├── recuperar-contrasena.html
│   ├── candidatos.html
│   ├── vacantes.html
│   ├── Empresas.html
│   ├── Postulaciones.html
│   ├── entrevistas.html
│   └── tareas.html
├── src/                        # Recursos de código y diseño
│   ├── main.js                 # Controlador del Dashboard
│   ├── style.css               # Hoja de estilos globales y utilidades
│   ├── css/                    # Hojas de estilo específicas
│   │   ├── tokens.css          # Design Tokens (Paleta de colores corporativos)
│   │   ├── login.css           # Estilos de páginas de autenticación
│   │   ├── candidatos.css
│   │   └── vacantes.css
│   └── js/                     # Lógica y scripts de los módulos
│       ├── api.js              # Configuración y fetch centralizado (apiFetch)
│       ├── page-shell.js       # Control de navegación y validación de sesión
│       ├── auth.js             # Lógica de inicio y cierre de sesión
│       ├── candidatos.js
│       ├── vacantes.js
│       ├── empresas.js
│       ├── postulaciones.js
│       ├── entrevistas.js
│       └── tareas.js
└── docs/                       # Documentación técnica del proyecto
    ├── planificacion.md        # Plan de trabajo inicial y requerimientos
    ├── bitacora-notebooklm.md  # Bitácora de investigación con NotebookLM
    └── pruebas.md              # Matriz de casos de prueba ejecutados
```

---

## ⚙️ Instalación y Configuración

### Requisitos Previos
- **Node.js** (Versión 18 o superior recomendada).
- **npm** (Instalado de forma predeterminada con Node.js).

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/ulyssesquiros-FWD/TalenTico.git
cd TalenTico/talentico
```

### Paso 2: Instalar Dependencias
Instala los paquetes necesarios del empaquetador Vite y JSON Server:
```bash
npm install
```

### Paso 3: Iniciar el Servidor de Datos Local (JSON Server)
Este proyecto utiliza `json-server` para persistir los cambios del CRUD. Ejecuta el servidor en una terminal independiente en el puerto `3000`:
```bash
npx json-server db.json --port 3000
```
*Nota: El servidor expondrá los recursos de `/users`, `/candidatos`, `/vacantes`, `/todos`, `/comments`, `/posts` y `/carts` de manera local.*

### Paso 4: Iniciar el Servidor de Desarrollo Frontend (Vite)
En otra terminal, inicia el servidor de desarrollo de Vite:
```bash
npm run dev
```
Abre en tu navegador la dirección indicada en la consola (por defecto: `http://localhost:5173`).

---

## 🔒 Credenciales de Prueba

Para iniciar sesión de forma exitosa en el login de la aplicación, utiliza las siguientes credenciales simuladas de DummyJSON:
- **Usuario**: `emilys`
- **Contraseña**: `emilyspass`

---

## 👥 Equipo y División de Trabajo

El proyecto se estructuró bajo la siguiente división de responsabilidades y ramas de trabajo:

| Integrante | Rol / Responsabilidad | Módulos / Tareas Realizadas |
| :--- | :--- | :--- |
| **C1** | Líder de Integración | Arquitectura base, servicio `api.js` centralizado, integración de ramas Git y autenticación (`login`, `registro`, redirección y sesión). |
| **C2** | Desarrollador CRUD | Implementación lógica y formularios de **Candidatos** y **Vacantes** en base local. |
| **C3** | Desarrollador CRUD | Implementación lógica y formularios de **Empresas** y **Postulaciones** en base local. |
| **C4** | Desarrollador CRUD | Implementación lógica y formularios de **Entrevistas/Notas** y **Tareas** en base local. |
| **C5** | UI / QA / Docs | Normalización de CSS (`tokens.css`, `style.css`), consistencia visual responsiva de la marca, pruebas del sistema y redacción de documentación técnica. |
