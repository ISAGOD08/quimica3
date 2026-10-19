const $=s=>document.querySelector(s);const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"").replace(/[–—_]/g,"-");
let cur=null,mode="study",quiz=null;
const pool=()=>TOPICS.flatMap(t=>t.q.map(q=>({t:t.title,q})));
function nav(){let h=TOPICS.map(t=>`<button data-id="${t.id}" class="${cur===t.id?'on':''}">${t.icon} ${t.title}<small>${t.q.length} preguntas</small></button>`).join("");
 h+=`<button data-id="final" class="final ${cur==='final'?'on':''}">🏁 Examen final<small>15 preguntas mezcladas</small></button>`;$("nav").innerHTML=h;
 $("nav").querySelectorAll("button").forEach(b=>b.onclick=()=>{cur=b.dataset.id;mode=cur==="final"?"practice":"study";quiz=null;render()})}
function render(){nav();const m=$("main");
 if(!cur){m.innerHTML=`<div class="card"><h3>Bienvenido 👋</h3><p>Elige un tema a la izquierda: estudia los puntos clave y luego practica con preguntas. Al final haz el examen final.</p></div>`;return}
 if(cur==="final"){if(!quiz)startQuiz(pool().sort(()=>Math.random()-.5).slice(0,15),"Examen final");return drawQuiz()}
 const t=TOPICS.find(x=>x.id===cur);
 m.innerHTML=`<div class="tabs"><button data-m="study" class="${mode==='study'?'on':''}">📖 Estudiar</button><button data-m="practice" class="${mode==='practice'?'on':''}">🎯 Practicar</button></div><div id="box"></div>`;
 m.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{mode=b.dataset.m;quiz=null;render()});
 if(mode==="study")$("#box").innerHTML=t.study.map(([a,b])=>`<div class="card"><h3>${a}</h3>${b==="chips"?`<div class="chips">${NAMES.map(n=>`<span>${n}</span>`).join("")}</div>`:`<p>${b}</p>`}</div>`).join("")+`<button class="btn" onclick="mode='practice';render()">Ir a practicar →</button>`;
 else{if(!quiz)startQuiz(t.q.map(q=>({t:t.title,q})).sort(()=>Math.random()-.5),t.title);drawQuiz()}}
function startQuiz(items,title){quiz={items,i:0,ok:0,done:false,title}}
function drawQuiz(){const box=$("#box")||$("main");const z=quiz;
 if(z.i>=z.items.length){const p=Math.round(100*z.ok/z.items.length);box.innerHTML=`<div class="card score"><p>${z.title}</p><b>${z.ok}/${z.items.length}</b><p>${p>=80?"¡Excelente! 🎉":p>=60?"Vas bien, repasa un poco 💪":"Vuelve a estudiar el tema y reintenta 📖"}</p><button class="btn" id="re">Reintentar</button> <button class="btn alt" id="st">Estudiar</button></div>`;
  $("#re").onclick=()=>{quiz=null;render()};$("#st").onclick=()=>{if(cur==="final"){cur=TOPICS[0].id}mode="study";quiz=null;render()};return}
 const {t,q}=z.items[z.i];const [txt,opts,ans,exp]=q;
 box.innerHTML=`<div class="card"><div class="meta"><span>${t}</span><span>${z.i+1} / ${z.items.length}</span></div><div class="bar"><i style="width:${100*z.i/z.items.length}%"></i></div><div class="q">${txt}</div><div id="a"></div><div id="fb"></div></div>`;
 const a=$("#a");
 const done=(good)=>{if(good)z.ok++;$("#fb").innerHTML=`<div class="fb ${good?'ok':'bad'}">${good?"✔ ¡Correcto! ":"✘ Incorrecto. "}${opts?"":`Respuesta: <b>${ans}</b>. `}${exp}</div><button class="btn" id="nx">${z.i+1<z.items.length?"Siguiente →":"Ver resultado"}</button>`;$("#nx").onclick=()=>{z.i++;drawQuiz()}};
 if(opts){opts.forEach((o,k)=>{const b=document.createElement("button");b.className="opt";b.textContent=o;b.onclick=()=>{a.querySelectorAll("button").forEach((x,j)=>{x.disabled=true;if(j===ans)x.classList.add("ok")});if(k!==ans)b.classList.add("bad");done(k===ans)};a.appendChild(b)})}
 else{a.innerHTML=`<input type="text" id="in" placeholder="Escribe tu respuesta" autocomplete="off"><button class="btn" id="ck">Comprobar</button>`;
  const go=()=>{const v=norm($("#in").value);if(!v)return;const good=v===norm(ans)||(ans.startsWith("1-")&&v===norm(ans.slice(2)));$("#in").disabled=true;$("#ck").remove();done(good)};$("#ck").onclick=go;$("#in").onkeydown=e=>{if(e.key==="Enter")go()};$("#in").focus()}}
render();
