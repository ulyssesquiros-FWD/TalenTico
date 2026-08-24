const API_URL = 'https://dummyjson.com/comments';

// 1. Función para obtener y listar notas (GET)
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

// 2. Función para pintar los datos en el HTML
function renderizarEntrevistas(lista) {
  const contenedor = document.getElementById('lista-entrevistas');
  contenedor.innerHTML = '';

  lista.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card-entrevista');
    card.innerHTML = `
      <p><strong>ID:</strong> ${item.id}</p>
      <p>${item.body}</p>
      <button onclick="prepararEdicion(${item.id}, '${item.body}')">Editar</button>
      <button onclick="eliminarEntrevista(${item.id})">Eliminar</button>
    `;
    contenedor.appendChild(card);
  });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', obtenerEntrevistas);