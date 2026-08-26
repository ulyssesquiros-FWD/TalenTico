import { apiFetch } from './api.js';

const loginForm = document.querySelector('#login-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const messageElement = document.querySelector('#login-message');
const loginButton = document.querySelector('#login-button');
const googleDemoButton = document.querySelector('#google-demo-button');

function showMessage(message, type = '') {
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.className = `message ${type}`.trim();
}

// Redirección condicionada por Rol
function goToPortal(user) {
  if (user.role === 'admin' || user.username === 'google.demo') {
    // Si es admin o demo, va al dashboard principal (index.html en la raíz)
    window.location.href = `../index.html?userId=${encodeURIComponent(user.id)}`;
  } else {
    // Si es candidato/usuario estándar, va a la vista de portal de empleos
    window.location.href = `user-view.html?userId=${encodeURIComponent(user.id)}`;
  }
}

async function loginWithCredentials(identifier, password) {
  // 1. Intentamos buscar por username
  let users = await apiFetch(`/users?username=${encodeURIComponent(identifier)}`);

  // 2. Si no encuentra coincidencias, intentamos buscar por email
  if (!Array.isArray(users) || users.length === 0) {
    users = await apiFetch(`/users?email=${encodeURIComponent(identifier)}`);
  }

  // 3. Validamos contraseña
  if (Array.isArray(users) && users.length > 0) {
    const user = users[0];
    if (user.password === password) {
      return user;
    }
  }

  throw new Error('Usuario o contraseña incorrectos.');
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener referencias e insumos actualizados al momento del submit
    const currentUsernameInput = document.querySelector('#username');
    const currentPasswordInput = document.querySelector('#password');

    const username = currentUsernameInput?.value.trim() || '';
    const password = currentPasswordInput?.value || '';

    if (!username || !password) {
      showMessage('Completa el usuario y la contraseña.', 'error');
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'Iniciando sesión...';
    showMessage('');

    try {
      const user = await loginWithCredentials(username, password);

      // Guardar token y usuario
      localStorage.setItem('token', user.token || 'demo-token-active'); 
      localStorage.setItem('user', JSON.stringify(user));

      showMessage('Login exitoso. Redirigiendo...', 'success');
      window.setTimeout(() => goToPortal(user), 400);
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'Iniciar sesión';
    }
  });
}

// 2. Modifica el evento del botón Demo:
if (googleDemoButton) {
  googleDemoButton.addEventListener('click', async () => {
    googleDemoButton.disabled = true;
    showMessage('');

    try {
      const users = await apiFetch('/users?provider=google');
      if (!Array.isArray(users) || !users.length) {
        throw new Error('No se encontró un usuario de demostración.');
      }

      const demoUser = users[0];

      // --- AGREGAR ESTAS DOS LÍNEAS ---
      localStorage.setItem('token', demoUser.token || 'demo-token-google');
      localStorage.setItem('user', JSON.stringify(demoUser));
      // --------------------------------

      showMessage(`Sesión iniciada como ${demoUser.name}.`, 'success');
      window.setTimeout(() => goToPortal(demoUser), 400);
    } catch (error) {
      showMessage(error.message || 'Error en la sesión de demostración.', 'error');
    } finally {
      googleDemoButton.disabled = false;
    }
  });
}