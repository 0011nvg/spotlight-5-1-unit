/* Shared presentation modes. Static hosting: these controls are not authentication. */
(function(){
 'use strict';
 const KEY='spotlight5.learning-mode.v1';
 let mode='student';try{mode=localStorage.getItem(KEY)==='teacher'?'teacher':'student';}catch{}
 const root=new URL('../',document.currentScript.src),parked=new Map();
 document.documentElement.dataset.learningMode=mode;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const api=window.SpotlightMode={isTeacher:()=>mode==='teacher',get:()=>mode,
   resetProgress(){try{for(const key of Object.keys(localStorage))if(key.startsWith('victoria_spotlight5_')||key.startsWith('spotlight5.module3.')||key==='malik-english-adventures.v1'||key==='victoria-spider-a1-15min-v2'||['pq-world-v3','flightScore','flightDone'].includes(key))localStorage.removeItem(key);}catch{}},
   notes(html,title="Teacher's Notes"){return mode==='teacher'&&html?'<details class="s5-teacher-notes" data-teacher-only><summary>'+esc(title)+'</summary><div>'+html+'</div></details>':'';},
   set(next){next=next==='teacher'?'teacher':'student';if(next===mode)return;
     const fields=[...document.querySelectorAll('#ex-host .ex-body input:not([type=checkbox]):not([type=radio]),#ex-host .ex-body textarea,#ex-host .ex-body select')].map(el=>({tag:el.tagName,type:el.type,value:el.value}));
     mode=next;try{localStorage.setItem(KEY,mode);}catch{}apply();window.dispatchEvent(new CustomEvent('spotlight:modechange',{detail:{mode}}));
     const current=[...document.querySelectorAll('#ex-host .ex-body input:not([type=checkbox]):not([type=radio]),#ex-host .ex-body textarea,#ex-host .ex-body select')];
     if(fields.length===current.length)fields.forEach((f,i)=>{const el=current[i];if(f.tag===el.tagName&&f.type===el.type&&el.value!==f.value){el.value=f.value;el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));}});
     filter(document);},filter:()=>filter(document)};
 function teacherNode(el){
   if(el.matches('[data-teacher-only],.tutorNote,.tutor-note,#coverage,#coverageToggle,#teacherDialog,#teacherOpen,.ex-goal,.script-text,.key'))return true;
   if(el.matches('a[href]')&&/(?:TEACHER-GUIDE|MODULE2-COVERAGE|have-guide)/i.test(el.getAttribute('href')))return true;
   if(el.tagName==='DETAILS')return /teacher|tutor (?:note|card|script)|для преподавателя|план преподавателю|комментарий учителя/i.test(el.querySelector('summary')?.textContent||'');
   if(el.matches('.tutorStrip>div,.speak-strip>div,#bridge>div'))return /УЧИТЕЛЬ СПРОСИТ|НЕОЖИДАННЫЙ ВОПРОС|Tutor Follow-up/i.test(el.querySelector('b')?.textContent||'');
   return false;
 }
 function filter(scope){
   if(mode==='teacher'){for(const [el,marker]of parked){if(marker.isConnected){marker.replaceWith(el);}parked.delete(el);}return;}
   const candidates=[];if(scope.nodeType===1)candidates.push(scope);if(scope.querySelectorAll)candidates.push(...scope.querySelectorAll('[data-teacher-only],details,.tutorNote,.tutor-note,#coverage,#coverageToggle,#teacherDialog,#teacherOpen,.ex-goal,.script-text,.key,a[href],.tutorStrip>div,.speak-strip>div,#bridge>div'));
   for(const el of candidates){if(el.isConnected&&teacherNode(el)){const marker=document.createComment('Teacher material');el.replaceWith(marker);parked.set(el,marker);}}
   for(const [el,marker]of parked)if(!marker.isConnected)parked.delete(el);
 }
 function apply(){
   document.documentElement.dataset.learningMode=mode;
   document.body?.classList.toggle('teacher',mode==='teacher');
   const m=window.MEA;if(m?.Store?.data){m.Store.data.settings.teacher=mode==='teacher';m.Store.save();}
   document.querySelectorAll('[data-learning-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.learningMode===mode)));
   const status=document.getElementById('s5-mode-status');if(status)status.textContent=mode==='teacher'?'Teaching notes & lesson tools':'Practice at your own pace';
   filter(document);
 }
 function init(){
   const bar=document.createElement('div');bar.className='s5-modebar';bar.innerHTML='<a class="s5-platform-name" href="'+root.href+'">Spotlight 5 <span>English Learning Platform</span></a><nav aria-label="Course modules" class="s5-course-nav">'+[['','01'],['module2.html','02'],['module3/','03']].map(([p,n])=>'<a href="'+new URL(p,root).href+'" aria-label="Module '+n+'">'+n+'</a>').join('')+'</nav><div class="s5-mode-switch" role="group" aria-label="Learning mode"><button type="button" data-learning-mode="student">Student</button><button type="button" data-learning-mode="teacher">Teacher</button></div><span id="s5-mode-status" role="status"></span>';
   document.body.prepend(bar);bar.querySelectorAll('[data-learning-mode]').forEach(b=>b.onclick=()=>api.set(b.dataset.learningMode));
   const size=()=>document.documentElement.style.setProperty('--s5-mode-height',bar.getBoundingClientRect().height+'px');if(window.ResizeObserver)new ResizeObserver(size).observe(bar);size();
   if(/\/have-guide\.html$/.test(location.pathname)){const info=document.createElement('p');info.className='s5-teacher-lock';info.textContent='Teacher guide · Выберите Teacher, чтобы открыть план занятия. Для упражнений вернитесь в Module 03.';bar.after(info);const visibility=()=>info.hidden=mode==='teacher';window.addEventListener('spotlight:modechange',visibility);visibility();}
   apply();
   new MutationObserver(records=>{if(mode==='student')for(const r of records)for(const node of r.addedNodes)if(node.nodeType===1)filter(node);}).observe(document.body,{childList:true,subtree:true});
 }
 window.addEventListener('storage',e=>{if(e.key===KEY)api.set(e.newValue);});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
