import { apiFetch } from '../../js/api.js';

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

  showMessage('Formulario validado. El envío de correo se habilitará al conectar la API de recuperación.', 'success');
});
