const fs=require('fs'),path=require('path'),assert=require('assert');const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');const forbidden=/malik|malek|мал[еиэ]к/i;
const tick=()=>new Promise(r=>setImmediate(r));
async function load(page,mode='student',seed={}){
 const filename=page.split(/[?#]/)[0]||'index.html',html=fs.readFileSync(path.join(root,filename),'utf8');const errors=[];
 const dom=new JSDOM(html,{url:'http://localhost/'+page,runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window,d=w.document;
 w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLMediaElement.prototype.load=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.confirm=()=>false;w.alert=()=>{};w.print=()=>{};w.ResizeObserver=class{observe(){}};
 w.localStorage.setItem('spotlight5.learning-mode.v1',mode);for(const [k,v]of Object.entries(seed))w.localStorage.setItem(k,JSON.stringify(v));
 w.addEventListener('error',e=>{errors.push(e.error||e.message);e.preventDefault();});await tick();Object.defineProperty(d,'readyState',{configurable:true,value:'loading'});
 for(const script of [...d.querySelectorAll('script')]){if(script.type&&script.type!=='text/javascript'&&script.type!=='module')continue;if(script.type==='module')continue;Object.defineProperty(d,'currentScript',{configurable:true,value:script});if(script.src){const url=new URL(script.src);if(url.hostname!=='localhost')continue;w.eval(fs.readFileSync(path.join(root,url.pathname),'utf8'));}else if(script.textContent.trim())w.eval(script.textContent);}
 Object.defineProperty(d,'currentScript',{configurable:true,value:null});d.dispatchEvent(new w.Event('DOMContentLoaded'));await tick();return{w,d,dom,errors,flush:tick};
}
function clean(d,label){assert(!forbidden.test(d.body.textContent),label+' personalized body');assert(!forbidden.test(d.title),label+' title');for(const el of d.querySelectorAll('[aria-label],[title],[placeholder],[alt]'))assert(!forbidden.test([...el.attributes].map(x=>x.value).join(' ')),label+' personalized attribute');}
function noTeacher(d,label){assert(!d.querySelector('[data-teacher-only],.tutor-note,.tutorNote,#teacherDialog,#coverage'),label+' teacher node in Student DOM');assert(!/Не подсказывайте|Зафиксируйте|Respond naturally\. Give the student/.test(d.body.textContent),label+' teacher text');}
(async()=>{
 let blocks=0;
 for(const mode of ['student','teacher']){
  for(const page of ['index.html','module2.html','module2-studio.html','spider-mission/index.html','module3/index.html#lesson-have','module3/worksheet.html?l=3a','module3/have-guide.html']){
   const x=await load(page,mode),{w,d,dom,errors}=x;assert.equal(errors.length,0,page+' '+errors.map(String));assert(d.querySelector('.s5-modebar'),page);clean(d,page);
   if(mode==='student')noTeacher(d,page);
   if(page.startsWith('module3/index')){
    const M=w.MEA;
    for(const lesson of M.lessons)for(const stage of lesson.stages)for(const ex of stage.exercises){
      M.openEx(ex.id,lesson.id);await tick();assert.equal(errors.length,0,lesson.id+'/'+ex.id+' '+errors.map(String));clean(d,lesson.id+'/'+ex.id);assert(!d.body.textContent.includes('Unknown exercise type'));if(mode==='student')noTeacher(d,lesson.id+'/'+ex.id);blocks++;
    }
    M.openEx('warm','have');await tick();if(mode==='teacher')assert(d.querySelector('.s5-teacher-notes')?.textContent.includes('Не подсказывайте'));else assert(!d.body.textContent.includes('Не подсказывайте'));
    M.openEx('form','have');await tick();let btn=[...d.querySelectorAll('.ex-actions button')].find(x=>x.textContent==='Показать ответ');assert.equal(btn.disabled,mode==='student');
    if(mode==='student'){
      d.querySelector('[data-option]').click();[...d.querySelectorAll('.ex-actions button')].find(x=>x.textContent==='Проверить').click();assert(btn.disabled);[...d.querySelectorAll('.ex-actions button')].find(x=>x.textContent==='Проверить').click();assert(!btn.disabled);
    }
    // Shared role changes preserve the active exercise and expose / remove notes.
    M.openEx('warm','have');w.SpotlightMode.set(mode==='teacher'?'student':'teacher');await tick();assert.equal(d.querySelector('.ex-title').textContent,'Ready for a picnic?');if(mode==='teacher')noTeacher(d,'switch');else assert(d.querySelector('.s5-teacher-notes'));
   }
   if(page==='module2.html'){
    const lessons=[...d.querySelectorAll('[data-lesson]')].map(b=>b.dataset.lesson);
    for(const id of lessons){d.querySelector('[data-lesson="'+id+'"]').click();await tick();const steps=[...d.querySelectorAll('[data-step]')].map(b=>b.dataset.step);for(const i of steps){d.querySelector('[data-step="'+i+'"]').click();await tick();assert.equal(errors.length,0,'module2 '+id+'/'+i+' '+errors.map(String));if(mode==='student')noTeacher(d,'module2 '+id+'/'+i);blocks++;}}
   }
   if(page==='module2-studio.html'){
    const ids=w.S5_BOOK.map((x,i)=>({id:x.id,index:i,page:x.p}));for(const item of ids){d.querySelector('[data-page="'+item.page+'"]').click();await tick();d.querySelector('[data-book="'+item.index+'"]').click();await tick();assert.equal(errors.length,0,'studio '+item.id+' '+errors.map(String));if(mode==='student')noTeacher(d,'studio '+item.id);blocks++;}
    d.querySelector('[data-tab="talk"]').click();await tick();for(let i=0;i<w.S5_SPEAKING.length;i++){d.querySelector('[data-talk="'+i+'"]').click();await tick();assert.equal(errors.length,0,'talk '+i+' '+errors.map(String));if(mode==='student')noTeacher(d,'talk '+i);blocks++;}
    for(const field of ['learn','match','recall','use']){d.querySelector('[data-tab="words"]').click();await tick();d.querySelector('[data-word-mode="'+field+'"]').click();await tick();assert.equal(errors.length,0,'Word Lab '+field+' '+errors.map(String));if(mode==='student')noTeacher(d,'Word Lab');blocks++;}
    // The alternate listening remains playable without exposing the teacher script.
    const listening=w.S5_BOOK.findIndex(e=>e.type==='listening');assert(listening>=0);d.querySelector('[data-tab="book"]').click();d.querySelector('[data-page="'+w.S5_BOOK[listening].p+'"]').click();d.querySelector('[data-book="'+listening+'"]').click();await tick();assert(d.querySelector('[data-action="listenNew"]'));d.querySelector('[data-action="listenNew"]').click();assert(d.querySelector('[data-save$=":audioMode"]').value.startsWith('New'));if(mode==='student')noTeacher(d,'playable alternate listening');
   }
   dom.window.close();
  }
 }
 // Migration keeps former students' data without making the old name visible.
 const x=await load('module3/index.html','student',{'malik-english-adventures.v1':{xp:137,results:{},writing:{'have/project':'{"title":"My World","cards":[]}'},settings:{teacher:true}}});assert.equal(x.w.MEA.Store.data.xp,137);assert.equal(x.w.MEA.Store.data.settings.teacher,false);clean(x.d,'migration');x.dom.window.close();
 console.log('PASS: '+blocks+' rendered activities across both modes; seven entry pages; all Module 3 lessons, Module 2 missions/book/speaking/Word Lab; name/attribute scan; teacher DOM separation; reveal delay; role switching; legacy progress migration.');
})().catch(e=>{console.error(e);process.exit(1)});
