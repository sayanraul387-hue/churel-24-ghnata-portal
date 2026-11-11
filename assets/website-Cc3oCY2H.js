import{c as $}from"./index-B5YLfHZW.js";const T="https://ahampfujtsqbxmlelgcm.supabase.co",S="sb_publishable_IcH0lf1sjQN5MGiuP8QkQA_GQGwldCZ",h="https://sayanraul387-hue.github.io/churel-24-ghnata-portal/",z=h+"admin.html",c=$(T,S,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});function u(e,t){const r=document.getElementById(e);r&&(r.textContent=t??"")}function _(){const e=document.getElementById("loading-screen");e&&(e.style.display="none")}async function C(){try{const{data:{user:e},error:t}=await c.auth.getUser();if(t||!e){window.location.replace(h);return}const{data:r,error:s}=await c.from("user_roles").select("role").eq("user_id",e.id).maybeSingle();if(s)throw s;if(!r||r.role!=="member"){if((r==null?void 0:r.role)==="admin"){window.location.replace(z);return}await c.auth.signOut(),window.location.replace(h);return}const{data:o,error:n}=await c.from("profiles").select("full_name, phone").eq("id",e.id).maybeSingle();if(n)throw n;if(!o)throw new Error("Member profile not found.");u("profile-name",o.full_name),u("profile-name-2",o.full_name),u("profile-phone",o.phone);const l=(o.full_name||"M").trim().charAt(0).toUpperCase();u("avatar",l),await M(),_()}catch(e){console.error("Website error:",e),u("status",e.message),_()}}async function M(){const e=document.getElementById("mcq-member-content");if(!e)return;const{data:t,error:r}=await c.rpc("get_published_mcq_quizzes");if(r){e.innerHTML=`<p class="mcq-muted">MCQ is not ready yet. Please contact the administrator. (${a(r.message)})</p>`;return}if(!t||t.length===0){e.innerHTML='<p class="mcq-muted">No quizzes have been published yet. Please check again later.</p>';return}e.innerHTML=`<div class="mcq-quiz-list">${t.map(n=>`
    <article class="mcq-quiz-item">
      <h3>${a(n.title)}</h3>
      <p>${a(n.description||"Test your knowledge with this MCQ quiz.")}</p>
      <p class="mcq-muted">${Number(n.question_count)} questions</p>
      <button class="mcq-btn" type="button" data-start-quiz="${n.id}">Start Quiz →</button>
    </article>`).join("")}</div><div id="mcq-test-area"></div><div id="mcq-history" class="mcq-history"></div>`,e.querySelectorAll("[data-start-quiz]").forEach(n=>{n.addEventListener("click",()=>I(n.dataset.startQuiz,t))});const{data:s}=await c.from("mcq_attempts").select("score,total,submitted_at,mcq_quizzes(title)").order("submitted_at",{ascending:!1}).limit(10),o=document.getElementById("mcq-history");o&&(s!=null&&s.length)&&(o.innerHTML="<strong>My Recent Results</strong><br>"+s.map(n=>{var l;return`${a(((l=n.mcq_quizzes)==null?void 0:l.title)||"Quiz")}: ${Number(n.score)}/${Number(n.total)} · ${new Date(n.submitted_at).toLocaleString()}`}).join("<br>"))}async function I(e,t,r){const s=document.getElementById("mcq-test-area");s.innerHTML='<p class="mcq-muted">Loading questions...</p>';const{data:o,error:n}=await c.rpc("get_mcq_questions",{p_quiz_id:e});if(n){s.innerHTML=`<p class="mcq-muted">${a(n.message)}</p>`;return}if(!(o!=null&&o.length)){s.innerHTML='<p class="mcq-muted">This quiz has no questions yet.</p>';return}const l=t.find(i=>i.id===e);s.innerHTML=`
    <form id="mcq-answer-form">
      <h3 style="margin:24px 0 8px">${a((l==null?void 0:l.title)||"MCQ Quiz")}</h3>
      <p class="mcq-muted">Select one answer for every question.</p>

      ${o.map((i,y)=>`
        <article class="mcq-question">
          <h3>${y+1}. ${a(i.question)}</h3>

          ${["A","B","C","D"].map(m=>`
            <label class="mcq-choice">
              <input type="radio" name="q_${i.id}" value="${m}" required>
              <span><strong>${m}.</strong> ${a(i["option_"+m.toLowerCase()])}</span>
            </label>`).join("")}

        </article>`).join("")}

      <button class="mcq-btn" type="submit" style="margin-top:20px">
        Submit Answers
      </button>
    </form>

    <div id="mcq-submit-result"></div>
  `,document.getElementById("mcq-answer-form").addEventListener("submit",async i=>{i.preventDefault();const y=new FormData(i.currentTarget),m=o.map(g=>({question_id:g.id,answer:String(y.get(`q_${g.id}`)||"")})),d=i.currentTarget.querySelector('button[type="submit"]');d.disabled=!0,d.textContent="Submitting...";const{data:f,error:w}=await c.rpc("submit_mcq_attempt",{p_quiz_id:e,p_answers:m}),L=document.getElementById("mcq-submit-result");if(w){L.innerHTML=`<p class="mcq-muted">${a(w.message)}</p>`,d.disabled=!1,d.textContent="Submit Answers";return}const E=Array.isArray(f)?f[0]:f;L.innerHTML=`
      <div class="mcq-result">
        <h3>Quiz Submitted Successfully!</h3>
        <p>Your Score: <strong>${Number(E.score)} / ${Number(E.total)}</strong></p>
        <p class="mcq-muted">Your result has been saved.</p>
      </div>
    `,i.currentTarget.querySelectorAll("input").forEach(g=>g.disabled=!0),d.remove()})}function a(e=""){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const p=document.getElementById("logout");p.addEventListener("click",async e=>{e.preventDefault(),e.stopPropagation(),p.disabled=!0,p.textContent="Signing out...";try{const{error:t}=await c.auth.signOut();if(t)throw t;window.location.replace(h)}catch(t){console.error("Logout error:",t),p.disabled=!1,p.textContent="Logout",alert("Logout failed: "+t.message)}});const q=document.getElementById("menuBtn"),b=document.getElementById("navLinks");q.addEventListener("click",()=>{b.classList.toggle("open"),q.textContent=b.classList.contains("open")?"✕":"☰"});b.querySelectorAll("a").forEach(e=>{e.addEventListener("click",()=>{b.classList.remove("open"),q.textContent="☰"})});const v=document.getElementById("themeBtn");v.addEventListener("click",()=>{document.body.classList.toggle("light");const e=document.body.classList.contains("light");v.textContent=e?"☾":"☀"});document.getElementById("copyPhone").addEventListener("click",async()=>{const e=document.getElementById("profile-phone").textContent;if(!(!e||e==="Loading..."))try{await navigator.clipboard.writeText(e);const t=document.getElementById("copyPhone");t.textContent="Copied!",setTimeout(()=>{t.textContent="Copy"},1500)}catch{alert("Unable to copy phone number.")}});window.addEventListener("scroll",()=>{const e=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight,r=t>0?e/t*100:0;document.getElementById("progress").style.width=r+"%",document.getElementById("backTop").style.display=e>400?"grid":"none"});document.getElementById("backTop").addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});const B=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.add("show"),B.unobserve(t.target))})},{threshold:.12});document.querySelectorAll(".reveal").forEach(e=>{B.observe(e)});u("year",new Date().getFullYear());C();
