const API_URL = 'https://dummyjson.com/comments';

// 1. Obtener y listar notas (GET)
async function obtenerEntrevistas() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error('Error al obtener datos');
    
    const datos = await respuesta.json();
    renderizarEntrevistas(datos.comments);
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudieron cargar las entrevistas');
  }
}

// 2. Renderizar lista en HTML
function renderizarEntrevistas(lista) {
  const contenedor = document.getElementById('lista-entrevistas');
  contenedor.innerHTML = '';

  lista.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card-entrevista');
    
    card.innerHTML = `
      <p><strong>ID:</strong> ${item.id}</p>
      <p id="texto-${item.id}">${item.body}</p>
      <button class="btn-editar" data-id="${item.id}">Editar</button>
      <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
    `;
    
    contenedor.appendChild(card);
  });

  // Asignar eventos de editar
  document.querySelectorAll('.btn-editar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const texto = document.getElementById(`texto-${id}`).innerText;
      prepararEdicion(id, texto);
    });
  });

  // Asignar eventos de eliminar
  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      eliminarEntrevista(id);
    });
  });
}

// 3. Cargar datos en el formulario para editar
function prepararEdicion(id, body) {
  document.getElementById('entrevista-id').value = id;
  document.getElementById('entrevista-body').value = body;
  document.getElementById('entrevista-body').focus();
}

// 4. Crear (POST) o Editar (PATCH)
document.getElementById('form-entrevista').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('entrevista-id').value;
  const body = document.getElementById('entrevista-body').value;

  try {
    if (id) {
      // Editar con PATCH
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body })
      });
      if (!respuesta.ok) throw new Error('Error al actualizar');
      alert(`Nota ID ${id} actualizada con éxito (PATCH simulado)`);
    } else {
      // Crear con POST
      const respuesta = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: body,
          postId: 3,
          userId: 5
        })
      });
      if (!respuesta.ok) throw new Error('Error al crear');
      alert('Nota creada con éxito (POST simulado)');
    }

    // Limpiar formulario
    document.getElementById('form-entrevista').reset();
    document.getElementById('entrevista-id').value = '';
    obtenerEntrevistas();

  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al procesar la solicitud');
  }
});

// 5. Eliminar (DELETE)
async function eliminarEntrevista(id) {
  if (!confirm(`¿Deseas eliminar la nota ID ${id}?`)) return;

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!respuesta.ok) throw new Error('Error al eliminar');
    
    alert(`Nota con ID ${id} eliminada con éxito (DELETE simulado)`);
    obtenerEntrevistas();
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudo eliminar la nota');
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', obtenerEntrevistas);