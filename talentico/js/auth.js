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
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Usuario o contraseña incorrectos.');
    }

    localStorage.setItem('token', data.accessToken);
    showMessage('Login exitoso. El token fue guardado correctamente.', 'success');
    passwordInput.value = '';
  } catch (error) {
    showMessage(error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.', 'error');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Iniciar sesión';
  }
});
