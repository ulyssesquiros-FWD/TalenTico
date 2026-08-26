const routes = {
  dashboard: './dashboard.html',
  candidatos: './candidatos.html',
  vacantes: './vacantes.html',
  empresas: './Empresas.html',
  postulaciones: './Postulaciones.html',
  entrevistas: './entrevistas.html',
  tareas: './tareas.html',
};

export function requireSession() {
  if (!localStorage.getItem('token')) {
    window.location.replace('./login.html');
    return false;
  }
  return true;
}

function setUserIdentity() {
  const nameElement = document.querySelector('.user-name');
  const avatarElement = document.querySelector('.avatar');
  let name = 'Usuario';

  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    name = user?.name || user?.username || name;
  } catch {
    // The fallback keeps the protected page usable if stored data is malformed.
  }

  if (nameElement) nameElement.textContent = name;
  if (avatarElement) avatarElement.textContent = name.charAt(0).toUpperCase();
}

function bindNavigation() {
  document.querySelectorAll('[data-section]').forEach((item) => {
    item.addEventListener('click', () => {
      const route = routes[item.dataset.section];
      if (route) window.location.href = route;
    });
  });

  document.querySelectorAll('.logout').forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '../index.html';
    });
  });

  const toggle = document.querySelector('#menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

export function initializeProtectedPage() {
  if (!requireSession()) return;
  setUserIdentity();
  bindNavigation();
}
