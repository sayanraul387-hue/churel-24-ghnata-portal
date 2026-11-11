import{c as M}from"./index-B5YLfHZW.js";const S="https://ahampfujtsqbxmlelgcm.supabase.co",T="sb_publishable_IcH0lf1sjQN5MGiuP8QkQA_GQGwldCZ",g="https://sayanraul387-hue.github.io/churel-24-ghnata-portal/",I=g+"admin.html",c=M(S,T,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});function $(t,e){const n=document.getElementById(t);n&&(n.textContent=e??"")}function v(){const t=document.getElementById("loading-screen");t&&(t.style.display="none")}async function k(){try{const{data:{user:t},error:e}=await c.auth.getUser();if(e||!t){window.location.replace(g);return}const{data:n,error:r}=await c.from("user_roles").select("role").eq("user_id",t.id).maybeSingle();if(r)throw r;if(!n||n.role!=="member"){if((n==null?void 0:n.role)==="admin"){window.location.replace(I);return}await c.auth.signOut(),window.location.replace(g);return}await C(),v()}catch(t){console.error("Website error:",t),$("status",t.message),v()}}async function C(){const t=document.getElementById("mcq-member-content");if(!t)return;const{data:e,error:n}=await c.rpc("get_published_mcq_quizzes");if(n){t.innerHTML=`<p class="mcq-muted">MCQ is not ready yet. Please contact the administrator. (${i(n.message)})</p>`;return}if(!e||e.length===0){t.innerHTML='<p class="mcq-muted">No quizzes have been published yet. Please check again later.</p>';return}t.innerHTML=`<div class="mcq-quiz-list">${e.map(s=>`
    <article class="mcq-quiz-item">
      <h3>${i(s.title)}</h3>
      <p>${i(s.description||"Test your knowledge with this MCQ quiz.")}</p>
      <p class="mcq-muted">${Number(s.question_count)} questions</p>
      <button class="mcq-btn" type="button" data-start-quiz="${s.id}">Start Quiz →</button>
    </article>`).join("")}</div><div id="mcq-test-area"></div><div id="mcq-history" class="mcq-history"></div>`,t.querySelectorAll("[data-start-quiz]").forEach(s=>{s.addEventListener("click",()=>H(s.dataset.startQuiz,e))});const{data:r}=await c.from("mcq_attempts").select("score,total,submitted_at,mcq_quizzes(title)").order("submitted_at",{ascending:!1}).limit(10),a=document.getElementById("mcq-history");a&&(r!=null&&r.length)&&(a.innerHTML="<strong>My Recent Results</strong><br>"+r.map(s=>{var l;return`${i(((l=s.mcq_quizzes)==null?void 0:l.title)||"Quiz")}: ${Number(s.score)}/${Number(s.total)} · ${new Date(s.submitted_at).toLocaleString()}`}).join("<br>"))}async function H(t,e,n){const r=document.getElementById("mcq-test-area");r.innerHTML='<p class="mcq-muted">Loading questions...</p>';const{data:a,error:s}=await c.rpc("get_mcq_questions",{p_quiz_id:t});if(s){r.innerHTML=`<p class="mcq-muted">${i(s.message)}</p>`;return}if(!(a!=null&&a.length)){r.innerHTML='<p class="mcq-muted">This quiz has no questions yet.</p>';return}const l=e.find(o=>o.id===t);r.innerHTML=`
    <form id="mcq-answer-form">
      <h3 style="margin:24px 0 8px">${i((l==null?void 0:l.title)||"MCQ Quiz")}</h3>
      <p class="mcq-muted">Select one answer for every question.</p>

      ${a.map((o,b)=>`
        <article class="mcq-question">
          <h3>${b+1}. ${i(o.question)}</h3>

          ${["A","B","C","D"].map(u=>`
            <label class="mcq-choice">
              <input type="radio" name="q_${o.id}" value="${u}" required>
              <span><strong>${u}.</strong> ${i(o["option_"+u.toLowerCase()])}</span>
            </label>`).join("")}

        </article>`).join("")}

      <button class="mcq-btn" type="submit" style="margin-top:20px">
        Submit Answers
      </button>
    </form>

    <div id="mcq-submit-result"></div>
  `,document.getElementById("mcq-answer-form").addEventListener("submit",async o=>{o.preventDefault();const b=new FormData(o.currentTarget),u=a.map(p=>({question_id:p.id,answer:String(b.get(`q_${p.id}`)||"")})),d=o.currentTarget.querySelector('button[type="submit"]');d.disabled=!0,d.textContent="Submitting...";const{data:q,error:w}=await c.rpc("submit_mcq_attempt",{p_quiz_id:t,p_answers:u}),L=document.getElementById("mcq-submit-result");if(w){L.innerHTML=`<p class="mcq-muted">${i(w.message)}</p>`,d.disabled=!1,d.textContent="Submit Answers";return}const E=Array.isArray(q)?q[0]:q;L.innerHTML=`
      <div class="mcq-result">
        <h3>Quiz Submitted Successfully!</h3>
        <p>Your Score: <strong>${Number(E.score)} / ${Number(E.total)}</strong></p>
        <p class="mcq-muted">Your result has been saved.</p>
      </div>
    `,o.currentTarget.querySelectorAll("input").forEach(p=>p.disabled=!0),d.remove()})}function i(t=""){return String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}const m=document.getElementById("logout");m.addEventListener("click",async t=>{t.preventDefault(),t.stopPropagation(),m.disabled=!0,m.textContent="Signing out...";try{const{error:e}=await c.auth.signOut();if(e)throw e;window.location.replace(g)}catch(e){console.error("Logout error:",e),m.disabled=!1,m.textContent="Logout",alert("Logout failed: "+e.message)}});const f=document.getElementById("menuBtn"),h=document.getElementById("navLinks");f.addEventListener("click",()=>{h.classList.toggle("open"),f.textContent=h.classList.contains("open")?"✕":"☰"});h.querySelectorAll("a").forEach(t=>{t.addEventListener("click",()=>{h.classList.remove("open"),f.textContent="☰"})});const _=document.getElementById("themeBtn");_.addEventListener("click",()=>{document.body.classList.toggle("light");const t=document.body.classList.contains("light");_.textContent=t?"☾":"☀"});window.addEventListener("scroll",()=>{const t=window.scrollY,e=document.documentElement.scrollHeight-window.innerHeight,n=e>0?t/e*100:0;document.getElementById("progress").style.width=n+"%",document.getElementById("backTop").style.display=t>400?"grid":"none"});document.getElementById("backTop").addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});const z=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting&&(e.target.classList.add("show"),z.unobserve(e.target))})},{threshold:.12});document.querySelectorAll(".reveal").forEach(t=>{z.observe(t)});$("year",new Date().getFullYear());const B=document.getElementById("startMcqBtn"),y=document.getElementById("mcq-quiz-area");B&&y&&B.addEventListener("click",()=>{y.style.display="block",y.scrollIntoView({behavior:"smooth",block:"start"})});k();
