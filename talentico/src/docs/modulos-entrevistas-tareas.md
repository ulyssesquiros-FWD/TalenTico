  Documentación Técnica de Módulos - C4 (Entrevistas y Tareas)

1. Módulo: Entrevistas y Notas (/comments)
 Descripción del negocio: Permite al reclutador llevar un registro y control de las observaciones, comentarios y notas asociadas a los candidatos durante su proceso de entrevista.  
 Endpoint de la API: 
    

  Estructura de campos:

id (Number): Identificador único de la nota/comentario.
body (String): Contenido o texto de la nota de la entrevista.
postId (Number): Identificador de la postulación o proceso asociado.
userId (Number): Identificador del reclutador o usuario que registró la nota.

Comportamiento y Flujo Operativo:

GET (Listar): Consume /comments para obtener el listado inicial de notas y las renderiza dinámicamente en tarjetas en la interfaz.  
POST (Crear): Envía un objeto con el texto body, postId y userId a /comments/add simulando la creación de una nueva nota (retorna estado 201 Created).  
PATCH (Editar): Envía una actualización parcial con el texto editado del body a /comments/{id} (retorna estado 200 OK).  
DELETE (Eliminar): Solicita la eliminación de la nota mediante /comments/{id} con confirmación previa del usuario (retorna estado 200 OK con "isDeleted": true).  

Manejo de persistencia: Dado que DummyJSON no guarda los cambios en su servidor, los métodos de modificación simulan el éxito según el comportamiento esperado de la API.  

2. Módulo: Tareas del Reclutador (/todos)Descripción del negocio: 
 Permite organizar, gestionar y marcar el estado de avance de las actividades pendientes del reclutador (ej. coordinar entrevistas, revisar CVs, enviar pruebas técnicas).  
 Endpoint de la API: 
  

  Estructura de campos:

id (Number): Identificador único de la tarea.
todo (String): Descripción detallada de la tarea pendiente.
completed (Boolean): Estado de la tarea (true para completada, false para pendiente).
userId (Number): Identificador del reclutador asignado a la tarea.

Comportamiento y Flujo Operativo:

GET (Listar): Consume /todos para obtener las tareas del reclutador y muestra visualmente si cada tarea está ✅ Completada o ⏳ Pendiente.  
POST (Crear): Envía la descripción (todo), el estado inicial de la casilla (completed) y el userId a /todos/add (retorna estado 201 Created).  
PATCH (Editar): Permite modificar la descripción de la tarea y/o alternar el estado de finalizado mediante /todos/{id} (retorna estado 200 OK).  
DELETE (Eliminar): Remueve la tarea seleccionada llamando a /todos/{id} con mensaje de confirmación (retorna estado 200 OK con "isDeleted": true).  

Manejo de Errores: Todas las llamadas HTTP están envueltas en bloques try/catch para prevenir caídas de la aplicación en caso de fallas de red o respuestas no válidas de la API.  