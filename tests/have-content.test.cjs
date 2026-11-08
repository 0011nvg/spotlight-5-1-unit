const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'../module3');
const M={Engine:{Whole:{}},Store:{},util:{esc:x=>String(x),shuffle:x=>x.slice()},registerLesson:l=>M.lesson=l};
const ctx=vm.createContext({window:{MEA:M}});
for(const file of ['have-content.js','have-lesson.js'])vm.runInContext(fs.readFileSync(path.join(root,'js/lessons',file),'utf8'),ctx,{filename:file});
const all=[...M.HaveContent.bank,...M.HaveContent.reading];
assert.equal(all.length,115);assert.equal(new Set(all.map(x=>x.id)).size,115);
for(const item of all){assert(item.prompt&&item.answer&&item.explain&&item.hint);for(const a of Array.isArray(item.answer)?item.answer:[item.answer])assert(M.HaveLesson.matches(a,item.answer));if(item.kind==='choice')assert(item.options.includes(item.answer));if(item.kind==='subject'){assert(item.prompt.startsWith(item.subject+' '));assert.equal(item.answer,['he','she','it'].includes(item.pronoun)?'has':'have');}if(item.kind==='order')assert(M.HaveLesson.matches(item.words.join(' '),item.answer));}
for(const [v,a] of [["  SHE’S   GOT a pet! ",'She has got a pet.'],["My parents haven't got a car.",'My parents have not got a car.'],["I've got a camera.",'I have got a camera.']])assert(M.HaveLesson.matches(v,a));
for(const [v,a] of [['My parents has got a car.','My parents have got a car.'],['Does Tom has got a bike?','Has Tom got a bike?'],['Yes, he has got.','Yes, he has.'],['She has not got a pet.','She has got a pet.'],["He's happy.",'He has got a bike.'],['Mybrother has got a bike.','My brother has got a bike.']])assert(!M.HaveLesson.matches(v,a));
const stages=M.lesson.stages,exs=stages.flatMap(s=>s.exercises);assert.equal(new Set(exs.map(e=>e.id)).size,exs.length);
const covered=exs.filter(e=>e.type==='havePractice').flatMap(e=>e.items.map(i=>i.id));assert.equal(covered.length,115);assert.equal(new Set(covered).size,115);
assert.equal(stages.filter(s=>!s.optional).length,8);assert.equal(exs.filter(e=>e.type==='haveProject').length,1);
const counts={};for(const i of all){counts[i.category]??={core:0,extra:0,home:0};counts[i.category][i.route]++;}
console.log(JSON.stringify({checks:'PASS: 115 keys, unique coverage, contractions, rejection of invalid grammar, subjects, word order, eight core stages',counts,blocks:exs.length,coreBlocks:stages.filter(s=>!s.optional).flatMap(s=>s.exercises).length},null,2));
