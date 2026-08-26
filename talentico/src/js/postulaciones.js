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
  feedback.className = `feedback ${type}`;
  feedback.classList.remove('hidden');
  window.setTimeout(() => feedback.classList.add('hidden'), 4000);
}

function resetForm() {
  form.reset();
  form.elements['postulacion-id'].value = '';
  form.elements['post-userId'].disabled = false;
  formTitle.textContent = 'Registrar Nueva Postulación';
  cancelButton.classList.add('hidden');
}

function render() {
  tbody.innerHTML = '';
  if (!applications.length) {
    tbody.innerHTML = '<tr><td colspan="5">No hay postulaciones registradas.</td></tr>';
    return;
  }
  applications.forEach((application) => {
    const row = document.createElement('tr');
    row.dataset.id = application.id;
    row.innerHTML = `
      <td>${application.id}</td><td>${application.userId}</td><td><strong>${application.title}</strong></td>
      <td>${application.reactions?.likes || 0} Likes</td>
      <td>
        <button type="button" data-action="edit">Editar título</button>
        <button type="button" data-action="delete">Eliminar</button>
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
    body: form.elements['post-body'].value.trim(),
    userId: Number(form.elements['post-userId'].value),
  };
  try {
    const endpoint = id ? `/posts/${id}` : '/posts';
    const method = id ? 'PATCH' : 'POST';
    const result = await apiFetch(endpoint, {
      method: method,
      body: JSON.stringify(id ? { title: payload.title, body: payload.body } : payload),
    });
    const application = { ...result, ...payload, reactions: result.reactions || { likes: 0 } };
    applications = id ? applications.map((item) => String(item.id) === String(id) ? application : item) : [application, ...applications];
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
  if (event.target.dataset.action === 'edit' && application) {
    form.elements['postulacion-id'].value = application.id;
    form.elements['post-title'].value = application.title;
    form.elements['post-body'].value = application.body;
    form.elements['post-userId'].value = application.userId;
    form.elements['post-userId'].disabled = true;
    formTitle.textContent = 'Editar Postulación';
    cancelButton.classList.remove('hidden');
  }
  if (event.target.dataset.action === 'delete') {
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
