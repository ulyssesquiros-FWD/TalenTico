import { apiFetch } from './api.js';
import { initializeProtectedPage } from './page-shell.js';

initializeProtectedPage();

const candidatesTbody = document.querySelector('#candidates-tbody');
const candidateForm = document.querySelector('#candidate-form');
const patchForm = document.querySelector('#patch-form');

// Elementos del Modal
const editModal = document.querySelector('#edit-modal');
const editForm = document.querySelector('#edit-candidate-form');
const btnCloseModal = document.querySelector('#btn-close-modal');
const btnDiscardModal = document.querySelector('#btn-discard-modal');

// Estructura en memoria para mantener los candidatos cargados
let candidatesCache = [];

// Generar el HTML de una fila de tabla para el candidato
function renderCandidateRow(candidate) {
  const row = document.createElement('tr');
  row.dataset.id = candidate.id;

  const modalidad = candidate.modalidad || 'REMOTE';
  const experienceText = candidate.experiencia || 'Sin experiencia registrada';
  const fullName = `${candidate.nombre || ''} ${candidate.apellido || ''}`.trim() || 'Sin nombre';

  row.innerHTML = `
    <td>${candidate.id}</td>
    <td><strong>${fullName}</strong></td>
    <td>${candidate.email || 'N/A'}</td>
    <td>${candidate.puesto || 'N/A'}</td>
    <td>${experienceText}</td>
    <td><span class="badge badge-info">${modalidad}</span></td>
    <td>
      <button type="button" data-action="edit">Editar</button>
      <button type="button" data-action="delete">Eliminar</button>
    </td>
  `;

  return row;
}

// Cargar Candidatos (GET)
async function loadCandidates() {
  if (!candidatesTbody) return;

  try {
    const candidates = await apiFetch('/candidatos');
    candidatesCache = Array.isArray(candidates) ? candidates : [];
    candidatesTbody.innerHTML = '';

    if (candidatesCache.length > 0) {
      candidatesCache.forEach(candidate => {
        candidatesTbody.appendChild(renderCandidateRow(candidate));
      });
    } else {
      candidatesTbody.innerHTML = '<tr><td colspan="7">No hay candidatos registrados.</td></tr>';
    }
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    candidatesTbody.innerHTML = '<tr><td colspan="7" style="color: var(--danger);">Error al cargar los candidatos.</td></tr>';
  }
}

// Crear Candidato (POST)
async function handleCreateCandidate(event) {
  event.preventDefault();

  const newCandidate = {
    nombre: document.querySelector('#nombre')?.value.trim() || '',
    apellido: document.querySelector('#apellido')?.value.trim() || '',
    email: document.querySelector('#email')?.value.trim() || '',
    puesto: document.querySelector('#puesto')?.value.trim() || '',
    experiencia: document.querySelector('#experiencia')?.value.trim() || '',
    modalidad: document.querySelector('#modalidad')?.value || 'REMOTE'
  };

  try {
    const createdCandidate = await apiFetch('/candidatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCandidate),
    });

    candidatesCache.unshift(createdCandidate);
    // Recargar tabla para reflejar la fila
    await loadCandidates();
    candidateForm.reset();
  } catch (error) {
    console.error('Error al registrar candidato:', error);
  }
}

// Eliminar Candidato (DELETE)
async function handleDeleteCandidate(id) {
  const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar al candidato ID #${id}?`);
  if (!confirmDelete) return;

  try {
    await apiFetch(`/candidatos/${id}`, { method: 'DELETE' });

    candidatesCache = candidatesCache.filter(c => String(c.id) !== String(id));
    await loadCandidates();
  } catch (error) {
    console.error(`Error al eliminar el candidato #${id}:`, error);
  }
}

// Abrir Modal de Edición
function openEditModal(candidate) {
  document.querySelector('#edit-id').value = candidate.id;
  document.querySelector('#edit-nombre').value = candidate.nombre || '';
  document.querySelector('#edit-apellido').value = candidate.apellido || '';
  document.querySelector('#edit-email').value = candidate.email || '';
  document.querySelector('#edit-puesto').value = candidate.puesto || '';
  document.querySelector('#edit-experiencia').value = candidate.experiencia || '';
  document.querySelector('#edit-modalidad').value = candidate.modalidad || 'REMOTE';

  editModal.classList.remove('hidden');
}

// Cerrar Modal
function closeEditModal() {
  editModal.classList.add('hidden');
  editForm.reset();
}

// Guardar Cambios del Modal (PUT)
async function handleUpdateCandidate(event) {
  event.preventDefault();

  const id = document.querySelector('#edit-id').value;
  const updatedData = {
    nombre: document.querySelector('#edit-nombre').value.trim(),
    apellido: document.querySelector('#edit-apellido').value.trim(),
    email: document.querySelector('#edit-email').value.trim(),
    puesto: document.querySelector('#edit-puesto').value.trim(),
    experiencia: document.querySelector('#edit-experiencia').value.trim(),
    modalidad: document.querySelector('#edit-modalidad').value
  };

  try {
    await apiFetch(`/candidatos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    // Actualizar cache local
    candidatesCache = candidatesCache.map(c => String(c.id) === String(id) ? { ...c, ...updatedData } : c);
    await loadCandidates();
    closeEditModal();
  } catch (error) {
    console.error(`Error al actualizar el candidato #${id}:`, error);
    alert('No se pudieron guardar los cambios.');
  }
}

// Actualización Rápida (PATCH)
async function handlePatchCandidate(event) {
  event.preventDefault();

  const id = document.querySelector('#patch-id')?.value;
  const newEmail = document.querySelector('#patch-email')?.value.trim();

  if (!id || !newEmail) return;

  try {
    const patchedCandidate = await apiFetch(`/candidatos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail })
    });

    // Actualizar cache local
    candidatesCache = candidatesCache.map(c => String(c.id) === String(id) ? { ...c, email: patchedCandidate.email || newEmail } : c);
    await loadCandidates();

    alert(`Candidato #${id} actualizado con éxito.`);
    patchForm.reset();
  } catch (error) {
    console.error(`Error en PATCH para el candidato #${id}:`, error);
  }
}

// Delegación para Editar y Eliminar
if (candidatesTbody) {
  candidatesTbody.addEventListener('click', (event) => {
    const row = event.target.closest('tr[data-id]');
    if (!row) return;
    const id = row.dataset.id;
    const action = event.target.dataset.action;

    if (action === 'edit') {
      const candidate = candidatesCache.find(c => String(c.id) === String(id)) || {
        id,
        nombre: '',
        apellido: '',
        email: '',
        puesto: '',
        experiencia: '',
        modalidad: 'REMOTE'
      };
      openEditModal(candidate);
    } else if (action === 'delete') {
      handleDeleteCandidate(id);
    }
  });
}

// Event Listeners Modal
if (btnCloseModal) btnCloseModal.addEventListener('click', closeEditModal);
if (btnDiscardModal) btnDiscardModal.addEventListener('click', closeEditModal);
if (editForm) editForm.addEventListener('submit', handleUpdateCandidate);

// Carga Inicial y Formularios Principales
document.addEventListener('DOMContentLoaded', loadCandidates);
if (candidateForm) candidateForm.addEventListener('submit', handleCreateCandidate);
if (patchForm) patchForm.addEventListener('submit', handlePatchCandidate);
