const API_URL = 'http://localhost:3000/vacantes';

// Estado global local
let localVacancies = [];

// Obtener estilos de badges según el estado
function getBadgeStyle(estado) {
  switch (estado) {
    case 'ACTIVA':
      return { class: 'badge-success', bg: '#14532d', color: '#ffffff' };
    case 'PENDIENTE':
      return { class: 'badge-warning', bg: '#f59e0b', color: '#ffffff' };
    case 'CERRADA':
    default:
      return { class: 'badge', bg: '#cbd5e1', color: '#475569' };
  }
}

// Renderizado de tarjeta con botones de acción SVG elegantes
function renderVacancyCard(vacancy) {
  const badgeStyle = getBadgeStyle(vacancy.estado);

  const card = document.createElement('article');
  card.className = 'vacancy-card';
  card.dataset.id = vacancy.id;

  // Ícono SVG de Edición (Lápiz)
  const iconEditSVG = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>`;

  // Ícono SVG de Eliminado (Basurero)
  const iconDeleteSVG = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>`;

  card.innerHTML = `
    <header class="vacancy-card-header">
      <div class="vacancy-icon-wrapper" style="background: ${vacancy.colorBg || '#e0f2fe'}; color: ${vacancy.colorText || '#0284c7'};">
        ${vacancy.icono || '💼'}
      </div>
      <div class="vacancy-actions">
        <span class="badge ${badgeStyle.class}" style="background: ${badgeStyle.bg}; color: ${badgeStyle.color};">
          ${vacancy.estado}
        </span>
        <button type="button" class="action-btn btn-edit" title="Editar vacante">
          ${iconEditSVG}
        </button>
        <button type="button" class="action-btn btn-delete" title="Eliminar vacante">
          ${iconDeleteSVG}
        </button>
      </div>
    </header>

    <div class="vacancy-card-body">
      <h3 class="vacancy-title">${vacancy.titulo}</h3>
      <p class="vacancy-company">🏢 ${vacancy.empresa}</p>
      <div class="vacancy-tags">
        <span class="badge badge-info">${vacancy.modalidad}</span>
        <span class="badge badge-success">${vacancy.tipo || 'Full-time'}</span>
      </div>
    </div>

    <footer class="vacancy-card-footer">
      <span class="vacancy-location">📍 ${vacancy.ubicacion}</span>
      <span class="vacancy-applicants"><strong>${vacancy.postulantes || 0}</strong> Postulantes</span>
    </footer>
  `;

  return card;
}

// GET: Obtener todas las vacantes de JSON Server
async function fetchVacancies() {
  const gridContainer = document.querySelector('.vacancies-cards-grid');
  if (!gridContainer) return;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al consultar la API');

    localVacancies = await res.json();
    gridContainer.innerHTML = '';

    if (localVacancies.length === 0) {
      gridContainer.innerHTML = '<p style="color: var(--text-muted, #64748b);">No hay vacantes registradas.</p>';
      return;
    }

    localVacancies.forEach(vacancy => {
      gridContainer.appendChild(renderVacancyCard(vacancy));
    });
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    gridContainer.innerHTML = '<p style="color: #ef4444;">No se pudo conectar con JSON Server. Verifique que esté en ejecución.</p>';
  }
}

// POST o PUT: Guardar vacante
async function saveVacancy(vacancyData, id = null) {
  try {
    const isEdit = Boolean(id);
    const url = isEdit ? `${API_URL}/${id}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    let colorBg = '#e0f2fe';
    let colorText = '#0284c7';
    if (vacancyData.estado === 'PENDIENTE') {
      colorBg = '#fef3c7';
      colorText = '#d97706';
    } else if (vacancyData.estado === 'CERRADA') {
      colorBg = '#f1f5f9';
      colorText = '#64748b';
    }

    const payload = {
      ...vacancyData,
      colorBg,
      colorText
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      closeDrawer();
      await fetchVacancies();
    } else {
      alert('Error al guardar la vacante');
    }
  } catch (error) {
    console.error('Error saving vacancy:', error);
  }
}

// DELETE: Eliminar vacante
async function deleteVacancy(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchVacancies();
    } else {
      alert('Error al eliminar la vacante');
    }
  } catch (error) {
    console.error('Error deleting vacancy:', error);
  }
}

// Manejo del Drawer Lateral con Animación
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerTitle = document.getElementById('drawer-title');
const formVacante = document.getElementById('form-vacante');

function openDrawer(vacancy = null) {
  if (!drawerOverlay) return;

  if (vacancy) {
    drawerTitle.textContent = 'Editar Vacante';
    document.getElementById('vacante-id').value = vacancy.id;
    document.getElementById('titulo-vacante').value = vacancy.titulo;
    document.getElementById('empresa-vacante').value = vacancy.empresa;
    document.getElementById('ubicacion-vacante').value = vacancy.ubicacion;
    document.getElementById('modalidad-vacante').value = vacancy.modalidad;
    document.getElementById('tipo-vacante').value = vacancy.tipo || 'Full-time';
    document.getElementById('estado-vacante').value = vacancy.estado || 'ACTIVA';
  } else {
    drawerTitle.textContent = 'Registrar Vacante';
    formVacante.reset();
    document.getElementById('vacante-id').value = '';
  }

  drawerOverlay.classList.add('active');
}

function closeDrawer() {
  if (drawerOverlay) {
    drawerOverlay.classList.remove('active');
    setTimeout(() => {
      formVacante.reset();
    }, 300); // Coincide con la duración de la animación CSS
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  fetchVacancies();

  // Abrir Drawer Crear
  const btnNueva = document.getElementById('btn-nueva-vacante');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => openDrawer());
  }

  // Cerrar Drawer por botones o clic fuera
  const btnClose = document.getElementById('btn-close-drawer');
  const btnCancel = document.getElementById('btn-cancel-drawer');
  if (btnClose) btnClose.addEventListener('click', closeDrawer);
  if (btnCancel) btnCancel.addEventListener('click', closeDrawer);

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) closeDrawer();
    });
  }

  // Submit del Formulario
  if (formVacante) {
    formVacante.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('vacante-id').value;
      const existing = localVacancies.find(v => String(v.id) === String(id));

      const vacancyData = {
        titulo: document.getElementById('titulo-vacante').value.trim(),
        empresa: document.getElementById('empresa-vacante').value.trim(),
        ubicacion: document.getElementById('ubicacion-vacante').value.trim(),
        modalidad: document.getElementById('modalidad-vacante').value,
        tipo: document.getElementById('tipo-vacante').value,
        estado: document.getElementById('estado-vacante').value,
        postulantes: existing ? existing.postulantes : 0,
        icono: existing ? existing.icono : '💼'
      };

      await saveVacancy(vacancyData, id || null);
    });
  }

  // Delegación de eventos Editar y Eliminar en las tarjetas
  const gridContainer = document.querySelector('.vacancies-cards-grid');
  if (gridContainer) {
    gridContainer.addEventListener('click', async (e) => {
      const card = e.target.closest('.vacancy-card');
      if (!card) return;

      const id = card.dataset.id;

      if (e.target.closest('.btn-edit')) {
        const vacancyToEdit = localVacancies.find(v => String(v.id) === String(id));
        if (vacancyToEdit) openDrawer(vacancyToEdit);
      }

      if (e.target.closest('.btn-delete')) {
        if (confirm(`¿Desea eliminar la vacante con ID ${id}?`)) {
          await deleteVacancy(id);
        }
      }
    });
  }
});