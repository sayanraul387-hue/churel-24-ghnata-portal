
import { createClient } from '@supabase/supabase-js';
import './style.css';

// ==========================================
// 1. CONFIGURATION
// ==========================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const BASE_URL = import.meta.env.BASE_URL || '/';
const app = document.getElementById('app');

function appPath(file = '') {
  const base = BASE_URL.endsWith('/')
    ? BASE_URL
    : `${BASE_URL}/`;

  return `${base}${file.replace(/^\/+/, '')}`;
}

if (!app) {
  throw new Error('App element #app was not found.');
}

if (!supabaseUrl || !supabaseKey) {
  app.innerHTML = `
    <div style="color:white;text-align:center;padding:40px">
      <h2>Supabase Configuration Missing</h2>
      <p>Please check your .env file.</p>
    </div>
  `;
  throw new Error('Supabase configuration missing.');
}

// ==========================================
// 2. SUPABASE CLIENT
// ==========================================

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

let mode = 'login';
let isSubmitting = false;
let isRouting = false;

// ==========================================
// 3. LOGIN PAGE HTML + CSS
// ==========================================

app.innerHTML = `
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

[hidden] {
  display: none !important;
}

body {
  font-family: Inter, Arial, sans-serif;
  min-height: 100vh;
  color: #fff;
  background:
    radial-gradient(circle at 10% 15%, #1d3c70 0, transparent 35%),
    radial-gradient(circle at 90% 90%, #42236b 0, transparent 35%),
    linear-gradient(135deg, #080d1b, #111a30 55%, #090e1c);
}

#app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px 15px;
}

.login-wrapper {
  width: 100%;
  max-width: 440px;
  animation: appear .7s ease;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  width: 100%;
  padding: 35px 30px;
  text-align: center;
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 25px;
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  box-shadow: 0 25px 80px rgba(0,0,0,.4);
}

.logo-frame {
  width: 145px;
  height: 145px;
  padding: 5px;
  margin: 0 auto 22px;
  border-radius: 50%;
  background: linear-gradient(135deg,#54caff,#8054ff,#e879f9);
  box-shadow: 0 0 35px rgba(115,110,255,.4);
  animation: logoGlow 3s ease-in-out infinite alternate;
}

@keyframes logoGlow {
  from {
    box-shadow: 0 0 18px rgba(84,202,255,.3);
  }
  to {
    box-shadow: 0 0 40px rgba(180,100,255,.65);
  }
}

.logo-inner {
  width: 100%;
  height: 100%;
  border: 4px solid #111a30;
  border-radius: 50%;
  overflow: hidden;
  background: #182440;
}

.logo-inner img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  color: #b9d9ff;
  font-size: 12px;
}

.logo-placeholder span {
  font-size: 34px;
}

.brand-title {
  font-size: 21px;
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: 1px;
  background: linear-gradient(90deg,#fff,#9ddcff,#d8b4fe);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.brand-subtitle {
  color: #aab7d3;
  font-size: 11px;
  letter-spacing: 2px;
  margin-top: 8px;
  margin-bottom: 28px;
}

.login-heading {
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: 800;
}

.description {
  color: #aab5cc;
  font-size: 13px;
  margin-bottom: 25px;
}

.input-group {
  text-align: left;
  margin-bottom: 17px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 9px;
  color: #dce5fa;
}

.input-box {
  position: relative;
}

.input-box input {
  width: 100%;
  height: 51px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.16);
  outline: none;
  background: rgba(7,13,30,.7);
  color: white;
  font-size: 14px;
  font-family: inherit;
}

.input-box input:focus {
  border-color: #69baff;
  box-shadow: 0 0 0 3px rgba(76,157,255,.13);
}

.input-box input::placeholder {
  color: #7785a4;
}

.password-input {
  padding-right: 65px !important;
}

.show-password {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8fcaff;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.primary-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  margin-top: 8px;
  background: linear-gradient(100deg,#347cff,#8054f6);
  color: white;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: .25s;
  box-shadow: 0 10px 25px rgba(75,105,255,.25);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(75,105,255,.4);
}

.primary-btn:disabled {
  opacity: .6;
  cursor: wait;
  transform: none;
}

.switch-btn {
  margin-top: 18px;
  padding: 10px 15px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 9px;
  color: #b9dfff;
  font-size: 12px;
  cursor: pointer;
}

.switch-btn:hover {
  background: rgba(255,255,255,.12);
}

#notice {
  min-height: 22px;
  margin-top: 14px;
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.footer {
  text-align: center;
  color: #8997b5;
  font-size: 11px;
  line-height: 1.8;
  margin-top: 20px;
}

@media(max-width:480px) {
  #app {
    padding: 16px;
  }

  .login-card {
    padding: 28px 20px;
  }

  .logo-frame {
    width: 125px;
    height: 125px;
  }

  .brand-title {
    font-size: 18px;
  }
}
</style>

<div class="login-wrapper">
  <section class="login-card">

    <div class="logo-frame">
      <div class="logo-inner">

        <div class="logo-placeholder" id="logo-placeholder">
          <span>✦</span>
          <strong>CHUREL</strong>
        </div>

        <img
          id="logo-image"
          src="${new URL('../logo.png', import.meta.url).href}"
          alt="CHUREL Logo"
          hidden
        >

      </div>
    </div>

    <h1 class="brand-title">
      CHUREL 24 GHNATA PORTAL
    </h1>

    <p class="brand-subtitle">
      OFFICIAL MEMBER PORTAL
    </p>

    <h2 class="login-heading" id="form-title">
      Welcome Back
    </h2>

    <p class="description" id="form-description">
      Login to access your member account
    </p>

    <form id="auth-form" novalidate>

      <div class="input-group" id="name-group" hidden>
        <label for="full-name">Full Name</label>
        <div class="input-box">
          <input
            id="full-name"
            type="text"
            placeholder="Enter your full name"
            autocomplete="name"
          >
        </div>
      </div>

      <div class="input-group">
        <label for="phone">Phone Number</label>
        <div class="input-box">
          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            autocomplete="tel"
            inputmode="numeric"
            required
          >
        </div>
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <div class="input-box">
          <input
            id="password"
            class="password-input"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            required
          >

          <button
            type="button"
            class="show-password"
            id="toggle-password"
          >
            SHOW
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="primary-btn"
        id="submit-btn"
      >
        LOGIN TO ACCOUNT
      </button>

    </form>

    <p id="notice" role="status" aria-live="polite"></p>

    <button
      type="button"
      class="switch-btn"
      id="switch-mode"
    >
      Create New Account
    </button>

  </section>

  <footer class="footer">
    © 2026 CHUREL 24 GHNATA PORTAL<br>
    Secure Member Access Portal
  </footer>
</div>
`;

// ==========================================
// 4. ELEMENT REFERENCES
// ==========================================

const form = document.getElementById('auth-form');
const nameInput = document.getElementById('full-name');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');

const submitButton = document.getElementById('submit-btn');
const switchButton = document.getElementById('switch-mode');
const togglePassword = document.getElementById('toggle-password');

const logoImage = document.getElementById('logo-image');
const logoPlaceholder = document.getElementById('logo-placeholder');

// ==========================================
// 5. LOGO
// ==========================================

function updateLogo() {
  const hasImage = logoImage.naturalWidth > 0;
  logoImage.hidden = !hasImage;
  logoPlaceholder.hidden = hasImage;
}

logoImage.addEventListener('load', updateLogo);
logoImage.addEventListener('error', updateLogo);

if (logoImage.complete) {
  updateLogo();
}

// ==========================================
// 6. NOTICE
// ==========================================

function showNotice(message, error = false) {
  const notice = document.getElementById('notice');

  notice.textContent = message;
  notice.style.color = error ? '#ffaaaa' : '#91edbd';
}

// ==========================================
// 7. PASSWORD SHOW / HIDE
// ==========================================

togglePassword.addEventListener('click', () => {
  const show = passwordInput.type === 'password';

  passwordInput.type = show ? 'text' : 'password';
  togglePassword.textContent = show ? 'HIDE' : 'SHOW';
});

// ==========================================
// 8. PHONE NUMBER HELPERS
// ==========================================

function normalizePhone(value) {
  let digits = String(value).replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }

  return digits;
}

function getEmailCandidates(value) {
  const digits = String(value).replace(/\D/g, '');
  const localPhone = normalizePhone(value);

  return [
    `${localPhone}@phone-login.invalid`,
    `91${localPhone}@phone-login.invalid`,
    `${digits}@phone-login.invalid`
  ].filter((email, index, array) =>
    array.indexOf(email) === index
  );
}

// ==========================================
// 9. LOGIN / SIGNUP MODE
// ==========================================

function setMode(nextMode) {
  mode = nextMode;

  const isSignup = mode === 'signup';

  document.getElementById('form-title').textContent =
    isSignup ? 'Create Account' : 'Welcome Back';

  document.getElementById('form-description').textContent =
    isSignup
      ? 'Create your new member account'
      : 'Login to access your member account';

  document.getElementById('name-group').hidden = !isSignup;

  nameInput.required = isSignup;

  passwordInput.autocomplete =
    isSignup ? 'new-password' : 'current-password';

  submitButton.textContent =
    isSignup ? 'CREATE ACCOUNT' : 'LOGIN TO ACCOUNT';

  switchButton.textContent =
    isSignup ? 'Back to Login' : 'Create New Account';

  showNotice('');
}

switchButton.addEventListener('click', () => {
  if (!isSubmitting) {
    setMode(mode === 'login' ? 'signup' : 'login');
  }
});

// ==========================================
// 10. ROLE CHECK
// ==========================================

async function getUserRole(userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error) {
    throw new Error(
      'Could not verify account role: ' + error.message
    );
  }

  const roles = (data || []).map(row =>
    String(row.role).toLowerCase()
  );

  if (roles.includes('admin')) return 'admin';
  if (roles.includes('member')) return 'member';

  throw new Error(
    'No account role found. Contact the administrator.'
  );
}

// ==========================================
// 11. SAFE REDIRECT
// ==========================================

async function redirectUser(user) {
  if (isRouting) return;

  isRouting = true;

  try {
    const role = await getUserRole(user.id);

    if (role === 'admin') {
      window.location.replace(appPath('admin.html'));
      return;
    }

    if (role === 'member') {
      const { error } = await supabase.rpc('record_member_login');

      if (error) {
        console.error('Login activity error:', error);
      }

      window.location.replace(appPath('website.html'));
      return;
    }

    throw new Error('Unknown user role.');

  } catch (error) {
    isRouting = false;
    throw error;
  }
}

// ==========================================
// 12. CREATE ACCOUNT
// ==========================================

async function createAccount(phone, password) {
  const fullName = nameInput.value.trim();

  if (!fullName) {
    throw new Error('Please enter your full name.');
  }

  const email = `${phone}@phone-login.invalid`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone
      }
    }
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error('Account creation failed.');
  }

  if (!data.session) {
    showNotice(
      'Account created. Email confirmation may be required in Supabase.',
      true
    );
    return;
  }

  showNotice('Account created successfully. Redirecting...');

  await redirectUser(data.user);
}

// ==========================================
// 13. LOGIN
// ==========================================

async function loginAccount(phone, password) {
  const candidates = getEmailCandidates(phoneInput.value);

  let successfulData = null;

  for (const email of candidates) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error && data?.user) {
      successfulData = data;
      break;
    }

    if (
      error &&
      !/invalid login credentials/i.test(error.message)
    ) {
      throw error;
    }
  }

  if (!successfulData?.user) {
    throw new Error(
      'Login failed. Check the phone number and password.'
    );
  }

  showNotice('Login successful. Redirecting...');

  await redirectUser(successfulData.user);
}

// ==========================================
// 14. FORM SUBMISSION
// ==========================================

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (isSubmitting || isRouting) return;

  const phone = normalizePhone(phoneInput.value);
  const password = passwordInput.value;

  if (!/^\d{10}$/.test(phone)) {
    showNotice('Enter a valid 10-digit phone number.', true);
    return;
  }

  if (password.length < 6) {
    showNotice('Password must contain at least 6 characters.', true);
    return;
  }

  isSubmitting = true;
  submitButton.disabled = true;

  submitButton.textContent =
    mode === 'signup' ? 'CREATING ACCOUNT...' : 'LOGGING IN...';

  showNotice('');

  try {
    if (mode === 'signup') {
      await createAccount(phone, password);
    } else {
      await loginAccount(phone, password);
    }

  } catch (error) {
    console.error('Authentication error:', error);

    showNotice(
      error.message || 'Something went wrong. Please try again.',
      true
    );

  } finally {
    isSubmitting = false;
    submitButton.disabled = false;

    if (!isRouting) {
      submitButton.textContent =
        mode === 'signup' ? 'CREATE ACCOUNT' : 'LOGIN TO ACCOUNT';
    }
  }
});

// ==========================================
// 15. EXISTING SESSION
// ==========================================

async function checkExistingSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!data.session?.user) {
      return;
    }

    await redirectUser(data.session.user);

  } catch (error) {
    console.error('Session routing error:', error);

    isRouting = false;

    showNotice(
      'Could not verify your account. Please log in again.',
      true
    );
  }
}

// ==========================================
// 16. INITIALIZE LOGIN PAGE
// ==========================================

setMode('login');
checkExistingSession();
