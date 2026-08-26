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

function goToDashboard() {
  window.location.replace('./dashboard.html');
}

async function loginWithCredentials(username, password) {
  try {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });
    const data = await response.json();
    if (response.ok) {
      const token = data.accessToken || data.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          name: [data.firstName, data.lastName].filter(Boolean).join(' ') || data.username || username,
          username: data.username || username,
          email: data.email || '',
          provider: 'credentials',
        }));
        return;
      }
    }
  } catch (_) {}

  try {
    const res = await fetch(`http://localhost:3000/users?username=${encodeURIComponent(username)}`);
    const users = await res.json();
    if (users.length && users[0].password === password) {
      const u = users[0];
      const token = btoa(JSON.stringify({ id: u.id, username: u.username }));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username,
        username: u.username,
        email: u.email || '',
        provider: 'credentials',
      }));
      return;
    }
  } catch (_) {}

  throw new Error('Usuario o contraseña incorrectos.');
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = usernameInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    if (!username || !password) {
      showMessage('Completa el usuario y la contraseña.', 'error');
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'Iniciando sesión...';
    showMessage('');
    try {
      await loginWithCredentials(username, password);
      passwordInput.value = '';
      showMessage('Login exitoso. Redirigiendo...', 'success');
      window.setTimeout(goToDashboard, 400);
    } catch (error) {
      showMessage(error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.', 'error');
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'Iniciar sesión';
    }
  });
}

if (googleDemoButton) {
  googleDemoButton.addEventListener('click', async () => {
    googleDemoButton.disabled = true;
    showMessage('');
    try {
      const response = await fetch('/db.json');
      if (!response.ok) throw new Error('No fue posible cargar los datos de demostración.');
      const data = await response.json();
      const user = data.users?.find((item) => item.provider === 'google');
      if (!user?.token) throw new Error('No se encontró un usuario de Google de prueba.');

      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify({
        name: user.name,
        username: user.email,
        email: user.email,
        provider: 'google-demo',
      }));
      showMessage(`Sesión de demostración iniciada como ${user.name}.`, 'success');
      window.setTimeout(goToDashboard, 400);
    } catch (error) {
      showMessage(error.message || 'No fue posible iniciar la sesión de demostración.', 'error');
    } finally {
      googleDemoButton.disabled = false;
    }
  });
}
