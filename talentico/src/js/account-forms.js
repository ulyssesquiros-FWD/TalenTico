import { apiFetch } from './api.js';

const accountForm = document.querySelector('.account-form');

function showMessage(message, type) {
  const messageElement = accountForm.querySelector('.message');
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
}

accountForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!accountForm.checkValidity()) {
    accountForm.reportValidity();
    return;
  }

  if (accountForm.dataset.futureApi === 'register') {
    const firstName = accountForm.elements.firstName.value.trim();
    const lastName = accountForm.elements.lastName.value.trim();
    const email = accountForm.elements.email.value.trim();
    const username = accountForm.elements.username.value.trim();
    const password = accountForm.elements.password.value;
    const confirmation = accountForm.elements.confirmPassword.value;

    if (password !== confirmation) {
      showMessage('Las contraseñas no coinciden.', 'error');
      return;
    }

    try {
      const existingUsers = await apiFetch(`/users?username=${encodeURIComponent(username)}`);
      if (existingUsers.length) {
        showMessage('El usuario ya existe.', 'error');
        return;
      }

      const existingEmail = await apiFetch(`/users?email=${encodeURIComponent(email)}`);
      if (existingEmail.length) {
        showMessage('El correo ya está registrado.', 'error');
        return;
      }

      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
          gender: 'other',
          image: `https://dummyjson.com/icon/${username}/128`,
        }),
      });

      showMessage('Cuenta creada correctamente. Ya puedes iniciar sesión.', 'success');
      accountForm.reset();
    } catch (error) {
      showMessage(error.message || 'No fue posible crear la cuenta.', 'error');
    }
    return;
  }

  const emailStep = document.getElementById('email-step');
  const userInfo = document.getElementById('user-info');
  const passwordStep = document.getElementById('password-step');
  const confirmStep = document.getElementById('confirm-step');
  const submitBtn = document.getElementById('recovery-submit');

  if (emailStep && emailStep.style.display !== 'none') {
    const identifier = accountForm.elements.email.value.trim();
    if (!identifier) {
      showMessage('Ingresa tu correo electrónico o usuario.', 'error');
      return;
    }
    try {
      let users = await apiFetch(`/users?email=${encodeURIComponent(identifier)}`);
      if (!users.length) {
        users = await apiFetch(`/users?username=${encodeURIComponent(identifier)}`);
      }
      if (!users.length) {
        showMessage('No se encontró ninguna cuenta con ese correo o usuario.', 'error');
        return;
      }
      const user = users[0];
      document.getElementById('found-username').textContent = user.username || user.email;
      document.getElementById('found-name').textContent = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email;
      emailStep.style.display = 'none';
      userInfo.style.display = 'block';
      passwordStep.style.display = 'block';
      confirmStep.style.display = 'block';
      submitBtn.textContent = 'Cambiar contraseña';
      showMessage('', '');
    } catch (error) {
      showMessage(error.message || 'No fue posible buscar la cuenta.', 'error');
    }
    return;
  }

  const newPassword = accountForm.elements.newPassword.value;
  const confirmNew = accountForm.elements.confirmNewPassword.value;
  if (!newPassword || newPassword.length < 8) {
    showMessage('La contraseña debe tener al menos 8 caracteres.', 'error');
    return;
  }
  if (newPassword !== confirmNew) {
    showMessage('Las contraseñas no coinciden.', 'error');
    return;
  }
  try {
    const identifier = accountForm.elements.email.value.trim();
    let users = await apiFetch(`/users?email=${encodeURIComponent(identifier)}`);
    if (!users.length) {
      users = await apiFetch(`/users?username=${encodeURIComponent(identifier)}`);
    }
    if (!users.length) {
      showMessage('No se encontró la cuenta.', 'error');
      return;
    }
    await apiFetch(`/users/${users[0].id}`, {
      method: 'PATCH',
      body: JSON.stringify({ password: newPassword }),
    });
    showMessage('Contraseña actualizada correctamente. Ya puedes iniciar sesión.', 'success');
    accountForm.reset();
    emailStep.style.display = 'block';
    userInfo.style.display = 'none';
    passwordStep.style.display = 'none';
    confirmStep.style.display = 'none';
    submitBtn.textContent = 'Enviar instrucciones';
  } catch (error) {
    showMessage(error.message || 'No fue posible cambiar la contraseña.', 'error');
  }
});
