# Bitácora de Consultas: NotebookLM 📓

Este documento registra los principales problemas técnicos investigados y resueltos por el equipo con la ayuda de **NotebookLM** durante las fases del proyecto **JobConnect**.

---

## 📅 Registro de Consultas y Soluciones

### 🌐 Entrada 1: Diferencia entre métodos PUT y PATCH para edición
- **Pregunta consultada**: *¿Cuándo debemos usar PUT en un CRUD y cuándo es más recomendable usar PATCH, especialmente al consumir DummyJSON o JSON Server?*
- **Análisis de NotebookLM**:
  - `PUT` realiza un reemplazo completo del recurso existente con el nuevo cuerpo de datos. Si se omiten campos, estos se eliminarán en el servidor.
  - `PATCH` realiza una modificación parcial, modificando únicamente los campos que se envían en el cuerpo del request y manteniendo intacto el resto del recurso.
- **Aplicación en el proyecto**:
  - Se usó `PATCH` en **Candidatos** para la "Actualización Rápida de Correo" y en **Tareas** / **Entrevistas** para modificaciones específicas del estado o texto del registro.
  - Se usó `PUT` en **Vacantes** y **Empresas** para la edición de todo el formulario.

---

### 🔑 Entrada 2: Autenticación basada en Tokens y cabecera Authorization
- **Pregunta consultada**: *¿Cómo debemos almacenar el token devuelto por el login y enviarlo de forma segura en las peticiones HTTP subsiguientes del CRUD?*
- **Análisis de NotebookLM**:
  - El token JWT de `/auth/login` se debe almacenar de forma segura en `localStorage` o `sessionStorage`.
  - Cada petición HTTP posterior a rutas protegidas debe incluir la cabecera `Authorization` con el formato `Bearer <token>`.
  - Si el token no existe, el frontend debe abortar la llamada y redirigir inmediatamente a `login.html`.
- **Aplicación en el proyecto**:
  - Se implementó la lógica en [`src/js/api.js`](file:///c:/Users/dell5/UQV/Poyecto/TalenTico/talentico/src/js/api.js) dentro de `apiFetch()`, la cual inyecta la cabecera `Authorization: Bearer <token>` dinámicamente si el token está presente en `localStorage`.

---

### 💻 Entrada 3: Manejo de CORS y cambio de APIs externas a JSON Server local
- **Pregunta consultada**: *¿Por qué algunas solicitudes DELETE/POST dan error CORS o no guardan cambios en DummyJSON y cómo podemos solucionarlo?*
- **Análisis de NotebookLM**:
  - DummyJSON es una API de pruebas pública de solo lectura. Simula las operaciones de escritura (POST/PUT/PATCH/DELETE) devolviendo el objeto creado o editado, pero no persiste los datos. Una recarga de la página restablece el estado anterior.
  - Para persistir la información y tener control total sin CORS, es ideal montar un servidor mock local utilizando `json-server` configurando un archivo `db.json`.
- **Aplicación en el proyecto**:
  - Migramos toda la persistencia del proyecto a un servidor local de `json-server` montado sobre el puerto `3000`. Esto permitió persistir los candidatos, vacantes, empresas, postulaciones, entrevistas y tareas de manera local en el archivo `db.json`.

---

### 🎨 Entrada 4: Unificación de CSS y Responsive en diseños dinámicos
- **Pregunta consultada**: *¿Cómo unificar las hojas de estilos de múltiples desarrolladores de manera que sigan un mismo tema de colores y no choquen los estilos de los sidebars y headers?*
- **Análisis de NotebookLM**:
  - Se deben definir variables CSS (*design tokens*) en un archivo común (`tokens.css`) importado en la raíz.
  - Los componentes comunes como el Sidebar y el Topbar deben residir únicamente en la hoja de estilos global (`style.css`), y los CSS individuales de cada página deben limitarse a estilos particulares, evitando resets globales o variables repetidas.
- **Aplicación en el proyecto**:
  - Diseñamos y purgamos los CSS individuales, delegando el comportamiento responsivo, el Sidebar verde y la paleta de colores corporativos a `tokens.css` y `style.css`.
