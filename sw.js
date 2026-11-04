// 사본(11-05, 기출지우개 : 2027 사회조사분석사 2급): 공인중개사 앱들(gichul-jiugae·gichul-jiugae2)과 출처(jjangguss-prog.github.io)가 같아 캐시 저장소도 같이 쓴다.
// 이름을 jiugaesa-로 따로 두고, 지울 때도 jiugaesa- 캐시만 지운다(공인중개사 앱 캐시 jiugae-…·jiugae2-…는 건드리지 않음)
const C='jiugaesa-v1';
// 설치할 때 문제 그림(q.img)이 있으면 같이 받아 둔다: 지하철 같은 데서 계산 문제 그림이 안 떠 못 푸는 일이 없게(공인중개사 앱 10-26)
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon.svg','./manifest.webmanifest']).catch(()=>{}).then(()=>fetch('./cards.json').then(r=>r.json()).then(d=>Promise.all(Object.values(d.questions).filter(q=>q.img).map(q=>c.add('./'+q.img).catch(()=>{}))))).catch(()=>{})));self.skipWaiting();});
// 옛 판 캐시(jiugaesa-로 시작하는 것만)와, 캐시에 들어간 다른 곳 응답(GitHub 동기화 기록)은 지운다
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k.indexOf('jiugaesa-')===0).map(k=>caches.delete(k)))).then(()=>caches.open(C)).then(c=>c.keys().then(rs=>Promise.all(rs.filter(r=>r.url.indexOf(self.location.origin+'/')!==0).map(r=>c.delete(r))))));self.clients.claim();});
// 그림(img/)은 바뀌지 않으니 캐시 먼저. 나머지는 네트워크 우선, 안 되면 캐시(오프라인용). 실패한 응답(404 등)은 캐시에 넣지 않는다
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(new URL(e.request.url).origin!==self.location.origin)return;/* GitHub 동기화 같은 다른 곳 요청은 건드리지 않는다: 인터넷이 끊겼을 때 캐시의 옛 기록을 내주면 그걸로 합쳐 올려 다른 기기 기록을 덮어쓴다(10-30 밤) */
  const put=r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;};
  if(e.request.url.indexOf('/img/')>=0){e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(put)));return;}
  e.respondWith(fetch(e.request).then(put).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
