// src/auth/telegram.js

const params = new URLSearchParams(window.location.search);
const tgData = Object.fromEntries(params.entries());

if (tgData.id) {
  localStorage.setItem('telegram_user', JSON.stringify(tgData));
  window.location.href = '/'; // redirect to homepage
} else {
  document.body.innerHTML = '<p>Invalid login. Please try again.</p>';
}