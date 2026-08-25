import { apiFetch } from '../../js/api.js';
import { initializeProtectedPage } from './page-shell.js';

initializeProtectedPage();

const candidatesContainer = document.querySelector('#candidates-container');
const candidateForm = document.querySelector('#candidate-form');
const patchForm = document.querySelector('#patch-form');

// Elementos del Modal
const editModal = document.querySelector('#edit-modal');
const editForm = document.querySelector('#edit-candidate-form');
const btnCloseModal = document.querySelector('#btn-close-modal');
const btnDiscardModal = document.querySelector('#btn-discard-modal');

// Estructura en memoria para mantener los candidatos cargados
let candidatesCache = [];

// Generar HTML de la tarjeta
// Generar el HTML de una tarjeta individual
function renderCandidateCard(candidate) {
  const card = document.createElement('article');
  card.className = 'candidate-card';
  card.dataset.id = candidate.id;

  const modalidad = candidate.modalidad || 'REMOTE';
  const experienceText = candidate.experiencia || 'Sin experiencia registrada';
  const defaultAvatar = 'https://dummyjson.com/icon/emilyj/128';

  // Iconos SVG Limpios y Modernos
  const iconEdit = `
    <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>`;

  const iconDelete = `
    <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>`;

  card.innerHTML = `
    <header class="candidate-card-header">
        <div class="candidate-profile-info">
            <img class="candidate-avatar-img"
                src="${candidate.avatar || defaultAvatar}" 
                alt="${candidate.nombre || ''} ${candidate.apellido || ''}" />
            <div>
                <h3 class="candidate-name">${candidate.nombre || 'Sin nombre'}<br>${candidate.apellido || ''}</h3>
                <span class="candidate-role">${(candidate.puesto || 'Candidato').toUpperCase()}</span>
            </div>
        </div>
        <div class="candidate-actions">
            <button type="button" class="btn-icon btn-edit" title="Editar candidato">
              ${iconEdit}
            </button>
            <button type="button" class="btn-icon btn-delete danger" title="Eliminar candidato">
              ${iconDelete}
            </button>
        </div>
    </header>
    <div class="candidate-card-body">
        <p class="candidate-detail"><span class="icon">✉</span> <span class="candidate-email-text">${candidate.email || 'N/A'}</span></p>
        <p class="candidate-detail"><span class="icon">📈</span> <span class="candidate-exp-text">${experienceText}</span></p>
    </div>
    <footer class="candidate-card-footer">
        <span class="badge badge-success">ACTIVE</span>
        <span class="badge badge-info">${modalidad}</span>
    </footer>
  `;

  return card;
}

// Cargar Candidatos (GET)
async function loadCandidates() {
  if (!candidatesContainer) return;

  try {
    const candidates = await apiFetch('/candidatos');
    candidatesCache = Array.isArray(candidates) ? candidates : [];
    candidatesContainer.innerHTML = '';

    if (candidatesCache.length > 0) {
      candidatesCache.forEach(candidate => {
        candidatesContainer.appendChild(renderCandidateCard(candidate));
      });
    } else {
      candidatesContainer.innerHTML = '<p>No hay candidatos registrados.</p>';
    }
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    candidatesContainer.innerHTML = '<p style="color: var(--danger);">Error al cargar los candidatos.</p>';
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
    candidatesContainer.prepend(renderCandidateCard(createdCandidate));
    candidateForm.reset();
  } catch (error) {
    console.error('Error al registrar candidato:', error);
  }
}

// Eliminar Candidato (DELETE)
async function handleDeleteCandidate(id, cardElement) {
  const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar al candidato ID #${id}?`);
  if (!confirmDelete) return;

  try {
    await apiFetch(`/candidatos/${id}`, { method: 'DELETE' });

    cardElement.remove();
    candidatesCache = candidatesCache.filter(c => String(c.id) !== String(id));

    if (candidatesContainer.children.length === 0) {
      candidatesContainer.innerHTML = '<p>No hay candidatos registrados.</p>';
    }
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

  editModal.classList.add('open');
}

// Cerrar Modal
function closeEditModal() {
  editModal.classList.remove('open');
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
    const updatedCandidate = await apiFetch(`/candidatos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    // Actualizar visualmente la tarjeta en el DOM
    const oldCard = candidatesContainer.querySelector(`[data-id="${id}"]`);
    if (oldCard) {
      const newCard = renderCandidateCard(updatedCandidate);
      candidatesContainer.replaceChild(newCard, oldCard);
    }

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

    const cardToUpdate = candidatesContainer.querySelector(`[data-id="${id}"]`);
    if (cardToUpdate) {
      const emailText = cardToUpdate.querySelector('.candidate-email-text');
      if (emailText) emailText.innerText = patchedCandidate.email || newEmail;
    }

    alert(`Candidato #${id} actualizado con éxito.`);
    patchForm.reset();
  } catch (error) {
    console.error(`Error en PATCH para el candidato #${id}:`, error);
  }
}

// Delegation para Editar y Eliminar
if (candidatesContainer) {
  candidatesContainer.addEventListener('click', (event) => {
    const editBtn = event.target.closest('.btn-edit');
    const deleteBtn = event.target.closest('.btn-delete');
    const card = event.target.closest('.candidate-card');

    if (!card) return;
    const id = card.dataset.id;

    if (editBtn) {
      const candidate = candidatesCache.find(c => String(c.id) === String(id)) || {
        id,
        nombre: card.querySelector('.candidate-name').innerText.split('\n')[0] || '',
        apellido: card.querySelector('.candidate-name').innerText.split('\n')[1] || '',
        email: card.querySelector('.candidate-email-text').innerText || '',
        puesto: card.querySelector('.candidate-role').innerText || '',
        experiencia: card.querySelector('.candidate-exp-text').innerText || ''
      };
      openEditModal(candidate);
    } else if (deleteBtn) {
      handleDeleteCandidate(id, card);
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
