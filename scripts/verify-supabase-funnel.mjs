// Manual integration test: writes only explicitly tagged synthetic QA data.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const env=Object.fromEntries((await readFile(new URL('../.env.production',import.meta.url),'utf8')).split('\n').filter(l=>l.startsWith('VITE_')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));
const base=env.VITE_SUPABASE_URL+'/rest/v1/';
const headers={apikey:env.VITE_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'};
const session=randomUUID();const page=randomUUID();const flow=randomUUID();
function event(name){return {event_id:randomUUID(),event_name:name,session_id:session,page_id:page,flow_id:flow,page_path:'/',source:'api',is_test:true,occurred_at:new Date().toISOString()};}
async function rpc(name,body,expected=200){const r=await fetch(base+'rpc/'+name,{method:'POST',headers,body:JSON.stringify(body)});assert.equal(r.status,expected,`${name}: unexpected HTTP ${r.status}`);return r.json();}
const countBefore=await fetch(base+'rpc/get_launch_signup_count',{headers}).then(r=>r.json());
const click=event('cta_click');
assert.equal((await rpc('record_launch_events',{p_events:[click,event('contact_input_started')]})).ok,true);
assert.equal((await rpc('record_launch_events',{p_events:[click]})).ok,true);
await rpc('record_launch_events',{p_events:[{...event('cta_click'),email:'must-not-be-recorded@example.com'}]},400);
await rpc('record_launch_events',{p_events:[event('submit_success')]},400);
const email='moa-funnel-api-'+randomUUID().slice(0,8)+'@example.com';
const success=event('submit_success');
assert.equal((await rpc('submit_launch_contact',{p_contact:email,p_consent:true,p_context:success})).ok,true);
assert.equal((await rpc('submit_launch_contact',{p_contact:email,p_consent:true,p_context:success})).ok,true);
assert.equal((await rpc('submit_launch_contact',{p_contact:'+1 (202) 555-0123',p_consent:true,p_context:event('submit_success')})).ok,true);
await rpc('submit_launch_contact',{p_contact:'123',p_consent:true,p_context:event('submit_success')},400);
await rpc('submit_launch_contact',{p_contact:'invalid@example.com',p_consent:false,p_context:event('submit_success')},400);
for(const table of ['launch_signups','launch_events','launch_event_counts']){
 const r=await fetch(base+table+'?select=*',{headers});assert.ok(r.status===401||r.status===403,`${table}: public read must be denied`);
}
const countAfter=await fetch(base+'rpc/get_launch_signup_count',{headers}).then(r=>r.json());
assert.equal(countBefore,countAfter,'QA must not change the subscriber counter');
console.log(JSON.stringify({result:'passed',session_id:session,flow_id:flow,checks:'event retry; email; phone; invalid input; consent; metadata allowlist; success transaction; public read denied; QA excluded',counter_unchanged:true}));
