import { apiFetch } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  // Si no hay userId en la URL, se exige login
  if (!userId) {
    window.location.replace('login.html');
    return;
  }

  let currentUser = null;

  try {
    currentUser = await apiFetch(`/users/${userId}`);
  } catch (error) {
    window.location.replace('login.html');
    return;
  }

  // Nombre formateado para la bienvenida
  const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || currentUser.username;

  const displayNameElement = document.querySelector('#user-display-name');
  const heroTitleElement = document.querySelector('#hero-welcome-title');
  const logoutButton = document.querySelector('#btn-logout');

  if (displayNameElement) displayNameElement.textContent = `Hola, ${fullName}`;
  if (heroTitleElement) heroTitleElement.textContent = `¡Bienvenido/a, ${fullName}!`;

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      window.location.replace('login.html');
    });
  }

  // --- REFERENCIAS AL MODAL ---
  const modal = document.querySelector('#modal-postulacion');
  const modalTitulo = document.querySelector('#modal-vacante-titulo');
  const inputVacanteId = document.querySelector('#postula-vacante-id');
  
  // Referencias a los campos idénticos a postulaciones.html
  const inputTitle = document.querySelector('#post-title');
  const inputCandidato = document.querySelector('#post-candidato');
  const inputEmail = document.querySelector('#post-email');
  const inputTelefono = document.querySelector('#post-telefono');
  const inputLinkCv = document.querySelector('#post-linkCv');
  const inputBody = document.querySelector('#post-body');

  const formPostulacion = document.querySelector('#form-postulacion');
  const btnCancelar = document.querySelector('#btn-cancelar-modal');
  const vacantesContainer = document.querySelector('#vacantes-container');

  function openModal(tituloVacante, vacanteId) {
    if (!modal) return;
    
    // Autocompletado inicial de datos (pueden ser modificados libremente por el usuario)
    if (modalTitulo) modalTitulo.textContent = tituloVacante;
    if (inputVacanteId) inputVacanteId.value = vacanteId;
    if (inputTitle) inputTitle.value = `Postulación a ${tituloVacante}`;
    if (inputCandidato) inputCandidato.value = fullName;
    if (inputEmail) inputEmail.value = currentUser.email || '';

    modal.style.setProperty('display', 'flex', 'important');
  }

  function closeModal() {
    if (!modal) return;
    modal.style.setProperty('display', 'none', 'important');
    if (inputTelefono) inputTelefono.value = '';
    if (inputLinkCv) inputLinkCv.value = '';
    if (inputBody) inputBody.value = '';
  }

  async function loadVacantes() {
    try {
      const vacantes = await apiFetch('/vacantes');
      renderVacantes(vacantes);
    } catch (error) {
      if (vacantesContainer) {
        vacantesContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--danger);">Error al cargar vacantes.</div>`;
      }
    }
  }

  function renderVacantes(vacantes) {
    if (!vacantesContainer) return;
    vacantesContainer.innerHTML = '';

    if (!Array.isArray(vacantes) || !vacantes.length) {
      vacantesContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hay vacantes disponibles.</div>';
      return;
    }

    vacantes.forEach((v) => {
      const card = document.createElement('article');
      card.className = 'vacante-card';
      card.innerHTML = `
        <div>
          <h3 style="margin-top:0;">${v.titulo || 'Puesto Requerido'}</h3>
          <p style="margin: 4px 0;"><strong>Empresa:</strong> ${v.empresa || 'N/A'}</p>
          <p style="margin: 4px 0;"><strong>Ubicación:</strong> ${v.ubicacion || 'N/A'}</p>
          <p style="margin: 4px 0;"><strong>Modalidad:</strong> ${v.modalidad || 'N/A'}</p>
        </div>
        <button 
          class="btn-postular primary-button" 
          type="button"
          style="margin-top: 12px; padding: 8px 16px; cursor: pointer;"
        >
          Postularme
        </button>
      `;

      const btnPostular = card.querySelector('.btn-postular');
      btnPostular.addEventListener('click', () => {
        openModal(v.titulo, v.id);
      });

      vacantesContainer.appendChild(card);
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Guardar postulación directo en /posts (JSON Server)
  if (formPostulacion) {
    formPostulacion.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nuevaPostulacion = {
        title: inputTitle.value,
        candidatoNombre: inputCandidato.value,
        candidatoEmail: inputEmail.value,
        candidatoTelefono: inputTelefono.value.trim(),
        linkCv: inputLinkCv.value.trim(),
        body: inputBody.value.trim(),
        userId: currentUser.id,
        vacanteId: inputVacanteId.value
      };

      try {
        await apiFetch('/posts', {
          method: 'POST',
          body: JSON.stringify(nuevaPostulacion)
        });

        alert('¡Postulación enviada con éxito!');
        closeModal();
      } catch (err) {
        alert('Ocurrió un error al guardar la postulación.');
      }
    });
  }

  loadVacantes();
});