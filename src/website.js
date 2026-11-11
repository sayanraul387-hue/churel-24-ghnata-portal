
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// GitHub Pages Login Portal URL
const BASE_URL =
  'https://sayanraul387-hue.github.io/churel-24-ghnata-portal/';

// Safe text update
function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value ?? '';
  }
}

// Redirect to Login Portal
function goToLogin() {
  window.location.replace(BASE_URL);
}

// Redirect to Admin Dashboard
function goToAdmin() {
  window.location.replace(`${BASE_URL}admin.html`);
}

// Start Member Website
async function startWebsite() {
  try {
    // 1. Check login session
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      goToLogin();
      return;
    }

    // 2. Check user role
    const {
      data: roleData,
      error: roleError
    } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleError) {
      throw new Error(`Role check failed: ${roleError.message}`);
    }

    if (!roleData) {
      throw new Error('Account role not found.');
    }

    // 3. Admin redirect
    if (roleData.role === 'admin') {
      goToAdmin();
      return;
    }

    if (roleData.role !== 'member') {
      await supabase.auth.signOut();
      goToLogin();
      return;
    }

    // 4. Load Member Profile
    const {
      data: profile,
      error: profileError
    } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Profile loading failed: ${profileError.message}`);
    }

    if (!profile) {
      throw new Error('Member profile is missing.');
    }

    setText('welcome', `Hello, ${profile.full_name}!`);
    setText('profile-name', profile.full_name);
    setText('profile-phone', profile.phone);

    // 5. Load Admin Announcement
    const {
      data: content,
      error: contentError
    } = await supabase
      .from('member_content')
      .select('title, body')
      .eq('id', 1)
      .maybeSingle();

    if (contentError) {
      throw new Error(`Announcement loading failed: ${contentError.message}`);
    }

    setText('notice-title', content?.title || 'Welcome');
    setText(
      'notice-body',
      content?.body || 'No announcement available.'
    );

  } catch (error) {
    console.error('Website error:', error);

    setText('welcome', 'Unable to load your account');
    setText('notice-title', 'Account loading error');
    setText('notice-body', error.message);
  }
}

// 6. Member Logout
const logoutButton = document.getElementById('logout');

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    logoutButton.textContent = 'Signing out...';

    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear local session and return to Login Portal
      window.location.replace(
        'https://sayanraul387-hue.github.io/churel-24-ghnata-portal/'
      );

    } catch (error) {
      console.error('Logout error:', error);

      logoutButton.disabled = false;
      logoutButton.textContent = 'Logout';

      alert(`Logout failed: ${error.message}`);
    }
  });
}

// 7. Start Website
startWebsite();
