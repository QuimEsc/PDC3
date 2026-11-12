import fs from 'node:fs';
import vm from 'node:vm';
import { createHash, randomUUID } from 'node:crypto';
export function pendingBackend(settings = {}) {
  const data = {}, props = new Map([['GRUP_ID','TEST']]), cache = new Map();
  let calls = 0, nested = null, failPatch = false, lostAck = false;
  const read = path => path.split('/').filter(Boolean).reduce((v,k)=>v?.[k],data) ?? null;
  const set = (path,value) => { const parts=path.split('/').filter(Boolean); let node=data; for(const k of parts.slice(0,-1)) node=node[k] ||= {}; if(value===null)delete node[parts.at(-1)];else node[parts.at(-1)]=structuredClone(value); };
  const ctx = vm.createContext({console:{log(){}},DOCENT_SESSION_SECONDS:21600,
    Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_,s)=>[...createHash('sha256').update(s).digest()],base64EncodeWebSafe:b=>Buffer.from(b).toString('base64url'),getUuid:randomUUID},
    PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k)||null,setProperty:(k,v)=>props.set(k,v),deleteProperty:k=>props.delete(k)})},
    CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v),remove:k=>cache.delete(k)})},
    LockService:{getScriptLock:()=>({waitLock(){},tryLock:()=>true,releaseLock(){}})},
    UrlFetchApp:{fetch(){throw Error('NETWORK_FORBIDDEN');}},
  });
  vm.runInContext(fs.readFileSync('apps-script/Code.gs','utf8'),ctx);
  ctx.pdcFirebaseAdminGet_=path=>structuredClone(read(path));
  ctx.pdcFirebaseAdminSet_=set;
  ctx.pdcFirebaseAdminDelete_=path=>set(path,null);
  ctx.pdcFirebaseAdminPatch_=(path,changes)=>{if(failPatch){failPatch=false;throw Error('offline');}for(const [key,v] of Object.entries(changes))set(path+'/'+key,v);if(lostAck && 'pendingEvents/s1-grade' in changes){lostAck=false;throw Error('ACK_LOST');}};
  ctx.pdcOpenAIGrade_=()=>{calls++;if(nested)nested();return{score:6,status:'partial',feedback:'Retorn sintètic',confidence:1,criterionScores:[],teacherReview:false};};
  ctx.pdcRubricGradeIssues_=()=>[];ctx.pdcApplyPdcCalibration_=(_a,_b,g)=>g;ctx.pdcNormalizeRubricGrade_=(_a,_b,g)=>g;
  const policy={requireCorrectionAfterFailure:false,secondAttemptWithHint:true,secondAttemptEnabled:true,allowContinueAfterFirst:true,scorePolicy:'SECOND_ATTEMPT',...settings};
  set('GamificacioPDC/teacherState/TEST',{dashboard:{students:[{id:'SYNTHETIC',name:'Test'}],unitAccess:[{unitId:'u03',enabled:true,closed:false,term:1}],assessmentPlan:{terms:[{term:1,closed:false}],activities:[]},pedagogicalSettings:policy}});
  props.set(ctx.pdcStudentLeaseKey_('SYNTHETIC','TEST'),'lease-test');
  props.set(ctx.pdcTeacherSessionKey_('teacher-test'),JSON.stringify({epoch:ctx.pdcResetEpoch_(),expiresAt:Date.now()+600000}));
  const root='GamificacioPDC/academic/TEST';
  function answer(id='s1',activityId='u03-05',blank=false,attemptsBefore=0) {
    const activity=ctx.PDC_ACTIVITY_CATALOG[activityId];
    const snapshot={id:activity.id,unitId:activity.unitId,kind:activity.kind,prompt:activity.prompt,context:activity.context||'',data:activity.data||[],modelAnswer:activity.modelAnswer,rubric:activity.rubric||[]};
    const e={eventId:id+'-answer',submissionId:id,studentId:'SYNTHETIC',sessionId:'lease-test',type:'SUBMISSION',unitId:'u03',activityId,sequence:attemptsBefore*2+1,createdAt:1000+attemptsBefore,status:'PROCESSING',payload:{answer:blank?'':'Resposta sintètica original',kind:activity.kind,variant:0,attemptsBefore,attemptNumber:attemptsBefore+1,recoveryContext:{schemaVersion:'PDC_ANSWER_CONTEXT_V1',gradingSchemaVersion:'PDC_OPEN_RUBRIC_V1',activityVersion:ctx.pdcHistoricalReviewHash_(snapshot),activitySnapshot:snapshot,pedagogicalPolicySnapshot:policy,scorePolicySnapshot:policy.scorePolicy,threshold:5,maxAttempts:policy.secondAttemptEnabled?2:1},...(blank?{submissionMode:'EXPLICIT_NO_ANSWER',explicitConfirmation:true}:{})}};
    set(root+'/events/SYNTHETIC/'+e.eventId,e);return e;
  }
  const request=(id='s1',activityId='u03-05')=>({groupId:'TEST',studentId:'SYNTHETIC',sessionId:'lease-test',activityId,submissionId:id});
  const teacher=(id='s1',activityId='u03-05')=>({...request(id,activityId),teacherToken:'teacher-test'});
  function prepare(id='s1',activity='u03-05') { const q=teacher(id,activity),preview=ctx.pdcTeacherPendingPreview_(q);return {...q,ticket:preview.ticket,expectedHash:preview.expectedHash,confirmRecovery:true}; }
  return{ctx,data,read,set,props,cache,root,answer,request,teacher,prepare,calls:()=>calls,duringGrade:fn=>nested=fn,failPatch:()=>failPatch=true,loseAck:()=>lostAck=true};
}
