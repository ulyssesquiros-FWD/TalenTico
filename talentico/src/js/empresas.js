import { apiFetch } from './api.js';
import { initializeProtectedPage } from './page-shell.js';

initializeProtectedPage();

const form = document.querySelector('#empresa-form');
const tbody = document.querySelector('#empresas-tbody');
const feedback = document.querySelector('#feedback-message');
const formTitle = document.querySelector('#form-title');
const cancelButton = document.querySelector('#btn-cancel');
const modal = document.querySelector('#delete-modal');
const modalCancel = document.querySelector('#btn-modal-cancel');
const modalConfirm = document.querySelector('#btn-modal-confirm');
let companies = [];
let companyToDelete = null;

function showFeedback(message, type = 'success') {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
  feedback.classList.remove('hidden');
  window.setTimeout(() => feedback.classList.add('hidden'), 4000);
}

function resetForm() {
  form.reset();
  form.elements['empresa-id'].value = '';
  formTitle.textContent = 'Agregar Nueva Empresa';
  cancelButton.classList.add('hidden');
}

function render() {
  tbody.innerHTML = '';
  if (!companies.length) {
    tbody.innerHTML = '<tr><td colspan="5">No hay empresas registradas.</td></tr>';
    return;
  }
  companies.forEach((company) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${company.id}</td>
      <td>${company.userId}</td>
      <td>${company.totalProducts}</td>
      <td>$${company.total || 0}</td>
      <td>
        <button type="button" data-action="edit">Editar</button>
        <button type="button" data-action="delete">Eliminar</button>
      </td>`;
    row.dataset.id = company.id;
    tbody.appendChild(row);
  });
}

async function loadCompanies() {
  try {
    const data = await apiFetch('/carts');
    companies = Array.isArray(data) ? data : [];
    render();
  } catch (error) {
    showFeedback(`Error al cargar empresas: ${error.message}`, 'error');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = form.elements['empresa-id'].value;
  const userId = Number(form.elements['company-userId'].value);
  const totalProducts = Number(form.elements['total-products'].value);
  const payload = { userId, totalProducts, total: totalProducts * 100 };
  try {
    const endpoint = id ? `/carts/${id}` : '/carts';
    const method = id ? 'PUT' : 'POST';
    const result = await apiFetch(endpoint, { method, body: JSON.stringify(payload) });
    const company = { ...result, userId, totalProducts, total: result.total || totalProducts * 100 };
    companies = id ? companies.map((item) => String(item.id) === String(id) ? company : item) : [company, ...companies];
    render();
    resetForm();
    showFeedback(id ? 'Empresa actualizada con éxito.' : 'Empresa creada con éxito.');
  } catch (error) {
    showFeedback(`Error al guardar empresa: ${error.message}`, 'error');
  }
});

tbody.addEventListener('click', (event) => {
  const row = event.target.closest('tr[data-id]');
  if (!row) return;
  const company = companies.find((item) => String(item.id) === row.dataset.id);
  if (event.target.dataset.action === 'edit' && company) {
    form.elements['empresa-id'].value = company.id;
    form.elements['company-userId'].value = company.userId;
    form.elements['total-products'].value = company.totalProducts;
    formTitle.textContent = 'Editar Empresa';
    cancelButton.classList.remove('hidden');
  }
  if (event.target.dataset.action === 'delete') {
    companyToDelete = row.dataset.id;
    modal.classList.remove('hidden');
  }
});

cancelButton.addEventListener('click', resetForm);
modalCancel.addEventListener('click', () => modal.classList.add('hidden'));
modalConfirm.addEventListener('click', async () => {
  try {
    await apiFetch(`/carts/${companyToDelete}`, { method: 'DELETE' });
    companies = companies.filter((item) => String(item.id) !== String(companyToDelete));
    render();
    showFeedback('Empresa de baja correctamente.');
  } catch (error) {
    showFeedback(`Error al eliminar empresa: ${error.message}`, 'error');
  } finally {
    modal.classList.add('hidden');
    companyToDelete = null;
  }
});

loadCompanies();
