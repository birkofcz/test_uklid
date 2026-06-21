
const MODES={normal:["Usušit dřez a okolí","Setřít kuchyňské plochy","Rozvěsit mokré ručníky","Zkontrolovat mokré hadry","Krátce vyvětrat","Zkontrolovat Winix","Vynést plný koš"],
low_energy:["Usušit dřez a okolí","Rozvěsit mokré ručníky","Zkontrolovat mokré hadry","Krátce vyvětrat"],
sick:["Usušit dřez a okolí","Rozvěsit mokré ručníky","Krátce vyvětrat","Winix na vyšší výkon","Dezinfikovat kliky","Samostatný ručník nemocného"]};
const WEEKLY={1:["Pondělí – Textilie",["Vyměnit ručník na ruce","Vyměnit osušku rodiče","Vyměnit dětské osušky","Vyměnit kuchyňské utěrky","Vyprat použité ručníky","Vyprat použité utěrky","Vyprat použité hadříky","Zkontrolovat zásobu čistých ručníků"]],
2:["Úterý – Prach a vzduch",["Otřít TV stolek","Otřít police","Otřít parapety","Otřít noční stolky","Otřít plochy v dětském pokoji","Zkontrolovat Winix","Zkontrolovat vlhkost","Vyvětrat ložnice"]],
3:["Středa – Koupelna",["Vyčistit WC mísu","Vyčistit WC prkénko","Vyčistit splachovadlo","Vyčistit umyvadlo","Vyčistit baterie","Vyčistit vanu","Vyčistit odtok vany","Otřít koupelnové kliky"]],
4:["Čtvrtek – Kuchyň a dřez",["Dezinfikovat dřez","Vyčistit odtok dřezu","Vyčistit pracovní desku","Otřít madla skříněk","Otřít lednici zvenku","Zkontrolovat hadříky","Zkontrolovat houbičky"]],
5:["Pátek – Podlahy",["Vysát obývací pokoj","Vysát ložnici","Vysát dětský pokoj","Vysát chodbu","Vytřít byt","Zkontrolovat rohy","Zkontrolovat prostor pod nábytkem"]],
0:["Neděle – Týdenní reset",["Prolít kuchyňský odpad horkou vodou","Prolít koupelnový odpad horkou vodou","Prolít WC umyvadlo horkou vodou","Vynést všechny koše","Připravit čisté ručníky","Zkontrolovat zásoby Sanytolu","Zkontrolovat prací prostředky"]]};
const FORT=["Povlečení rodiče","Povlečení děti","Vyměnit povlaky polštářů","Vysát matrace"];
const MONTH=["Parní čištění koupelny","Parní čištění WC","Vyčistit spáry","Vyčistit Winix předfiltry","Vyčistit Winix mřížky","Vyčistit nádobu Dyson","Zkontrolovat filtr Dyson","Dezinfikovat odpady","Vyprat deky","Vyprat přehozy"];
const SEASON=["Kontrola filtrů Winix","Výměna filtrů dle potřeby","Vyčistit Dyson ventilátory","Vyčistit sifony","Vyprat polštáře","Vyprat přikrývky","Vyprat chrániče matrací","Zkontrolovat okna","Zkontrolovat rohy místností","Kontrola případných plísní"];
const sel=document.getElementById("mode");
[["normal","🟢 Normální režim"],["low_energy","🟡 Nízká energie"],["sick","🔴 Nemoc"]].forEach(x=>{let o=document.createElement("option");o.value=x[0];o.textContent=x[1];sel.appendChild(o)});
sel.value=localStorage.mode||"normal";
function key(id){return "bp_"+id}
function cb(id,label){const c=localStorage.getItem(key(id))==="1"?"checked":""; return `<label><input data-id="${id}" type="checkbox" ${c}> ${label}</label>`}
function render(){
localStorage.mode=sel.value;
let day=new Date().getDay(); let w=WEEKLY[day]||["Sobota – Regenerační den",[]];
let fortDate=localStorage.fort_last||"1970-01-01";
let activeFort=(Date.now()-new Date(fortDate).getTime())/86400000>=14;
document.getElementById("banner").innerHTML= sel.value==="low_energy"?"🟡 Dnes stačí splnit denní checklist a hlavní blok.":sel.value==="sick"?"🔴 Zaměřte se pouze na hygienické minimum.":"";
document.getElementById("today").innerHTML=`<h2>📌 Dnes</h2><h3>Denní checklist</h3>${MODES[sel.value].map((t,i)=>cb("d"+i,t)).join("")}<h3>${w[0]}</h3>${w[1].map((t,i)=>cb("w"+day+"_"+i,t)).join("")}${activeFort?'<h3>📅 Každých 14 dní</h3>'+FORT.map((t,i)=>cb("f"+i,t)).join(""):'<p>Další 14denní údržba později.</p>'}`;
let lib="";
Object.values(WEEKLY).forEach(v=>lib+=`<details><summary>${v[0]}</summary>${v[1].join("<br>")}</details>`);
lib+=`<details><summary>Měsíční údržba</summary>${MONTH.join("<br>")}</details>`;
lib+=`<details><summary>Sezónní údržba</summary>${SEASON.join("<br>")}</details>`;
document.getElementById("library").innerHTML=lib;
bind(); update();
}
function bind(){document.querySelectorAll("input[type=checkbox]").forEach(x=>x.onchange=()=>{localStorage.setItem(key(x.dataset.id),x.checked?"1":"0"); update();});}
function update(){
let all=[...document.querySelectorAll("input[type=checkbox]")]; let done=all.filter(x=>x.checked).length; let pct=all.length?Math.round(done/all.length*100):0;
document.getElementById("overall").value=pct; document.getElementById("overallText").textContent=pct+"%";
document.getElementById("status").textContent=done===0?"🏠 Systém připraven":pct>80?"🟢 Výborný stav":pct>50?"🟡 Potřebuje pozornost":"🟠 Probíhá plnění";
document.getElementById("history").innerHTML="Lokální historie bude vznikat používáním aplikace.";
}
sel.onchange=render; render();
