import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="app-shell">

    <!-- SIDEBAR -->
    <aside class="sidebar">

      <div class="brand">
        <div class="brand-icon">T</div>

        <div class="brand-info">
          <span class="brand-name">TalenTico</span>
          <span class="brand-subtitle">Gestión de Talento</span>
        </div>
      </div>

      <nav class="sidebar-nav">

        <p class="nav-title">MENÚ PRINCIPAL</p>

        <button class="nav-item active" data-section="dashboard">
          <span class="nav-icon">Ã¢Å’â€š</span>
          <span>Dashboard</span>
        </button>

        <button class="nav-item" data-section="candidatos">
          <span class="nav-icon">Ã¢â„¢â„¢</span>
          <span>Candidatos</span>
        </button>

        <button class="nav-item" data-section="vacantes">
          <span class="nav-icon">Ã¢â€“Â£</span>
          <span>Vacantes</span>
        </button>

        <button class="nav-item" data-section="empresas">
          <span class="nav-icon">Ã¢â€“Â¤</span>
          <span>Empresas</span>
        </button>

        <button class="nav-item" data-section="postulaciones">
          <span class="nav-icon">Ã¢â€“Â¡</span>
          <span>Postulaciones</span>
        </button>

        <button class="nav-item" data-section="entrevistas">
          <span class="nav-icon">Ã¢â€”Â·</span>
          <span>Entrevistas</span>
        </button>

        <button class="nav-item" data-section="tareas">
          <span class="nav-icon">Ã¢Å“â€œ</span>
          <span>Tareas</span>
        </button>

      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout">
          <span class="nav-icon">Ã¢â€ Âª</span>
          <span>Cerrar sesión</span>
        </button>
      </div>

    </aside>


    <!-- CONTENIDO PRINCIPAL -->
    <main class="main-content">

      <!-- HEADER -->
      <header class="topbar">

        <button class="menu-toggle" id="menu-toggle">
          Ã¢ËœÂ°
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

          <button class="primary-button">
            + Nueva actividad
          </button>

        </div>


        <!-- ESTADÃƒÂSTICAS -->
        <div class="stats-grid">

          <article class="stat-card">

            <div class="stat-icon candidates">
              Ã¢â„¢â„¢
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
              Ã¢â€“Â£
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
              Ã¢â€“Â¤
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
              Ã¢â€“Â¡
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

              <button class="text-button">
                Ver todo
              </button>

            </div>

            <div class="empty-state">

              <div class="empty-icon">
                Ã¢â€”Â·
              </div>

              <h3>Sin actividad todavía</h3>

              <p>
                Las actividades aparecerán aquí
                cuando se registren nuevos movimientos.
              </p>

            </div>

          </section>


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

              <button class="action-item">
                <span class="action-icon">+</span>
                <span>
                  <strong>Nuevo candidato</strong>
                  <small>Registrar candidato</small>
                </span>
              </button>

              <button class="action-item">
                <span class="action-icon">+</span>
                <span>
                  <strong>Nueva vacante</strong>
                  <small>Publicar oportunidad</small>
                </span>
              </button>

              <button class="action-item">
                <span class="action-icon">+</span>
                <span>
                  <strong>Nueva empresa</strong>
                  <small>Registrar empresa</small>
                </span>
              </button>

            </div>

          </section>

        </div>

      </section>

    </main>

  </div>
`

// Navegación visual temporal.
// Los mÃƒÂ³dulos reales serÃƒÂ¡n conectados durante la integraciÃƒÂ³n.

const navItems = document.querySelectorAll('.nav-item[data-section]')

navItems.forEach((item) => {
  item.addEventListener('click', () => {

    navItems.forEach((nav) => {
      nav.classList.remove('active')
    })

    item.classList.add('active')

    const section = item.dataset.section

    console.log(`Sección seleccionada: ${section}`)
  })
})

// Menú responsive

const menuToggle = document.querySelector('#menu-toggle')
const sidebar = document.querySelector('.sidebar')

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open')
})