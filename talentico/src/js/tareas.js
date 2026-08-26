import { apiFetch } from './api.js';
import { initializeProtectedPage } from './page-shell.js';

initializeProtectedPage();

async function obtenerTareas() {
  try {
    const datos = await apiFetch('/todos');
    renderizarTareas(Array.isArray(datos) ? datos : []);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('lista-tareas').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Error al cargar</h3>
        <p>${error.message}</p>
      </div>`;
  }
}

function renderizarTareas(lista) {
  const contenedor = document.getElementById('lista-tareas');

  if (!lista.length) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>Sin tareas</h3>
        <p>Crea tu primera tarea usando el formulario de arriba.</p>
      </div>`;
    return;
  }

  let html = '<div style="padding: 4px 0;">';
  lista.forEach(item => {
    const estadoBadge = item.completed
      ? '<span class="badge badge-success">Completada</span>'
      : '<span class="badge badge-warning">Pendiente</span>';

    html += `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border);">
        <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0;">
          <span style="color: var(--text-muted); font-size: 12px; font-weight: 700; flex-shrink: 0;">#${item.id}</span>
          <span id="titulo-${item.id}" style="color: var(--text-primary); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.todo}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
          ${estadoBadge}
          <button class="text-button btn-editar-tarea" data-id="${item.id}" data-completed="${item.completed}" style="padding: 6px 10px; font-size: 11px;">Editar</button>
          <button class="text-button btn-eliminar-tarea" data-id="${item.id}" style="padding: 6px 10px; font-size: 11px; color: var(--danger);">Eliminar</button>
        </div>
      </div>`;
  });
  html += '</div>';
  contenedor.innerHTML = html;

  document.querySelectorAll('.btn-editar-tarea').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const completed = e.target.getAttribute('data-completed') === 'true';
      const titulo = document.getElementById(`titulo-${id}`).innerText;
      prepararEdicion(id, titulo, completed);
    });
  });

  document.querySelectorAll('.btn-eliminar-tarea').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      eliminarTarea(id);
    });
  });
}

function prepararEdicion(id, titulo, completed) {
  document.getElementById('tarea-id').value = id;
  document.getElementById('tarea-titulo').value = titulo;
  document.getElementById('tarea-completada').checked = completed;
  document.getElementById('tarea-titulo').focus();
}

document.getElementById('form-tarea').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('tarea-id').value;
  const titulo = document.getElementById('tarea-titulo').value;
  const completada = document.getElementById('tarea-completada').checked;

  try {
    if (id) {
      await apiFetch(`/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ todo: titulo, completed: completada }),
      });
      alert(`Tarea ID ${id} actualizada con éxito`);
    } else {
      await apiFetch('/todos', {
        method: 'POST',
        body: JSON.stringify({ todo: titulo, completed: completada, userId: 1 }),
      });
      alert('Tarea creada con éxito');
    }

    document.getElementById('form-tarea').reset();
    document.getElementById('tarea-id').value = '';
    obtenerTareas();
  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al procesar la solicitud');
  }
});

async function eliminarTarea(id) {
  if (!confirm(`¿Deseas eliminar la tarea ID ${id}?`)) return;

  try {
    await apiFetch(`/todos/${id}`, { method: 'DELETE' });
    alert(`Tarea ID ${id} eliminada con éxito`);
    obtenerTareas();
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudo eliminar la tarea');
  }
}

document.addEventListener('DOMContentLoaded', obtenerTareas);
