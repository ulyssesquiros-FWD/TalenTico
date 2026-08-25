const loginForm = document.querySelector('#login-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const messageElement = document.querySelector('#login-message');
const loginButton = document.querySelector('#login-button');
const facebookLoginBtn = document.querySelector('#facebook-login-btn');
const facebookMessage = document.querySelector('#facebook-message');

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
}

function generateToken() {
  return 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function login(username, password) {
  const users = await apiFetch(`/users?username=${encodeURIComponent(username)}`);

  if (!users.length) {
    throw new Error('Usuario no encontrado.');
  }

  const user = users[0];

  if (user.password !== password) {
    throw new Error('Contraseña incorrecta.');
  }

  const token = generateToken();

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({
    id: user.id,
    username: user.username,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  }));

  return token;
}

function onFacebookLogin() {
  FB.login(
    function (response) {
      if (response.authResponse) {
        FB.api('/me', { fields: 'first_name,last_name,email' }, function (profile) {
          const token = response.authResponse.accessToken;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({
            id: profile.id,
            username: profile.email || profile.id,
            name: profile.first_name + ' ' + profile.last_name,
          }));
          showMessage(facebookMessage, 'Sesión iniciada con Facebook correctamente.', 'success');
        });
      } else {
        showMessage(facebookMessage, 'Se canceló el inicio de sesión con Facebook.', 'error');
      }
    },
    { scope: 'public_profile,email' }
  );
}

if (facebookLoginBtn) {
  facebookLoginBtn.addEventListener('click', onFacebookLogin);
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showMessage(messageElement, 'Completa el usuario y la contraseña.', 'error');
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = 'Iniciando sesión...';
  showMessage(messageElement, '', '');

  try {
    await login(username, password);
    showMessage(messageElement, 'Login exitoso.', 'success');
    passwordInput.value = '';
  } catch (error) {
    showMessage(messageElement, error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.', 'error');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Iniciar sesión';
  }
});
