
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

// GitHub Pages base URL
const BASE_URL = import.meta.env.BASE_URL || '/';

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value ?? '';
  }
}

// Login page redirect
function goToLogin() {
  window.location.replace(BASE_URL);
}

// Admin dashboard redirect
function goToAdmin() {
  window.location.replace(`${BASE_URL}admin.html`);
}

// Start member website
async function startWebsite() {
  try {
    // 1. Verify login session
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      goToLogin();
      return;
    }

    // 2. Verify account role
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
      throw new Error(
        'Account role not found. Please contact the administrator.'
      );
    }

    // 3. Admin must use admin dashboard
    if (roleData.role === 'admin') {
      goToAdmin();
      return;
    }

    if (roleData.role !== 'member') {
      await supabase.auth.signOut();
      goToLogin();
      return;
    }

    // 4. Load member profile
    const {
      data: profile,
      error: profileError
    } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(
        `Profile loading failed: ${profileError.message}`
      );
    }

    if (!profile) {
      throw new Error(
        'Member profile is missing. Contact the administrator.'
      );
    }

    setText('welcome', `Hello, ${profile.full_name}!`);
    setText('profile-name', profile.full_name);
    setText('profile-phone', profile.phone);

    // 5. Load admin announcement
    const {
      data: content,
      error: contentError
    } = await supabase
      .from('member_content')
      .select('title, body')
      .eq('id', 1)
      .maybeSingle();

    if (contentError) {
      throw new Error(
        `Announcement loading failed: ${contentError.message}`
      );
    }

    setText(
      'notice-title',
      content?.title || 'Welcome'
    );

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
document.getElementById('logout')?.addEventListener(
  'click',
  async () => {
    const button = document.getElementById('logout');

    if (button) {
      button.disabled = true;
      button.textContent = 'Signing out...';
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Return to the correct GitHub Pages login URL
      goToLogin();

    } catch (error) {
      console.error('Logout error:', error);

      if (button) {
        button.disabled = false;
        button.textContent = 'Logout';
      }

      alert(`Logout failed: ${error.message}`);
    }
  }
);

// 7. Start website
startWebsite();
