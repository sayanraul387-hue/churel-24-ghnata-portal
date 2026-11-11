
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const app = document.getElementById('admin-app');
const base = import.meta.env.BASE_URL;

app.innerHTML = `
<style>
*{box-sizing:border-box}
body{margin:0;background:#080d1b;color:#fff;font-family:Arial,sans-serif}
main{max-width:1100px;margin:35px auto;padding:20px}
header,.card{background:#151f35;border:1px solid #293854;border-radius:15px;padding:22px;margin-bottom:20px}
header{display:flex;justify-content:space-between;align-items:center;gap:15px;flex-wrap:wrap}
h1{font-size:25px;color:#9ddcff}
h2{font-size:19px;color:#a9cfff}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:15px}
.stat{background:#202d49;padding:20px;border-radius:12px}
.stat strong{display:block;font-size:27px;margin-top:12px;color:#9ddcff}
button{padding:11px 17px;border:0;border-radius:8px;background:#6554ed;color:white;cursor:pointer}
input,textarea{width:100%;padding:12px;margin:9px 0 16px;background:#0c1528;color:white;border:1px solid #405071;border-radius:8px}
table{width:100%;border-collapse:collapse;min-width:550px}
th,td{text-align:left;padding:12px;border-bottom:1px solid #34415a}
.table-wrap{overflow-x:auto}
.notice{color:#9be9b8;margin-top:12px}
</style>
<main>
<header>
  <div>
    <h1>CHUREL ADMIN CONTROL CENTER</h1>
    <p>Member Portal Management</p>
  </div>
  <button id="logout">Sign Out</button>
</header>
<div id="content">Loading data...</div>
</main>
`;

async function start() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    window.location.replace(base);
    return;
  }

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (role?.role !== 'admin') {
    window.location.replace(`${base}website.html`);
    return;
  }

  await loadDashboard();
}

async function loadDashboard() {
  const [
    { data: users, error: usersError },
    { data: logs },
    { data: settings },
    { data: page }
  ] = await Promise.all([
    supabase.from('profiles')
      .select('id,full_name,phone,created_at')
      .order('created_at', { ascending: true }),

    supabase.from('login_activity')
      .select('id,user_id,logged_in_at,profiles(full_name,phone)')
      .order('logged_in_at', { ascending: false })
      .limit(100),

    supabase.from('site_settings')
      .select('max_users').eq('id', 1).maybeSingle(),

    supabase.from('member_content')
      .select('title,body').eq('id', 1).maybeSingle()
  ]);

  if (usersError) {
    document.getElementById('content').textContent = usersError.message;
    return;
  }

  const members = users || [];
  const max = settings?.max_users ?? 7;

  document.getElementById('content').innerHTML = `
    <section class="stats">
      <div class="stat">Registered Users<strong>${members.length} / ${max}</strong></div>
      <div class="stat">Available Slots<strong>${Math.max(0,max-members.length)}</strong></div>
      <div class="stat">Login Events<strong>${(logs || []).length}</strong></div>
    </section>

    <section class="card">
      <h2>Registered Members</h2>
      <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Registration</th></tr></thead>
        <tbody>
          ${members.map(u => `
            <tr>
              <td>${escapeHTML(u.full_name)}</td>
              <td>${escapeHTML(u.phone)}</td>
              <td>${new Date(u.created_at).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      </div>
    </section>

    <section class="card">
      <h2>Recent Successful Logins</h2>
      <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Login Time</th></tr></thead>
        <tbody>
          ${(logs || []).map(l => `
            <tr>
              <td>${escapeHTML(l.profiles?.full_name || 'Unknown')}</td>
              <td>${escapeHTML(l.profiles?.phone || '-')}</td>
              <td>${new Date(l.logged_in_at).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      </div>
    </section>

    <section class="card">
      <h2>Edit Member Website Information</h2>
      <form id="content-form">
        <label>Page Title</label>
        <input name="title" maxlength="120" required value="${escapeHTML(page?.title || '')}">
        <label>Information</label>
        <textarea name="body" rows="7" maxlength="20000" required>${escapeHTML(page?.body || '')}</textarea>
        <button type="submit">Save Member Page</button>
      </form>
      <p id="notice" class="notice"></p>
    </section>
  `;

  document.getElementById('content-form').addEventListener('submit', async e => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const { error } = await supabase.from('member_content').upsert({
      id: 1,
      title: String(form.get('title')).trim(),
      body: String(form.get('body')).trim(),
      updated_at: new Date().toISOString()
    });

    const notice = document.getElementById('notice');
    notice.textContent = error ? error.message : 'Member page updated successfully.';
  });
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);
}

document.getElementById('logout').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }

  window.location.replace(base);
});

start();
