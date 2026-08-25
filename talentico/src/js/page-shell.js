const isDashboard = window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/');
const pagePrefix = isDashboard ? './pages/' : './';
const routes = {
  dashboard: isDashboard ? './index.html' : '../index.html',
  candidatos: `${pagePrefix}candidatos.html`,
  vacantes: `${pagePrefix}vacantes.html`,
  empresas: `${pagePrefix}Empresas.html`,
  postulaciones: `${pagePrefix}Postulaciones.html`,
  entrevistas: `${pagePrefix}entrevistas.html`,
  tareas: `${pagePrefix}tareas.html`,
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
      window.location.href = isDashboard ? './pages/login.html' : './login.html';
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
