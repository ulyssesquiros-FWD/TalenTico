import { apiFetch } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  // 1. Si no hay ID en la URL, redirigir al login
  if (!userId) {
    window.location.replace('login.html');
    return;
  }

  let currentUser = null;

  try {
    currentUser = await apiFetch(`/users/${userId}`);
  } catch (error) {
    // Corregido: se eliminó el '../' para permanecer en la carpeta 'pages'
    window.location.replace('login.html');
    return;
  }

  const userName = currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username;

  const displayNameElement = document.querySelector('#user-display-name');
  const heroTitleElement = document.querySelector('#hero-welcome-title');
  const logoutButton = document.querySelector('#btn-logout');

  if (displayNameElement) displayNameElement.textContent = `Hola, ${userName}`;
  if (heroTitleElement) heroTitleElement.textContent = `¡Bienvenido/a, ${userName}!`;

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      // Corregido: se eliminó el '../'
      window.location.replace('login.html');
    });
  }

  const vacantesContainer = document.querySelector('#vacantes-container');

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
      vacantesContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hay vacantes disponibles en este momento.</div>';
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
      `;
      vacantesContainer.appendChild(card);
    });
  }

  loadVacantes();
});