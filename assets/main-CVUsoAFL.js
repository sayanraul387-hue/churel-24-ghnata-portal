import{c as v}from"./index-B5YLfHZW.js";const E="https://ahampfujtsqbxmlelgcm.supabase.co",C="sb_publishable_IcH0lf1sjQN5MGiuP8QkQA_GQGwldCZ",I=document.getElementById("app");window.location.search&&window.history.replaceState({},document.title,window.location.pathname+window.location.hash);const l=v(E,C);let s="login",u=!1;I.innerHTML=`
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

/* LOGO */

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

/* BRAND */

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

/* INPUTS */

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

/* BUTTONS */

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
  src="/churel-24-ghnata-portal/logo.png"
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
`;const A=document.getElementById("auth-form"),b=document.getElementById("full-name"),w=document.getElementById("phone"),g=document.getElementById("password"),d=document.getElementById("submit-btn"),x=document.getElementById("switch-mode"),h=document.getElementById("toggle-password"),c=document.getElementById("logo-image"),k=document.getElementById("logo-placeholder");function m(){const t=c.naturalWidth>0;c.hidden=!t,k.hidden=t}c.addEventListener("load",m);c.addEventListener("error",m);c.complete&&m();function a(t,e=!1){const o=document.getElementById("notice");o.textContent=t,o.style.color=e?"#ffaaaa":"#91edbd"}h.addEventListener("click",()=>{const t=g.type==="password";g.type=t?"text":"password",h.textContent=t?"HIDE":"SHOW"});function y(t){let e=t.replace(/\D/g,"");return e.length===12&&e.startsWith("91")&&(e=e.slice(2)),e}function L(t){const e=t.replace(/\D/g,""),o=y(t);return[`${o}@phone-login.invalid`,`91${o}@phone-login.invalid`,`${e}@phone-login.invalid`].filter((n,r,i)=>i.indexOf(n)===r)}function N(t){s=t;const e=s==="signup";document.getElementById("form-title").textContent=e?"Create Account":"Welcome Back",document.getElementById("form-description").textContent=e?"Create your new member account":"Login to access your member account",document.getElementById("name-group").hidden=!e,b.required=e,g.autocomplete=e?"new-password":"current-password",d.textContent=e?"CREATE ACCOUNT":"LOGIN TO ACCOUNT",x.textContent=e?"Back to Login":"Create New Account",a("")}x.addEventListener("click",()=>{u||N(s==="login"?"signup":"login")});async function O(t){const{data:e,error:o}=await l.from("user_roles").select("role").eq("user_id",t);if(o)throw new Error("Could not verify account role: "+o.message);const n=(e||[]).map(r=>String(r.role).toLowerCase());if(n.includes("admin"))return"admin";if(n.includes("member"))return"member";throw new Error("No account role found. Contact the administrator.")}async function f(t){const e=await O(t.id),o="/churel-24-ghnata-portal/";if(e==="admin"){window.location.replace(`${o}admin.html`);return}if(e==="member"){const{error:n}=await l.rpc("record_member_login");n&&console.error("Login activity error:",n),window.location.replace(`${o}website.html`)}}async function B(t,e){const o=b.value.trim();if(!o)throw new Error("Please enter your full name.");const n=`${t}@phone-login.invalid`,{data:r,error:i}=await l.auth.signUp({email:n,password:e,options:{data:{full_name:o,phone:t}}});if(i)throw i;if(!r.user)throw new Error("Account creation failed.");if(!r.session){a("Account created. Email confirmation may be required in Supabase.",!0);return}a("Account created successfully. Redirecting..."),await f(r.user)}async function T(t,e){const o=L(w.value);let n=null;for(const r of o){const{data:i,error:p}=await l.auth.signInWithPassword({email:r,password:e});if(!p&&(i!=null&&i.user)){n=i;break}if(p&&!/invalid login credentials/i.test(p.message))throw p}if(!(n!=null&&n.user))throw new Error("Login failed. Check the phone number and password, and verify the account email in Supabase Authentication > Users.");a("Login successful. Redirecting..."),await f(n.user)}A.addEventListener("submit",async t=>{if(t.preventDefault(),u)return;const e=y(w.value),o=g.value;if(!/^\d{10}$/.test(e)){a("Enter a valid 10-digit phone number.",!0);return}if(o.length<6){a("Password must contain at least 6 characters.",!0);return}u=!0,d.disabled=!0,d.textContent=s==="signup"?"CREATING ACCOUNT...":"LOGGING IN...",a("");try{s==="signup"?await B(e,o):await T(e,o)}catch(n){console.error("Authentication error:",n),a(n.message||"Something went wrong. Please try again.",!0)}finally{u=!1,d.disabled=!1,d.textContent=s==="signup"?"CREATE ACCOUNT":"LOGIN TO ACCOUNT"}});async function P(){var o;const{data:t,error:e}=await l.auth.getSession();if(e){console.error("Session check error:",e);return}if((o=t.session)!=null&&o.user)try{await f(t.session.user)}catch(n){console.error("Session routing error:",n),await l.auth.signOut(),a("Could not verify your account role. Please log in again.",!0)}}P();
