import { apiFetch } from './api.js';

const vacantesContainer = document.querySelector('#vacantes-container');
const form = document.querySelector('#public-postulacion-form');
const feedback = document.querySelector('#feedback-message');

const modal = document.querySelector('#apply-modal');
const closeModalBtn = document.querySelector('#btn-close-modal');
const cancelModalBtn = document.querySelector('#btn-cancel-modal');
const modalVacanteTitle = document.querySelector('#modal-vacante-title');

let vacantes = [];

function showFeedback(message, type = 'success') {
  feedback.textContent = message;
  feedback.style.background = type === 'success' ? 'var(--success-light, #d1fae5)' : 'var(--danger-light, #fee2e2)';
  feedback.style.color = type === 'success' ? 'var(--success, #10b981)' : 'var(--danger, #ef4444)';
  feedback.style.border = `1px solid ${type === 'success' ? 'var(--success, #10b981)' : 'var(--danger, #ef4444)'}`;
  feedback.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  window.setTimeout(() => {
    feedback.classList.add('hidden');
  }, 4500);
}

function openModal(vacante) {
  const tituloVacante = vacante?.titulo || vacante?.title || 'Vacante General';
  
  // Autocompleta los campos manteniendo compatibilidad con la API de postulaciones
  form.elements['post-title'].value = `Postulación a ${tituloVacante}`;
  form.elements['post-body'].value = '';
  form.elements['post-userId'].value = '';

  modalVacanteTitle.textContent = tituloVacante;
  modal.classList.remove('hidden');
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
  modal.classList.add('hidden');
  form.reset();
}

// Cargar vacantes activas desde la API o utilizar respaldo
async function loadVacantes() {
  try {
    const data = await apiFetch('/vacantes');
    vacantes = Array.isArray(data) ? data : [];
    renderVacantes();
  } catch (error) {
    vacantes = [
      { id: 1, titulo: 'Desarrollador Frontend Web', modalidad: 'Tiempo Completo', descripcion: 'Buscamos un desarrollador junior/mid con conocimientos en JavaScript, HTML, CSS y consumo de servicios REST.' },
      { id: 2, titulo: 'Especialista en Reclutamiento', modalidad: 'Híbrido', descripcion: 'Encargado de la gestión de candidatos, revisión de hojas de vida y coordinación de entrevistas.' },
      { id: 3, titulo: 'Analista de Soporte Técnico', modalidad: 'Presencial', descripcion: 'Atención a incidentes informáticos, configuración de redes locales y soporte a usuarios.' }
    ];
    renderVacantes();
  }
}

function renderVacantes() {
  vacantesContainer.innerHTML = '';

  if (!vacantes.length) {
    vacantesContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">
        No hay vacantes abiertas en este momento.
      </div>`;
    return;
  }

  vacantes.forEach((v, index) => {
    const card = document.createElement('article');
    card.className = 'vacante-card';
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="badge-tag">${v.modalidad || 'Disponible'}</span>
          <small style="color: var(--text-muted); font-size: 11px; font-weight: 600;">ID: #${v.id}</small>
        </div>
        
        <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; line-height: 1.3;">
          ${v.titulo || v.title || 'Puesto Requerido'}
        </h3>
        
        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 16px 0;">
          ${v.descripcion || v.body || 'Excelente oportunidad laboral para integrarse a nuestro equipo de trabajo.'}
        </p>
      </div>

      <button type="button" class="primary-button btn-apply-card" data-action="apply">
        <span>Postularse</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    `;

    card.querySelector('[data-action="apply"]').addEventListener('click', () => {
      openModal(v);
    });

    vacantesContainer.appendChild(card);
  });
}

// Envío de la postulación a la API (/posts)
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    title: form.elements['post-title'].value.trim(),
    body: form.elements['post-body'].value.trim(),
    userId: Number(form.elements['post-userId'].value),
    reactions: { likes: 0 }
  };

  try {
    await apiFetch('/posts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    closeModal();
    showFeedback('¡Postulación enviada exitosamente! Se ha registrado correctamente en el sistema.');
  } catch (error) {
    showFeedback(`Error al enviar la postulación: ${error.message}`, 'error');
  }
});

closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

loadVacantes();