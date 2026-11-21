export const VERSION=1;
export const exercise=(name,count,min,max,weight='',mode='weight',note='')=>({name,min,max,mode,note,sets:Array.from({length:count},()=>({weight:String(weight),reps:'',done:false}))});
export const programs=[
{id:'upper-a',name:'Upper A',focus:'Bench emphasis',exercises:[exercise('Bench press',5,5,8,145),exercise('Lat pulldown',5,5,8),exercise('Assisted pull-up',3,8,10,115,'assistance'),exercise('Cable lateral raise',2,8,10,7.5),exercise('Triceps pushdown',2,8,10,25),exercise('Biceps curl',2,8,10,30,'weight','Weight per hand')]},
{id:'lower-a',name:'Lower A',focus:'Squat emphasis',exercises:[exercise('Squat',5,5,8,115),exercise('Seated leg curl',3,8,10,90),exercise('Deep calf raise',2,8,10,40),exercise('Tibialis raise',2,8,10,15,'weight','Per leg'),exercise('Back extension',2,0,0,'','time')]},
{id:'upper-b',name:'Upper B',focus:'Shoulder emphasis',exercises:[exercise('Overhead press',5,5,8,75),exercise('Incline press',5,5,8,95),exercise('Assisted pull-up',3,8,10,115,'assistance'),exercise('Cable row',3,8,10,85),exercise('Cable lateral raise',2,8,10,7.5),exercise('Biceps curl',2,8,10,30,'weight','Weight per hand'),exercise('Triceps pushdown',2,8,10,25)]},
{id:'lower-b',name:'Lower B',focus:'Leg press + unilateral',exercises:[exercise('Leg press',5,5,8,230),exercise('Seated leg curl',3,8,10,90),exercise('Split squat',3,8,10,35,'weight','Weight per hand; reps per leg. Complete both legs for each set.'),exercise('Back extension',2,8,10,'','bodyweight'),exercise('Deep calf raise',2,8,10,40),exercise('Tibialis raise',2,8,10,15,'weight','Per leg')]}
];
export const clone=x=>JSON.parse(JSON.stringify(x));
export const localDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const freshState=()=>({version:VERSION,history:[],draft:null,lastBackup:null});
export const countSets=w=>w.exercises.reduce((n,e)=>n+e.sets.length,0);
export const completedSets=w=>w.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0);
const text=(v,max)=>typeof v==='string'&&v.length<=max;
const numeric=v=>text(v,12)&&(v===''||(/^\d+(\.\d+)?$/.test(v)&&Number(v)<=10000));
export const validDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v+'T12:00:00'))&&localDate(new Date(v+'T12:00:00'))===v;
function validateWorkout(w){
if(!w||!text(w.id,100)||!w.id||!text(w.name,100)||!w.name||!validDate(w.date)||!text(w.notes,50000)||!Array.isArray(w.exercises)||w.exercises.length>100)throw Error('Invalid workout record.');
if(w.programId!==null&&!programs.some(p=>p.id===w.programId))throw Error('Unknown workout split.');
for(const e of w.exercises){if(!e||!text(e.name,100)||!e.name||!text(e.note,5000)||!['weight','assistance','bodyweight','time'].includes(e.mode)||!Number.isInteger(e.min)||!Number.isInteger(e.max)||e.min<0||e.max<e.min||e.max>10000||!Array.isArray(e.sets)||e.sets.length>100)throw Error('Invalid exercise.');for(const s of e.sets)if(!s||!numeric(s.weight)||!numeric(s.reps)||(s.reps!==''&&!Number.isInteger(Number(s.reps)))||typeof s.done!=='boolean'||(s.done&&(!s.reps||Number(s.reps)<1)))throw Error('Invalid set.');}
return w;
}
export function validateBackup(data){if(!data||data.version!==VERSION||!Array.isArray(data.history)||data.history.length>10000)throw Error('Choose a Lift Log backup (version 1).');const ids=new Set();data.history.forEach(w=>{validateWorkout(w);if(ids.has(w.id))throw Error('Duplicate workout IDs.');ids.add(w.id);});if(data.draft!==null)validateWorkout(data.draft);if(data.lastBackup!==null&&(!text(data.lastBackup,50)||isNaN(Date.parse(data.lastBackup))))throw Error('Invalid backup date.');return {version:VERSION,history:clone(data.history),draft:clone(data.draft),lastBackup:data.lastBackup};}
export function mergeHistory(current,incoming){const map=new Map(current.map(w=>[w.id,w]));for(const w of incoming)if(!map.has(w.id))map.set(w.id,w);return [...map.values()].sort((a,b)=>b.date.localeCompare(a.date));}
export function createWorkout(program,history,id,date){const exercises=clone(program.exercises);for(const e of exercises){const previous=[...history].sort((a,b)=>b.date.localeCompare(a.date)).flatMap(w=>w.exercises).find(p=>p.name.toLowerCase()===e.name.toLowerCase()&&p.mode===e.mode&&p.sets.some(s=>s.done&&s.weight!==''));if(previous){const weights=previous.sets.filter(s=>s.done&&s.weight!=='').map(s=>s.weight);e.sets.forEach((s,i)=>{s.weight=weights[Math.min(i,weights.length-1)];});}}return{id,name:program.name,programId:program.id,date,notes:'',exercises};}
