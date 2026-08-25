const loginForm = document.querySelector('#login-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const messageElement = document.querySelector('#login-message');
const loginButton = document.querySelector('#login-button');
const googleDemoButton = document.querySelector('#google-demo-button');

function showMessage(message, type) {
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.className = `message ${type}`.trim();
}

function goToDashboard() {
  window.location.href = '../index.html';
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!username || !password) {
      showMessage('Completa el usuario y la contraseña.', 'error');
      return;
    }

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.textContent = 'Iniciando sesión...';
    }
    showMessage('', '');

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 60,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Usuario o contraseña incorrectos.'
        );
      }

      const token = data.accessToken || data.token;
      if (!token) {
        throw new Error('No se recibió un token válido del servidor.');
      }

      localStorage.setItem('token', token);

      const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
      const user = {
        name: fullName || data.username || username,
        username: data.username || username,
        email: data.email || '',
        provider: 'credentials',
      };

      localStorage.setItem('user', JSON.stringify(user));

      showMessage('Login exitoso. Redirigiendo...', 'success');

      if (passwordInput) {
        passwordInput.value = '';
      }

      setTimeout(() => {
        goToDashboard();
      }, 500);

    } catch (error) {
      showMessage(
        error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.',
        'error'
      );
    } finally {
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = 'Iniciar sesión';
      }
    }
  });
}

if (googleDemoButton) {
  googleDemoButton.addEventListener('click', async () => {
    googleDemoButton.disabled = true;
    showMessage('', '');

    try {
      let data = null;
      const pathsToTry = [
        new URL('../../db.json', import.meta.url).href,
        '/db.json',
        '../db.json',
      ];

      for (const path of pathsToTry) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch {
          // Continuar al siguiente path
        }
      }

      if (!data || !data.users) {
        throw new Error('No fue posible cargar los datos de demostración.');
      }

      const googleUser = data.users.find(
        (user) => user.provider === 'google'
      );

      if (!googleUser) {
        throw new Error('No se encontró un usuario de Google de prueba.');
      }

      const session = {
        token: googleUser.token,
        name: googleUser.name,
        email: googleUser.email,
        provider: 'google-demo',
      };

      localStorage.setItem('token', session.token);
      localStorage.setItem('user', JSON.stringify(session));

      showMessage(
        `Sesión de demostración iniciada como ${session.name}.`,
        'success'
      );

      setTimeout(() => {
        goToDashboard();
      }, 500);

    } catch (error) {
      showMessage(
        error.message || 'No fue posible iniciar la sesión de demostración.',
        'error'
      );
    } finally {
      if (googleDemoButton) {
        googleDemoButton.disabled = false;
      }
    }
  });
}
