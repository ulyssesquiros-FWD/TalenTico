import './style.css'
import { initializeProtectedPage } from './js/page-shell.js'
import { apiFetch } from './js/api.js'

// ============================================================
// AUTENTICACIÓN
// ============================================================

const token = localStorage.getItem('token')

// Si no existe una sesión, enviar al login.
// El dashboard nunca se debe mostrar sin autenticación.
if (!token) {
  window.location.replace('./pages/login.html');
} else {
  // ============================================================
  // DASHBOARD
  // ============================================================

  const app = document.querySelector('#app')

  if (app) {
    app.innerHTML = `
      <div class="app-shell">

        <!-- SIDEBAR -->
        <aside class="sidebar" id="sidebar">

          <div class="brand">
            <img src="../logo-icono.png" alt="TalenTico" style="width: 46px; height: 46px; object-fit: contain; margin-right: 10px; border-radius: 10px;" />
            <div class="brand-info">
              <span class="brand-name">TALENTICO</span>
              <span class="brand-subtitle">Gestión de Talento</span>
            </div>
          </div>

          <nav class="sidebar-nav">

            <p class="nav-title">Menú</p>

            <button
              class="nav-item active"
              data-section="dashboard"
              type="button"
            >
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </span>
              <span>Inicio</span>
            </button>

            <button
              class="nav-item"
              data-section="candidatos"
              type="button"
            >
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <span>Candidatos</span>
            </button>

            <button
              class="nav-item"
              data-section="vacantes"
              type="button"
            >
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </span>
              <span>Vacantes</span>
            </button>

            <button
              class="nav-item"
              data-section="empresas"
              type="button"
            >
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
              </span>
              <span>Empresas</span>
            </button>

            <button
              class="nav-item"
              data-section="postulaciones"
              type="button"
            >
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              </span>
              <span>Postulaciones</span>
            </button>

            <button
              class="nav-item"
              data-section="entrevistas"
              type="button"
            >
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </span>
              <span>Entrevistas</span>
            </button>

            <button
              class="nav-item"
              data-section="tareas"
              type="button"
            >
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </span>
              <span>Tareas</span>
            </button>

          </nav>

          <div class="sidebar-footer">

            <button
              class="nav-item logout"
              type="button"
            >
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </span>
              <span>Cerrar sesión</span>
            </button>

          </div>

        </aside>


        <!-- CONTENIDO PRINCIPAL -->
        <main class="main-content">

          <!-- HEADER -->
          <header class="topbar">

            <button
              class="menu-toggle"
              id="menu-toggle"
              type="button"
              aria-label="Abrir menú"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>

            <div class="breadcrumb">
              <span>TalenTico</span>
              <span>/</span>
              <strong>Dashboard</strong>
            </div>

            <div class="user-area">

              <div class="user-info">
                <span class="user-name">Usuario</span>
                <span class="user-role">Administrador</span>
              </div>

              <div class="avatar">
                U
              </div>

            </div>

          </header>


          <!-- DASHBOARD -->
          <section class="content">

            <div class="page-header">

              <div>

                <span class="page-eyebrow">
                  PANEL PRINCIPAL
                </span>

                <h1>Bienvenido a TalenTico</h1>

                <p>
                  Gestiona candidatos, vacantes y procesos de
                  reclutamiento desde un solo lugar.
                </p>

              </div>

              <button
                class="primary-button"
                data-section="tareas"
                type="button"
              >
                + Nueva actividad
              </button>

            </div>


            <!-- ESTADÍSTICAS -->
            <div class="stats-grid">

              <article class="stat-card">

                <div class="stat-icon candidates">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>

                <div>

                  <span class="stat-label">
                    Candidatos
                  </span>

                  <strong class="stat-value">
                    --
                  </strong>

                  <span class="stat-description">
                    Registros disponibles
                  </span>

                </div>

              </article>


              <article class="stat-card">

                <div class="stat-icon vacancies">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>

                <div>

                  <span class="stat-label">
                    Vacantes
                  </span>

                  <strong class="stat-value">
                    --
                  </strong>

                  <span class="stat-description">
                    Oportunidades laborales
                  </span>

                </div>

              </article>


              <article class="stat-card">

                <div class="stat-icon companies">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                </div>

                <div>

                  <span class="stat-label">
                    Empresas
                  </span>

                  <strong class="stat-value">
                    --
                  </strong>

                  <span class="stat-description">
                    Empresas registradas
                  </span>

                </div>

              </article>


              <article class="stat-card">

                <div class="stat-icon applications">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                </div>

                <div>

                  <span class="stat-label">
                    Postulaciones
                  </span>

                  <strong class="stat-value">
                    --
                  </strong>

                  <span class="stat-description">
                    Procesos activos
                  </span>

                </div>

              </article>

            </div>


            <!-- ACTIVIDAD -->
            <div class="dashboard-grid">

              <section class="panel">

                <div class="panel-header">

                  <div>

                    <h2>Actividad reciente</h2>

                    <p>
                      Últimos movimientos del sistema
                    </p>

                  </div>

                  <button
                    class="text-button"
                    data-section="entrevistas"
                    type="button"
                  >
                    Ver todo
                  </button>

                </div>


                <div class="empty-state">

                  <div class="empty-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>

                  <h3>
                    Sin actividad todavía
                  </h3>

                  <p>
                    Las actividades aparecerán aquí
                    cuando se registren nuevos movimientos.
                  </p>

                </div>

              </section>


              <!-- ACCIONES RÁPIDAS -->
              <section class="panel quick-actions">

                <div class="panel-header">

                  <div>

                    <h2>Acciones rápidas</h2>

                    <p>
                      Accesos frecuentes
                    </p>

                  </div>

                </div>


                <div class="action-list">

                  <button
                    class="action-item"
                    data-section="candidatos"
                    type="button"
                  >

                    <span class="action-icon">
                      +
                    </span>

                    <span>

                      <strong>
                        Nuevo candidato
                      </strong>

                      <small>
                        Registrar candidato
                      </small>

                    </span>

                  </button>


                  <button
                    class="action-item"
                    data-section="vacantes"
                    type="button"
                  >

                    <span class="action-icon">
                      +
                    </span>

                    <span>

                      <strong>
                        Nueva vacante
                      </strong>

                      <small>
                        Publicar oportunidad
                      </small>

                    </span>

                  </button>


                  <button
                    class="action-item"
                    data-section="empresas"
                    type="button"
                  >

                    <span class="action-icon">
                      +
                    </span>

                    <span>

                      <strong>
                        Nueva empresa
                      </strong>

                      <small>
                        Registrar empresa
                      </small>

                    </span>

                  </button>

                </div>

              </section>

            </div>

          </section>

        </main>

      </div>
    `

    initializeProtectedPage()

    // ============================================================
    // CARGAR ESTADÍSTICAS DINÁMICAS Y ACTIVIDAD RECIENTE
    // ============================================================
    async function loadStats() {
      try {
        const [candidatos, vacantes, empresas, postulaciones] = await Promise.all([
          apiFetch('/candidatos'),
          apiFetch('/vacantes'),
          apiFetch('/carts'),
          apiFetch('/posts')
        ]);

        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 4) {
          statValues[0].textContent = Array.isArray(candidatos) ? candidatos.length : 0;
          statValues[1].textContent = Array.isArray(vacantes) ? vacantes.length : 0;
          statValues[2].textContent = Array.isArray(empresas) ? empresas.length : 0;
          statValues[3].textContent = Array.isArray(postulaciones) ? postulaciones.length : 0;
        }

        // Mostrar actividad reciente
        const activityContainer = document.querySelector('.panel .empty-state');
        if (activityContainer && Array.isArray(postulaciones) && postulaciones.length > 0) {
          const listContainer = document.createElement('div');
          listContainer.style.padding = '20px';
          listContainer.style.display = 'flex';
          listContainer.style.flexDirection = 'column';
          listContainer.style.gap = '12px';

          postulaciones.slice(0, 3).forEach(post => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '12px';
            item.style.background = 'var(--background)';
            item.style.borderRadius = 'var(--radius-sm)';
            item.style.border = '1px solid var(--border)';

            item.innerHTML = `
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px;">📝</span>
                <div>
                  <strong style="font-size: 13px; color: var(--text-primary);">${post.title}</strong>
                  <div style="font-size: 11px; color: var(--text-secondary);">ID Candidato: ${post.userId}</div>
                </div>
              </div>
              <span class="badge badge-success" style="font-size: 10px; background: var(--primary); color: var(--brand-green);">Nuevo</span>
            `;
            listContainer.appendChild(item);
          });

          const panel = activityContainer.closest('.panel');
          if (panel) {
            activityContainer.remove();
            panel.appendChild(listContainer);
          }
        }
      } catch (error) {
        console.warn('No se pudieron cargar las estadísticas dinámicas:', error);
      }
    }

    loadStats();

    // ============================================================
    // MENÚ RESPONSIVE
    // ============================================================

    const menuToggle =
      document.querySelector('#menu-toggle')

    const sidebar =
      document.querySelector('.sidebar')

    if (menuToggle && sidebar) {

      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open')
      })

    }


    // ============================================================
    // CERRAR SESIÓN
    // ============================================================

    const logoutButton =
      document.querySelector('.logout')

    if (logoutButton) {

      logoutButton.addEventListener('click', () => {

        // Eliminar información de sesión
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Regresar al login
        window.location.href = '../index.html'

      })

    }


    // ============================================================
    // MOSTRAR USUARIO LOGUEADO
    // ============================================================

    const userNameElement =
      document.querySelector('.user-name')

    const avatarElement =
      document.querySelector('.avatar')

    const storedUser =
      localStorage.getItem('user')

    if (storedUser) {

      try {

        const user = JSON.parse(storedUser)

        const name =
          user.name ||
          user.username ||
          'Usuario'

        if (userNameElement) {
          userNameElement.textContent = name
        }

        if (avatarElement) {
          avatarElement.textContent =
            name.charAt(0).toUpperCase()
        }

      } catch (error) {

        console.warn(
          'No fue posible leer los datos del usuario.',
          error
        )

      }

    }

  }

}