import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// Driving School Simulator 2.0 – procedural city, manual transmission and mobile controls.
const host=document.querySelector('#scene'), scene=new THREE.Scene();
scene.background=new THREE.Color(0x9fc4d2); scene.fog=new THREE.Fog(0x9fc4d2,85,330);
const camera=new THREE.PerspectiveCamera(66,innerWidth/innerHeight,.1,650);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace; host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe5f4ff,0x59624a,2.0));
const sun=new THREE.DirectionalLight(0xffefcf,2.6); sun.position.set(-40,65,25); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-55; sun.shadow.camera.right=55; sun.shadow.camera.top=70; sun.shadow.camera.bottom=-70; scene.add(sun);
const mat=(c,r=.8,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const mats={asphalt:mat(0x343a3e),grass:mat(0x52764c),line:mat(0xe9e4d2),tire:mat(0x101315),glass:new THREE.MeshStandardMaterial({color:0x75a6b6,roughness:.18,metalness:.15,transparent:true,opacity:.62}),white:mat(0xf2eee1),red:mat(0xb62d25),yellow:mat(0xe8c34b),concrete:mat(0x858b8b)};
const ground=new THREE.Mesh(new THREE.PlaneGeometry(900,900),mats.grass); ground.rotation.x=-Math.PI/2; ground.position.y=-.12; ground.receiveShadow=true; scene.add(ground);
// Long road with lane markings and sidewalks.
const road=new THREE.Mesh(new THREE.PlaneGeometry(18,620),mats.asphalt); road.rotation.x=-Math.PI/2; road.position.set(0,0,-180); road.receiveShadow=true; scene.add(road);
for(const x of [-8.7,8.7]){const curb=new THREE.Mesh(new THREE.BoxGeometry(.45,.18,620),mats.concrete);curb.position.set(x,.02,-180);scene.add(curb);}
for(let z=125;z>-485;z-=11){const d=new THREE.Mesh(new THREE.PlaneGeometry(.18,4.6),mats.white);d.rotation.x=-Math.PI/2;d.position.set(0,.018,z);scene.add(d)}
for(const x of [-8.05,8.05]){const e=new THREE.Mesh(new THREE.PlaneGeometry(.13,620),mats.white);e.rotation.x=-Math.PI/2;e.position.set(x,.02,-180);scene.add(e)}
// City blocks, sidewalks, trees, street lamps and road furniture.
const buildingMats=[mat(0xb9b5a9),mat(0x9eaaa9),mat(0xc6b7a3),mat(0x899da5),mat(0xb2a4a0)];
function box(parent,w,h,d,material,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
for(let i=0;i<34;i++){
 const z=115-i*17.5;
 for(const side of [-1,1]){
  const x=side*(18+(i%3)*4), w=9+(i%4)*2, h=8+(i%5)*3, dep=12+(i%3)*3;
  const b=box(scene,w,h,dep,buildingMats[i%buildingMats.length],x,h/2,z); 
  const roof=box(scene,w*.88,.35,dep*.88,mat(0x555e61),x,h+.18,z);
  const windowMat=mat(0x395a68,.28,.15);
  for(let yy=2.2;yy<h-1;yy+=2.4)for(let xx=-w/2+1.3;xx<w/2-0.6;xx+=2.2)box(scene,.95,1.15,.06,windowMat,x+xx,yy,z-side*(dep/2+.04));
  if(i%2===0){const trunk=box(scene,.28,2.1,.28,mat(0x59432e),side*11,1,z);const crown=new THREE.Mesh(new THREE.SphereGeometry(1.45,8,7),mat(0x376744));crown.position.set(side*11,3,z);scene.add(crown)}
 }
 // street lamps on alternating sides
 const lx=(i%2?1:-1)*10.2; const pole=new THREE.Mesh(new THREE.CylinderGeometry(.055,.08,5,7),mat(0x414b50));pole.position.set(lx,2.5,z);scene.add(pole);box(scene,.9,.09,.12,mat(0xe8dfb7),lx+(lx>0?-.35:.35),4.95,z);
}
// Cross streets and zebra crossings at intervals.
for(const z of [55,-125,-305]){
 const cross=new THREE.Mesh(new THREE.PlaneGeometry(70,10),mats.asphalt);cross.rotation.x=-Math.PI/2;cross.position.set(0,.006,z);scene.add(cross);
 for(let k=-5;k<=5;k++){const stripe=new THREE.Mesh(new THREE.PlaneGeometry(.75,5),mats.white);stripe.rotation.x=-Math.PI/2;stripe.position.set(k*1.25,.025,z+2);scene.add(stripe)}
}
// Road signs.
function sign(z,x,text,color){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,2.7,8),mat(0x687176));pole.position.set(x,1.35,z);scene.add(pole);const board=box(scene,1.15,1.05,.12,mat(color),x,2.75,z);board.userData.signText=text;return board}
sign(35,-10.2,'50',0xf4f0df); sign(-145,10.2,'30',0xf4f0df); sign(-325,-10.2,'50',0xf4f0df);
// Vehicle model – detailed procedural hatchback.
const car=new THREE.Group();scene.add(car);
const paint=mat(0x087b9b,.28,.58), dark=mat(0x172126,.55,.12), chrome=mat(0xb7c4c7,.25,.8), leather=mat(0x20292d,.85), lampMat=new THREE.MeshStandardMaterial({color:0xfff0c0,emissive:0x332200}), tailMat=new THREE.MeshStandardMaterial({color:0xff3028,emissive:0x4d0805});
box(car,2.05,.62,4.35,paint,0,.82,0); box(car,1.92,.22,1.25,paint,0,1.16,-1.45); box(car,1.68,.78,1.95,paint,0,1.48,.35);
// Glass panels and bumpers
box(car,1.48,.54,.055,mats.glass,0,1.55,-.66); box(car,1.48,.52,.055,mats.glass,0,1.55,1.34);
for(const x of [-.82,.82]){box(car,.055,.48,1.35,mats.glass,x,1.52,.32);box(car,.08,.38,.08,chrome,x*1.15,1.2,-.55)}
box(car,2.02,.18,.16,dark,0,.55,-2.18);box(car,2.02,.18,.16,dark,0,.55,2.18);
const wheelMeshes=[],frontWheels=[];
for(const x of [-1.03,1.03])for(const z of [-1.38,1.38]){const pivot=new THREE.Group();pivot.position.set(x,.47,z);car.add(pivot);const tire=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.23,20),mats.tire);tire.rotation.z=Math.PI/2;tire.castShadow=true;pivot.add(tire);const rim=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.245,16),chrome);rim.rotation.z=Math.PI/2;pivot.add(rim);for(let j=0;j<5;j++){const spoke=box(pivot,.04,.34,.035,chrome,0,0,0);spoke.rotation.x=j*Math.PI/5;}wheelMeshes.push(tire);if(z<0)frontWheels.push(pivot)}
for(const x of [-.72,.72]){box(car,.42,.16,.09,lampMat,x,.94,-2.19);box(car,.38,.16,.08,tailMat,x,.92,2.2)}
// Visible dashboard, seats, steering wheel and shifter in cockpit camera.
box(car,1.55,.16,.55,leather,0,1.18,.95);box(car,.12,.65,.12,dark,-.57,1.0,.1);box(car,.12,.65,.12,dark,.57,1.0,.1);
const steeringWheel=new THREE.Mesh(new THREE.TorusGeometry(.29,.045,8,24),dark);steeringWheel.position.set(-.48,1.48,.08);steeringWheel.rotation.x=.35;car.add(steeringWheel);
box(car,.16,.32,.16,leather,.45,1.08,.5);box(car,.1,.28,.1,chrome,.45,1.34,.5);
car.position.set(0,0,8);
// Traffic vehicles moving in the same direction and oncoming lane.
const traffic=[];
for(let i=0;i<8;i++){
 const g=new THREE.Group(), c=mat([0xc44c36,0xd4d7d4,0x3d596f,0xe0bd53][i%4],.35,.25);box(g,1.8,.58,3.8,c,0,.72,0);box(g,1.48,.65,1.65,mats.glass,0,1.27,-.05);
 for(const x of [-.91,.91])for(const z of [-1.15,1.15]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.16,12),mats.tire);w.rotation.z=Math.PI/2;w.position.set(x,.35,z);g.add(w)}
 g.position.set(i%2?3.5:-3.5,.0,-35-i*43);scene.add(g);traffic.push({mesh:g,speed: i%2?10+Math.random()*4:-(8+Math.random()*3),baseX:g.position.x});
}
// Controls and simulation state.
const state={speed:0,gear:'N',clutch:1,gas:0,brake:0,steer:0,rpm:850,engine:true,paused:true,camera:'cockpit',mode:'free',lesson:0,heading:0,signals:0,lights:false,handbrake:false,damage:0,score:100,blink:0,collisions:0};
const ratios={R:-3.3,N:0,1:3.7,2:6.6,3:9.8,4:13.2,5:16.8,6:20.2};
const $=id=>document.getElementById(id), message=t=>$('message').textContent=t;
function hud(){ $('speed').textContent=Math.round(Math.abs(state.speed)*3.6);$('gearReadout').textContent=state.gear;$('clutchPct').textContent=Math.round(state.clutch*100)+'%';$('clutchFill').style.height=(state.clutch*100)+'%';$('rpm').textContent=Math.round(state.rpm)+' RPM';$('rpmGauge').textContent=(state.rpm/1000).toFixed(1);$('engineStatus').parentElement.classList.toggle('stalled',!state.engine);$('statusText').textContent=state.engine?'MOTOR V CHODU':'MOTOR ZHASL';document.querySelectorAll('[data-gear]').forEach(b=>b.classList.toggle('selected',b.dataset.gear===state.gear));}
function gear(g){if(Math.abs(state.speed)>1.4){message('Před řazením úplně zpomal.');return}if(state.clutch<.75){message('Sešlápni spojku až na podlahu.');return}state.gear=g;hud();message(g==='N'?'Zařazen neutrál.':`Zařazeno ${g}.`)}
document.querySelectorAll('[data-gear]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();gear(b.dataset.gear)}));
function hold(id,key){const b=$(id),down=e=>{e.preventDefault();state[key]=1;b.classList.add('pressed');b.setPointerCapture?.(e.pointerId)},up=()=>{state[key]=0;b.classList.remove('pressed')};b.addEventListener('pointerdown',down);['pointerup','pointercancel','lostpointercapture'].forEach(v=>b.addEventListener(v,up))}
hold('gas','gas');hold('brake','brake');
const clutch=$('clutchTrack');let clutchId=null;function clutchMove(e){const r=clutch.getBoundingClientRect();state.clutch=THREE.MathUtils.clamp((e.clientY-r.top)/r.height,0,1);hud()}
clutch.addEventListener('pointerdown',e=>{e.preventDefault();clutchId=e.pointerId;clutch.setPointerCapture(e.pointerId);clutchMove(e)});clutch.addEventListener('pointermove',e=>{if(e.pointerId===clutchId)clutchMove(e)});['pointerup','pointercancel','lostpointercapture'].forEach(v=>clutch.addEventListener(v,()=>clutchId=null));
$('steerRange').addEventListener('input',e=>{state.steer=Number(e.target.value)/100;$('steering').style.transform=`rotate(${state.steer*450}deg)`});
$('cameraBtn').addEventListener('click',()=>{state.camera=state.camera==='cockpit'?'chase':'cockpit';$('cameraBtn').textContent='KAMERA: '+(state.camera==='cockpit'?'KOKPIT':'ZA AUTEM')});
$('mirrorBtn').addEventListener('click',()=>$('mirror').classList.toggle('hidden'));
function signal(n){state.signals=state.signals===n?0:n;$('leftSignal').classList.toggle('active',state.signals===-1);$('rightSignal').classList.toggle('active',state.signals===1)}
$('leftSignal').onclick=()=>signal(-1);$('rightSignal').onclick=()=>signal(1);
$('lightsBtn').onclick=()=>{state.lights=!state.lights;$('lightsBtn').classList.toggle('active',state.lights);message(state.lights?'Potkávací světla zapnuta.':'Světla vypnuta.')};
$('pauseBtn').onclick=()=>{state.paused=true;$('pauseOverlay').classList.remove('hidden')};$('resumeBtn').onclick=()=>{state.paused=false;$('pauseOverlay').classList.add('hidden')};
function reset(){state.speed=0;state.gear='N';state.clutch=1;state.engine=true;state.heading=0;state.steer=0;state.gas=0;state.brake=0;state.damage=0;car.position.set(0,0,8);car.rotation.set(0,0,0);$('steerRange').value=0;$('steering').style.transform='rotate(0deg)';hud()}
$('resetBtn').onclick=()=>{reset();state.paused=false;$('pauseOverlay').classList.add('hidden');message('Jízda resetována.')};
$('freeMode').onclick=()=>{state.mode='free';$('freeMode').classList.add('active');$('schoolMode').classList.remove('active')};$('schoolMode').onclick=()=>{state.mode='school';$('schoolMode').classList.add('active');$('freeMode').classList.remove('active')};
$('startBtn').onclick=()=>{state.paused=false;$('startOverlay').classList.add('hidden');$('lessonPanel').classList.toggle('hidden',state.mode!=='school');message('Sešlápni spojku, zařaď 1 a plynule pouštěj spojku.')};
const lessons=['Lekce 1: Rozjezd','Lekce 2: Řazení nahoru','Lekce 3: Brzdění a zastavení','Lekce 4: Blinkry a světla','Lekce 5: Bezpečná jízda'];
$('lessonBtn').onclick=()=>{state.lesson=(state.lesson+1)%lessons.length;$('lessonText').textContent=lessons[state.lesson];message(lessons[state.lesson])};
// Procedural engine audio – generated locally with Web Audio after first user interaction.
let audioCtx=null,engineOsc=null,engineGain=null;function startAudio(){if(audioCtx)return;try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();engineOsc=audioCtx.createOscillator();engineGain=audioCtx.createGain();const filter=audioCtx.createBiquadFilter();engineOsc.type='sawtooth';filter.type='lowpass';filter.frequency.value=420;engineOsc.connect(filter).connect(engineGain).connect(audioCtx.destination);engineGain.gain.value=.0001;engineOsc.start()}catch(e){}}
document.addEventListener('pointerdown',()=>{startAudio();audioCtx?.resume()},{once:true});
// Collision and off-road feedback.
function collision(){state.speed*=.35;state.damage=Math.min(100,state.damage+18);state.score=Math.max(0,state.score-15);state.collisions++;message('Kolize! Zpomal a drž se ve svém jízdním pruhu.');}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5))}addEventListener('resize',resize);
let last=performance.now();
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.04);last=now;state.blink+=dt;
 if(!state.paused){
  const gearRatio=ratios[state.gear]||0, engaged=1-state.clutch, movingGear=state.gear!=='N';
  const wheelSpeed=Math.abs(state.speed)*3.6, load=movingGear?Math.abs(gearRatio)*Math.max(0,wheelSpeed/Math.max(1,Math.abs(gearRatio)*8)):0;
  const targetRPM=state.engine?Math.min(6500,850+state.gas*5000+load*90):0;state.rpm+=(targetRPM-state.rpm)*Math.min(1,dt*5);
  if(state.engine&&movingGear&&engaged>.86&&state.gas<.08&&Math.abs(state.speed)<2&&state.rpm<720){state.engine=false;message('Motor zhasl – sešlápni spojku a nastartuj.');}
  if(!state.engine&&state.clutch>.92&&state.gas>.28){state.engine=true;state.rpm=950;message('Motor nastartoval.');}
  let accel=0;if(state.engine&&movingGear){const direction=Math.sign(gearRatio);const torque=state.gas*Math.min(1,Math.abs(gearRatio)/7)*5.2*engaged;accel=direction*torque-state.speed*(.12+Math.abs(state.speed)*.006);if(state.clutch>.08&&state.clutch<.92&&Math.abs(state.speed)<4)accel-=Math.sign(state.speed||direction)*(1-state.clutch)*1.7;}
  if(state.brake)accel-=Math.sign(state.speed||1)*state.brake*(5.5+Math.abs(state.speed)*.35);if(state.handbrake)accel-=Math.sign(state.speed||1)*8;
  if(!state.gas&&!state.brake)accel-=Math.sign(state.speed)*.38;
  state.speed=THREE.MathUtils.clamp(state.speed+accel*dt,-9,43);
  const steerFactor=Math.min(1,Math.abs(state.speed)/4);state.heading+=state.steer*state.speed*.018*steerFactor*dt;
  car.position.x-=Math.sin(state.heading)*state.speed*dt;car.position.z-=Math.cos(state.heading)*state.speed*dt;car.rotation.y=state.heading;car.rotation.z=-state.steer*Math.min(Math.abs(state.speed)/30,.09);
  frontWheels.forEach(w=>w.rotation.y=state.steer*.48);wheelMeshes.forEach(w=>w.rotation.x+=state.speed*dt*1.8);
  if(Math.abs(car.position.x)>7.2){state.speed*=Math.pow(.91,dt*60);if(Math.abs(car.position.x)>10){car.position.x=Math.sign(car.position.x)*10;message('Mimo vozovku! Vrať se do jízdního pruhu.')}}
  // Traffic world follows the player camera corridor and loops safely.
  for(const t of traffic){t.mesh.position.z+= (state.speed-t.speed)*dt*.45;if(t.mesh.position.z>car.position.z+35)t.mesh.position.z-=430;if(t.mesh.position.z<car.position.z-390)t.mesh.position.z+=430;const dx=Math.abs(t.mesh.position.x-car.position.x),dz=Math.abs(t.mesh.position.z-car.position.z);if(dx<1.8&&dz<2.9&&Math.abs(state.speed)>1.2){collision();t.mesh.position.z-=35}}
  // Collision against roadside furniture is approximated by road edge bounds.
  if(state.signals&&state.blink%1<.5){$('leftIndicator').style.opacity=state.signals===-1?1:.15;$('rightIndicator').style.opacity=state.signals===1?1:.15}else{$('leftIndicator').style.opacity=.15;$('rightIndicator').style.opacity=.15}
 }
 const cockpit=state.camera==='cockpit';const forward=new THREE.Vector3(-Math.sin(state.heading),0,-Math.cos(state.heading));
 const target=cockpit?new THREE.Vector3(car.position.x,car.position.y+1.82,car.position.z+.08):new THREE.Vector3(car.position.x+Math.sin(state.heading)*7,car.position.y+5.3,car.position.z+Math.cos(state.heading)*10);
 const look=cockpit?new THREE.Vector3(car.position.x+forward.x*18,car.position.y+1.45,car.position.z+forward.z*18):new THREE.Vector3(car.position.x+forward.x*8,car.position.y+1.1,car.position.z+forward.z*8);
 camera.position.lerp(target,.14);camera.lookAt(look);camera.fov=THREE.MathUtils.lerp(camera.fov,cockpit?70:62,.08);camera.updateProjectionMatrix();
 if(engineOsc&&audioCtx){engineOsc.frequency.setTargetAtTime(42+state.rpm*.045,audioCtx.currentTime,.08);engineGain.gain.setTargetAtTime(state.engine?Math.min(.055,.008+state.gas*.035):.0001,audioCtx.currentTime,.12)}
 $('lightIndicator').style.opacity=state.lights?1:.15;$('lightIndicator').style.color=state.lights?'#ffe9a6':'#ffffff';$('speedLimit').textContent=car.position.z<-120&&car.position.z>-220?'30':'50';hud();renderer.render(scene,camera);
}
requestAnimationFrame(animate);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
