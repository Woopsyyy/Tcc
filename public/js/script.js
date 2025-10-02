const form = document.getElementById('loginForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const error = document.getElementById('error');

form.addEventListener('submit', async e => {
  e.preventDefault();
  error.style.display = 'none';
  const validUsername = username.value && username.value.trim().length > 0;
  const validPass = password.value && password.value.trim().length > 0;
  if (!validUsername || !validPass) {
    error.style.display = 'block';
    error.textContent = 'Please enter a username and password.';
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username.value, password: password.value })
    });
    const data = await response.json();
    if (response.ok) {
      window.location.href = '/dashboard.html';
    } else {
      error.style.display = 'block';
      error.textContent = data.error || 'Login failed';
    }
  } catch (err) {
    error.style.display = 'block';
    error.textContent = 'Network error';
  }
});
