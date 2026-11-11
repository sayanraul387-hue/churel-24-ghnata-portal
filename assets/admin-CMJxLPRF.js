import{c as b}from"./index-B5YLfHZW.js";const a=b("https://ahampfujtsqbxmlelgcm.supabase.co","sb_publishable_IcH0lf1sjQN5MGiuP8QkQA_GQGwldCZ"),u=document.getElementById("admin-app"),m="/churel-24-ghnata-portal/";u.innerHTML=`
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
`;async function f(){const{data:{user:e},error:n}=await a.auth.getUser();if(n||!e){window.location.replace(m);return}const{data:o}=await a.from("user_roles").select("role").eq("user_id",e.id).maybeSingle();if((o==null?void 0:o.role)!=="admin"){window.location.replace(`${m}website.html`);return}await h()}async function h(){const[{data:e,error:n},{data:o},{data:l},{data:r}]=await Promise.all([a.from("profiles").select("id,full_name,phone,created_at").order("created_at",{ascending:!0}),a.from("login_activity").select("id,user_id,logged_in_at,profiles(full_name,phone)").order("logged_in_at",{ascending:!1}).limit(100),a.from("site_settings").select("max_users").eq("id",1).maybeSingle(),a.from("member_content").select("title,body").eq("id",1).maybeSingle()]);if(n){document.getElementById("content").textContent=n.message;return}const c=e||[],p=(l==null?void 0:l.max_users)??7;document.getElementById("content").innerHTML=`
    <section class="stats">
      <div class="stat">Registered Users<strong>${c.length} / ${p}</strong></div>
      <div class="stat">Available Slots<strong>${Math.max(0,p-c.length)}</strong></div>
      <div class="stat">Login Events<strong>${(o||[]).length}</strong></div>
    </section>

    <section class="card">
      <h2>Registered Members</h2>
      <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Registration</th></tr></thead>
        <tbody>
          ${c.map(t=>`
            <tr>
              <td>${i(t.full_name)}</td>
              <td>${i(t.phone)}</td>
              <td>${new Date(t.created_at).toLocaleString()}</td>
            </tr>
          `).join("")}
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
          ${(o||[]).map(t=>{var d,s;return`
            <tr>
              <td>${i(((d=t.profiles)==null?void 0:d.full_name)||"Unknown")}</td>
              <td>${i(((s=t.profiles)==null?void 0:s.phone)||"-")}</td>
              <td>${new Date(t.logged_in_at).toLocaleString()}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
      </div>
    </section>

    <section class="card">
      <h2>Edit Member Website Information</h2>
      <form id="content-form">
        <label>Page Title</label>
        <input name="title" maxlength="120" required value="${i((r==null?void 0:r.title)||"")}">
        <label>Information</label>
        <textarea name="body" rows="7" maxlength="20000" required>${i((r==null?void 0:r.body)||"")}</textarea>
        <button type="submit">Save Member Page</button>
      </form>
      <p id="notice" class="notice"></p>
    </section>
  `,document.getElementById("content-form").addEventListener("submit",async t=>{t.preventDefault();const d=new FormData(t.currentTarget),{error:s}=await a.from("member_content").upsert({id:1,title:String(d.get("title")).trim(),body:String(d.get("body")).trim(),updated_at:new Date().toISOString()}),g=document.getElementById("notice");g.textContent=s?s.message:"Member page updated successfully."})}function i(e=""){return String(e).replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}document.getElementById("logout").addEventListener("click",async()=>{const{error:e}=await a.auth.signOut();if(e){alert(e.message);return}window.location.replace(m)});f();
