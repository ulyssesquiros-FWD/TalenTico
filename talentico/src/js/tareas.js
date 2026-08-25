const API_URL = 'https://dummyjson.com/todos';

// 1. Obtener y listar tareas (GET)
async function obtenerTareas() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error('Error al obtener datos');
    
    const datos = await respuesta.json();
    renderizarTareas(datos.todos);
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudieron cargar las tareas');
  }
}

// 2. Renderizar lista en HTML
function renderizarTareas(lista) {
  const contenedor = document.getElementById('lista-tareas');
  contenedor.innerHTML = '';

  lista.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card-tarea');
    
    const estadoTexto = item.completed ? '✅ Completada' : '⏳ Pendiente';

    card.innerHTML = `
      <p><strong>ID:</strong> ${item.id}</p>
      <p id="titulo-${item.id}"><strong>Tarea:</strong> ${item.todo}</p>
      <p><strong>Estado:</strong> ${estadoTexto}</p>
      <button class="btn-editar-tarea" data-id="${item.id}" data-completed="${item.completed}">Editar</button>
      <button class="btn-eliminar-tarea" data-id="${item.id}">Eliminar</button>
    `;
    
    contenedor.appendChild(card);
  });

  // Eventos de Editar
  document.querySelectorAll('.btn-editar-tarea').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const completed = e.target.getAttribute('data-completed') === 'true';
      const titulo = document.getElementById(`titulo-${id}`).innerText.replace('Tarea: ', '');
      prepararEdicion(id, titulo, completed);
    });
  });

  // Eventos de Eliminar
  document.querySelectorAll('.btn-eliminar-tarea').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      eliminarTarea(id);
    });
  });
}

// 3. Preparar datos para edición
function prepararEdicion(id, titulo, completed) {
  document.getElementById('tarea-id').value = id;
  document.getElementById('tarea-titulo').value = titulo;
  document.getElementById('tarea-completada').checked = completed;
  document.getElementById('tarea-titulo').focus();
}

// 4. Crear (POST) o Editar (PATCH)
document.getElementById('form-tarea').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('tarea-id').value;
  const titulo = document.getElementById('tarea-titulo').value;
  const completada = document.getElementById('tarea-completada').checked;

  try {
    if (id) {
      // Editar con PATCH
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: titulo,
          completed: completada
        })
      });
      if (!respuesta.ok) throw new Error('Error al actualizar');
      alert(`Tarea ID ${id} actualizada con éxito (PATCH simulado)`);
    } else {
      // Crear con POST
      const respuesta = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: titulo,
          completed: completada,
          userId: 5
        })
      });
      if (!respuesta.ok) throw new Error('Error al crear');
      alert('Tarea creada con éxito (POST simulado)');
    }

    // Limpiar formulario
    document.getElementById('form-tarea').reset();
    document.getElementById('tarea-id').value = '';
    obtenerTareas();

  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al procesar la solicitud');
  }
});

// 5. Eliminar (DELETE)
async function eliminarTarea(id) {
  if (!confirm(`¿Deseas eliminar la tarea ID ${id}?`)) return;

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!respuesta.ok) throw new Error('Error al eliminar');
    
    alert(`Tarea ID ${id} eliminada con éxito (DELETE simulado)`);
    obtenerTareas();
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudo eliminar la tarea');
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', obtenerTareas);