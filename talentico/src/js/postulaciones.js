import { apiFetch } from './api.js';
import { initializeProtectedPage } from './page-shell.js';

initializeProtectedPage();

const form = document.querySelector('#postulacion-form');
const tbody = document.querySelector('#postulaciones-tbody');
const feedback = document.querySelector('#feedback-message');
const formTitle = document.querySelector('#form-title');
const cancelButton = document.querySelector('#btn-cancel');
const modal = document.querySelector('#delete-modal');
const modalCancel = document.querySelector('#btn-modal-cancel');
const modalConfirm = document.querySelector('#btn-modal-confirm');

let applications = [];
let applicationToDelete = null;

function showFeedback(message, type = 'success') {
  feedback.textContent = message;
  feedback.style.background = type === 'success' ? 'var(--success-light, #d1fae5)' : 'var(--danger-light, #fee2e2)';
  feedback.style.color = type === 'success' ? 'var(--success, #10b981)' : 'var(--danger, #ef4444)';
  feedback.style.border = `1px solid ${type === 'success' ? 'var(--success, #10b981)' : 'var(--danger, #ef4444)'}`;
  feedback.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  window.setTimeout(() => {
    feedback.classList.add('hidden');
  }, 4000);
}

function resetForm() {
  form.reset();
  form.elements['postulacion-id'].value = '';
  formTitle.textContent = 'Registrar Nueva Postulación';
  cancelButton.classList.add('hidden');
}

function render() {
  tbody.innerHTML = '';
  if (!applications.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No hay postulaciones registradas.</td></tr>';
    return;
  }

  applications.forEach((app) => {
    const row = document.createElement('tr');
    row.dataset.id = app.id;

    const candidatoNombre = app.candidatoNombre || app.nombre || `Candidato #${app.userId || app.id}`;
    const candidatoEmail = app.candidatoEmail || 'No especificado';
    const candidatoTelefono = app.candidatoTelefono || 'N/A';
    const linkCv = app.linkCv || '#';

    row.innerHTML = `
      <td><strong>#${app.id}</strong></td>
      <td>
        <div style="font-weight: 700; color: var(--text-primary);">${candidatoNombre}</div>
      </td>
      <td><strong>${app.title || 'Sin Título'}</strong></td>
      <td style="font-size: 12px;">
        <div>${candidatoEmail}</div>
        <div style="color: var(--text-muted);">${candidatoTelefono}</div>
      </td>
      <td>
        ${linkCv !== '#' 
          ? `<a href="${linkCv}" target="_blank" style="color: var(--brand-green); font-weight: 700; text-decoration: underline;">Ver CV / Perfil</a>` 
          : '<span style="color: var(--text-muted);">Sin enlace</span>'}
      </td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button type="button" class="secondary-button" style="padding: 4px 8px; font-size: 12px;" data-action="edit">Editar</button>
          <button type="button" class="secondary-button" style="padding: 4px 8px; font-size: 12px; border-color: var(--danger); color: var(--danger);" data-action="delete">Eliminar</button>
        </div>
      </td>`;

    tbody.appendChild(row);
  });
}

async function loadApplications() {
  try {
    const data = await apiFetch('/posts');
    applications = Array.isArray(data) ? data : [];
    render();
  } catch (error) {
    showFeedback(`Error al cargar postulaciones: ${error.message}`, 'error');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = form.elements['postulacion-id'].value;

  const payload = {
    title: form.elements['post-title'].value.trim(),
    candidatoNombre: form.elements['post-candidato'].value.trim(),
    candidatoEmail: form.elements['post-email'].value.trim(),
    candidatoTelefono: form.elements['post-telefono'].value.trim(),
    linkCv: form.elements['post-linkCv'].value.trim(),
    body: form.elements['post-body'].value.trim()
  };

  try {
    const endpoint = id ? `/posts/${id}` : '/posts';
    const method = id ? 'PATCH' : 'POST';
    
    const result = await apiFetch(endpoint, {
      method: method,
      body: JSON.stringify(payload)
    });

    const application = { ...result, ...payload };
    applications = id 
      ? applications.map((item) => String(item.id) === String(id) ? application : item) 
      : [application, ...applications];

    render();
    resetForm();
    showFeedback(id ? 'Postulación actualizada con éxito.' : 'Postulación creada con éxito.');
  } catch (error) {
    showFeedback(`Error al guardar postulación: ${error.message}`, 'error');
  }
});

tbody.addEventListener('click', (event) => {
  const row = event.target.closest('tr[data-id]');
  if (!row) return;

  const application = applications.find((item) => String(item.id) === row.dataset.id);
  const action = event.target.dataset.action;

  if (action === 'edit' && application) {
    form.elements['postulacion-id'].value = application.id;
    form.elements['post-title'].value = application.title || '';
    form.elements['post-candidato'].value = application.candidatoNombre || '';
    form.elements['post-email'].value = application.candidatoEmail || '';
    form.elements['post-telefono'].value = application.candidatoTelefono || '';
    form.elements['post-linkCv'].value = application.linkCv || '';
    form.elements['post-body'].value = application.body || '';

    formTitle.textContent = 'Editar Postulación';
    cancelButton.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (action === 'delete') {
    applicationToDelete = row.dataset.id;
    modal.classList.remove('hidden');
  }
});

cancelButton.addEventListener('click', resetForm);
modalCancel.addEventListener('click', () => modal.classList.add('hidden'));

modalConfirm.addEventListener('click', async () => {
  try {
    await apiFetch(`/posts/${applicationToDelete}`, { method: 'DELETE' });
    applications = applications.filter((item) => String(item.id) !== String(applicationToDelete));
    render();
    showFeedback('Postulación eliminada correctamente.');
  } catch (error) {
    showFeedback(`Error al eliminar postulación: ${error.message}`, 'error');
  } finally {
    modal.classList.add('hidden');
    applicationToDelete = null;
  }
});

loadApplications();