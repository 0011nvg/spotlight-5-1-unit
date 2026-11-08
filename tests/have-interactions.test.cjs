const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM}=require('jsdom');const root=path.resolve(__dirname,'../module3');
(async()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');const dom=new JSDOM(html,{url:'http://localhost/module3/#lesson-have',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;
 w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.URL.createObjectURL=()=> 'blob:test';w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=()=>{};
 await new Promise(r=>setImmediate(r));Object.defineProperty(w.document,'readyState',{configurable:true,value:'loading'});w.localStorage.setItem('spotlight5.learning-mode.v1','teacher');
 for(const m of html.matchAll(/<script src="([^"?]+)/g)){const script=w.document.createElement('script');script.src=new URL(m[1],'http://localhost/module3/').href;Object.defineProperty(w.document,'currentScript',{configurable:true,value:script});w.eval(fs.readFileSync(path.join(root,m[1]),'utf8'));}
 w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 const M=w.MEA,d=w.document,$=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)],click=s=>{assert($(s),'missing '+s);$(s).click();},event=(el,type)=>el.dispatchEvent(new w.Event(type,{bubbles:true}));
 const fill=(sel,val)=>{const el=$(sel);el.value=val;event(el,'input');};const select=(sel,val)=>{const el=$(sel);el.value=val;event(el,'change');};const act=name=>$$('.ex-actions button').find(x=>x.textContent===name).click();
 assert(d.body.textContent.includes('Ready for a picnic?'));
 const lesson=M.lessons.find(l=>l.id==='have');let checked=0;
 for(const ex of lesson.stages.flatMap(s=>s.exercises).filter(e=>e.type==='havePractice')){
   M.openEx(ex.id,'have');
   for(let index=0;index<ex.items.length;index++){
     const item=ex.items[index];
     act('Проверить');assert($('.feedback').textContent.includes('Сначала')||$('.feedback').textContent.includes('четыре'));
     if(index===0)act('Подсказка');
     const reveal=index===1; if(reveal)act('Показать ответ');
     if(item.kind==='subject'){
       item.subject.split(' ').forEach((_,i)=>click('[data-word="'+i+'"]'));
       select('[data-number]',item.number);select('[data-pronoun]',item.pronoun);select('[data-form]',item.answer==='has'?'have':'has');act('Проверить');assert($('.feedback').classList.contains('fb-bad'));select('[data-form]',item.answer);
     }else if(item.kind==='choice'){
       const wrong=item.options.find(x=>x!==item.answer);$$('[data-option]').find(x=>x.dataset.option===wrong).click();act('Проверить');assert($('.feedback').classList.contains('fb-bad'));$$('[data-option]').find(x=>x.dataset.option===item.answer).click();
     }else if(item.kind==='order'){
       click('[data-take="0"]');click('[data-return="0"]');
       // Verify a real drag/drop path as well as its keyboard/click alternative.
       const drop=$('.have-drop');const e=new w.Event('drop',{bubbles:true,cancelable:true});Object.defineProperty(e,'dataTransfer',{value:{getData:()=> '0'}});drop.dispatchEvent(e);
       for(let i=1;i<item.words.length;i++)click('[data-take="'+i+'"]');
     }else{fill('.have-input','definitely wrong');act('Проверить');assert($('.feedback').classList.contains('fb-bad'));fill('.have-input',Array.isArray(item.answer)?item.answer[0]:item.answer);}
     act('Проверить');assert($('.feedback').classList.contains('fb-good'),item.id);checked++;
     const snap=M.Store.data.sessions['have/'+ex.id];assert(snap.log[item.id].ok);if(reveal)assert(snap.log[item.id].revealed);if(item.kind!=='order')assert(!snap.log[item.id].first);
     if(index===0){M.openEx(ex.id,'have');assert($('.feedback').textContent.includes('объясни'));}
     if(index<ex.items.length-1)click('[data-forward]');
   }
   act('Завершить блок');assert(M.Store.result('have/'+ex.id).status==='done');assert(!M.Store.data.sessions['have/'+ex.id]);
 }
 // Editing a previously checked answer must invalidate that result.
 M.openEx('form','have');$$('[data-option]').find(x=>x.dataset.option===lesson.stages[2].exercises[1].items[0].answer).click();act('Проверить');$$('[data-option]').find(x=>x.dataset.option!==lesson.stages[2].exercises[1].items[0].answer).click();assert(!M.Store.data.sessions['have/form'].log['form-0']);
 // Open project is never judged by keyword matching; drafts survive leaving the screen.
 M.openEx('project','have');act('Завершить после обсуждения');assert($('.feedback').textContent.includes('минимум'));
 for(const [i,section] of ['About Me','My Family','My Friends'].entries()){
   click('[data-add]');select('[data-section="'+i+'"]',section);fill('[data-person="'+i+'"]','Hero '+i);fill('[data-text="'+i+'"]',["I've got a bike. I haven't got a camera.","My parents have got a car. My sister has got a guitar.","Has Ben got a dog? Yes, he has."][i]);
 }
 fill('[data-title]','My <World>');fill('[data-reflection]','Я нахожу владельца и заменяю его местоимением.');act('Показать презентацию');assert($('[data-preview]').textContent.includes('My <World>'));assert(!$('[data-preview] world'));assert.equal($$('[data-preview] section').length,3);act('Скачать проект');
 M.openEx('rule','have');M.openEx('project','have');assert.equal($$('[data-text]').length,3);assert.equal($('[data-title]').value,'My <World>');click('[data-reviewed]');act('Завершить после обсуждения');assert.equal(M.Store.result('have/project').last,null);
 // Existing routes and lesson registration remain available.
 for(const id of ['3a','3b','3c','3d','eu3','er3','pc3'])assert(M.lessons.some(l=>l.id===id));
 for(const hash of ['home','map','passport','words','profile','lesson-3a','lesson-3b','lesson-3c','lesson-3d']){w.location.hash='#'+hash;M.route();assert($('#app').textContent.trim());assert(!$('#app').textContent.includes('Unknown exercise type'));}
 const exported=M.Store.exportJSON();M.Store.importJSON(exported);assert.equal(JSON.parse(M.Store.data.writing['have/project']).cards.length,3);
 console.log('PASS: '+checked+' items; empty/wrong/correct, retry, reveal accounting, hint accounting, draft/resume, click and drag order, project preview/export/completion, storage round trip, 9 existing routes.');dom.window.close();
})().catch(e=>{console.error(e);process.exit(1);});
