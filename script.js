const LV=[['ファイブスロット',0,0],['フォーリンク',1,0],['ハーフライフ',2,180],['ワンヘッド',3,180]];
const N=s=>s.normalize('NFKC').replace(/\s/g,'').toLowerCase();
const E=[],M=new Map(),$=id=>document.getElementById(id);
GROUPS.forEach((t,g)=>t.trim().split('\n').forEach(l=>{
  let d='';l=l.replace(/《(.*)》/,(_,x)=>(d=x,''));
  const[a,al]=l.split('=');let name=a;const keys=[];
  if(a.includes('|')){const[s,n]=a.split('|');name=s+n;keys.push(s)}
  keys.push(name,...(al?al.split(','):[]));
  const i=E.length;E.push({name,d,g});keys.forEach(k=>M.set(N(k),i));
}));
let lv,used,miss,ok,turns,tm,rem,on,drop;
const show=id=>document.querySelectorAll('section').forEach(s=>s.hidden=s.id!==id);
const lock=b=>{$('in').disabled=$('ok').disabled=b};
const say=(id,t,d)=>{const e=$(id);e.textContent=t;if(d){const s=document.createElement('small');s.textContent=d;e.append(s)}};
document.querySelectorAll('#levels button').forEach((b,i)=>b.onclick=()=>{
  lv=i;const[n,,t]=LV[i];$('lvname').textContent=n;
  $('lvtime').textContent=t?'1回答'+t/60+'分の制限時間あり':'制限時間なし';show('intro')});
$('go').onclick=()=>{used=[];
  const pool=E.map((_,i)=>i).filter(i=>E[i].g<=lv);
  drop=new Set(pool.map(i=>[Math.random(),i]).sort((a,b)=>a[0]-b[0]).slice(0,Math.round(pool.length*.1)).map(x=>x[1]));
  miss=ok=turns=0;$('list').innerHTML='';say('bc','');say('bm','');$('miss').textContent=0;show('game');mine()};
function mine(){
  if(used.length>=E.length)return end(1,'答えが全部出切りました');
  turns++;on=1;lock(false);$('in').focus();$('msg').textContent='あなたの番です';
  clearInterval(tm);const t=LV[lv][2];
  if(t){rem=t;tick();tm=setInterval(tick,1000)}else $('time').textContent='制限なし';
}
function tick(){$('time').textContent=Math.floor(rem/60)+':'+String(rem%60).padStart(2,'0');if(rem--<=0){clearInterval(tm);end(0,'時間切れです')}}
$('f').onsubmit=e=>{
  e.preventDefault();if(!on)return;const v=$('in').value;if(!N(v))return;const k=M.get(N(v));
  if(k===undefined){$('miss').textContent=++miss;if(miss>3)return end(0,'誤答が4回に達しました');
    $('msg').textContent='対象キャラにいません';$('in').select();return}
  clearInterval(tm);on=0;$('in').value='';
  if(used.includes(k)){say('bm',E[k].name);return end(0,'すでに出た言葉です')}
  put(k,0);ok++;cpu();
};
function put(k,w){
  used.push(k);const e=E[k];say(w?'bc':'bm',e.name,w?e.d:'');
  const li=document.createElement('li');li.className=w?'c':'m';li.textContent=e.name;
  $('list').append(li);$('list').scrollTop=1e9;
}
function cpu(){
  if(used.length>=E.length)return end(1,'答えが全部出切りました');
  turns++;lock(true);$('msg').textContent='';say('bc','…');
  const n=used.length,area=E.map((_,i)=>i).filter(i=>E[i].g<=lv&&!drop.has(i)&&!used.includes(i));
  setTimeout(()=>{
    if(!area.length){const k=used[Math.random()*n|0];say('bc',E[k].name,E[k].d);
      return setTimeout(()=>end(1,'相手が同じ言葉を言いました'),1200)}
    put(area[Math.random()*area.length|0],1);mine();
  },3000);
}
function end(w,r){
  clearInterval(tm);on=0;lock(true);$('msg').textContent=w?'勝利！':'敗北…';
  setTimeout(()=>{
    const n=LV[lv][0];$('rtW').toggleAttribute('hidden',!w);$('rtL').toggleAttribute('hidden',!!w);$('rtE').textContent=w?'WIN':'LOSE';$('result').className=w?'win':'lose';$('rr').textContent=r;
    $('rl').textContent=n;$('ro').textContent=ok;$('rn').textContent=turns;
    const t=`【非公式】JB古今東西ゲームで【${n}】に${w?'勝利しました！':'敗北しました…'}`;
    $('x').href='https://twitter.com/intent/tweet?text='+encodeURIComponent(t)+'&url='+encodeURIComponent(location.href.split('#')[0]);
    show('result');
  },1500);
}
$('back').onclick=$('back2').onclick=()=>show('start');
