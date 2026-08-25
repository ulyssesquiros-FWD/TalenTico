import { apiFetch } from '../../js/api.js';

const loginForm = document.querySelector('#login-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const messageElement = document.querySelector('#login-message');
const loginButton = document.querySelector('#login-button');

function showMessage(message, type) {
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showMessage('Completa el usuario y la contraseña.', 'error');
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = 'Iniciando sesión...';
  showMessage('', '');

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      username: data.username,
      name: `${data.firstName} ${data.lastName}`,
    }));
    showMessage('Login exitoso. El token fue guardado correctamente.', 'success');
    passwordInput.value = '';
  } catch (error) {
    showMessage(error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.', 'error');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Iniciar sesión';
  }
});
