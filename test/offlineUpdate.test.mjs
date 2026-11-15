import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
function worker({failDownload=false}={}){const handlers={},requests=[],removed=[];let activated=0,claimed=0;const context={self:{registration:{scope:'https://example.com/fitness-tracker/'},location:{origin:'https://example.com'},addEventListener:(name,handler)=>{handlers[name]=handler;},skipWaiting:async()=>{activated++;},clients:{claim:async()=>{claimed++;}}},Request:class{constructor(url,options){this.url=url;this.cache=options.cache;}},caches:{open:async()=>({addAll:async batch=>{requests.push(...batch);if(failDownload)throw Error('offline');}}),keys:async()=>['lift-log-shell-v1','unrelated-app-cache'],delete:async key=>{removed.push(key);}}};vm.runInNewContext(source,context);return {handlers,requests,removed,get activated(){return activated;},get claimed(){return claimed;}};}
function dispatch(handler){let pending;handler({waitUntil:p=>{pending=p;}});return pending;}
test('downloads fresh assets before activating an offline update',async()=>{const w=worker();await dispatch(w.handlers.install);assert(w.requests.length>0);assert(w.requests.every(r=>r.cache==='reload'));assert.equal(w.activated,1);});
test('failed offline download does not replace the working installed app',async()=>{const w=worker({failDownload:true});await assert.rejects(dispatch(w.handlers.install),/offline/);assert.equal(w.activated,0);});
test('activation removes only old app files, leaving other storage alone',async()=>{const w=worker();await dispatch(w.handlers.activate);assert.deepEqual(w.removed,['lift-log-shell-v1']);assert.equal(w.claimed,1);});
