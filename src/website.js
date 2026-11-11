
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

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value ?? '';
}

async function startWebsite() {
  try {
    // 1. Verify login session
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.replace('/');
      return;
    }

    // 2. Verify account role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleError) {
      throw new Error(`Role check failed: ${roleError.message}`);
    }

    if (!roleData) {
      throw new Error('Account role not found. Please contact the administrator.');
    }

    // 3. Admin must use the admin dashboard
    if (roleData.role === 'admin') {
      window.location.replace('/');
      return;
    }

    if (roleData.role !== 'member') {
      await supabase.auth.signOut();
      window.location.replace('/');
      return;
    }

    // 4. Load this member's own profile
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

// 6. Logout
document.getElementById('logout')?.addEventListener(
  'click',
  async () => {
    const button = document.getElementById('logout');

    button.disabled = true;
    button.textContent = 'Signing out...';

    const { error } = await supabase.auth.signOut();

    if (error) {
      button.disabled = false;
      button.textContent = 'Logout';
      alert(error.message);
      return;
    }

    window.location.replace('/');
  }
);

// Start member website
startWebsite();
