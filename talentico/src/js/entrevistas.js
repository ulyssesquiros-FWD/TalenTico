import { apiFetch } from '../../js/api.js';

async function obtenerEntrevistas() {
  try {
    const datos = await apiFetch('/comments');
    renderizarEntrevistas(datos);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('lista-entrevistas').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Error al cargar</h3>
        <p>${error.message}</p>
      </div>`;
  }
}

function renderizarEntrevistas(lista) {
  const contenedor = document.getElementById('lista-entrevistas');

  if (!lista.length) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💬</div>
        <h3>Sin notas</h3>
        <p>Registra tu primera nota usando el formulario de arriba.</p>
      </div>`;
    return;
  }

  let html = '<div style="padding: 4px 0;">';
  lista.forEach(item => {
    html += `
      <div style="padding: 14px 18px; border-bottom: 1px solid var(--border);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: var(--text-muted); font-size: 12px; font-weight: 700;">#${item.id}</span>
            <span class="badge badge-info">Post #${item.postId}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="text-button btn-editar" data-id="${item.id}" style="padding: 6px 10px; font-size: 11px;">Editar</button>
            <button class="text-button btn-eliminar" data-id="${item.id}" style="padding: 6px 10px; font-size: 11px; color: var(--danger);">Eliminar</button>
          </div>
        </div>
        <p id="texto-${item.id}" style="margin: 0; color: var(--text-secondary); font-size: 13px; line-height: 1.5;">${item.body}</p>
      </div>`;
  });
  html += '</div>';
  contenedor.innerHTML = html;

  document.querySelectorAll('.btn-editar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const texto = document.getElementById(`texto-${id}`).innerText;
      prepararEdicion(id, texto);
    });
  });

  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      eliminarEntrevista(id);
    });
  });
}

function prepararEdicion(id, body) {
  document.getElementById('entrevista-id').value = id;
  document.getElementById('entrevista-body').value = body;
  document.getElementById('entrevista-body').focus();
}

document.getElementById('form-entrevista').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('entrevista-id').value;
  const body = document.getElementById('entrevista-body').value;

  try {
    if (id) {
      await apiFetch(`/comments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ body }),
      });
      alert(`Nota ID ${id} actualizada con éxito`);
    } else {
      await apiFetch('/comments', {
        method: 'POST',
        body: JSON.stringify({ body, postId: 1, userId: 1 }),
      });
      alert('Nota creada con éxito');
    }

    document.getElementById('form-entrevista').reset();
    document.getElementById('entrevista-id').value = '';
    obtenerEntrevistas();
  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al procesar la solicitud');
  }
});

async function eliminarEntrevista(id) {
  if (!confirm(`¿Deseas eliminar la nota ID ${id}?`)) return;

  try {
    await apiFetch(`/comments/${id}`, { method: 'DELETE' });
    alert(`Nota ID ${id} eliminada con éxito`);
    obtenerEntrevistas();
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudo eliminar la nota');
  }
}

document.addEventListener('DOMContentLoaded', obtenerEntrevistas);
