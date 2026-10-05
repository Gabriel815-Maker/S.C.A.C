const EMAIL="grupo4hackathon2026@gmail.com";
const apps=["VS Code","Documentos Google","Google Meet","GitHub","YouTube","Redes sociais","Jogos online"];
const perfis={
"Aula de programação":[1,1,0,1,0,0,0],
"Reunião":[0,1,1,0,0,0,0],
"Prova":[0,1,0,0,0,0,0],
"Livre":[1,1,1,1,1,1,1]};
const tabs=document.getElementById("tabs"),list=document.getElementById("sites"),log=document.getElementById("log");
let atual="Aula de programação";
function pintar(nome){
  atual=nome;
  [...tabs.children].forEach(b=>b.setAttribute("aria-selected",b.textContent===nome));
  [...list.children].forEach((li,i)=>{
    const ok=perfis[nome][i];
    li.className=ok?"ok":"no";
    li.lastChild.textContent=ok?"Liberado":"Bloqueado";
  });
  const n=perfis[nome].filter(Boolean).length;
  log.textContent="> Perfil \""+nome+"\" enviado a 12 computadores\n> "+n+" liberados, "+(apps.length-n)+" bloqueados";
  log.style.whiteSpace="pre-line";
}
Object.keys(perfis).forEach(n=>{
  const b=document.createElement("button");
  b.type="button";b.role="tab";b.textContent=n;
  b.onclick=()=>pintar(n);tabs.appendChild(b);
});
apps.forEach(a=>{
  const li=document.createElement("li");
  li.innerHTML="<span></span><span class=\"st\"></span>";
  li.firstChild.textContent=a;list.appendChild(li);
});
pintar(atual);
document.getElementById("copy").onclick=async e=>{
  try{await navigator.clipboard.writeText(EMAIL);e.target.textContent="Copiado!"}
  catch(_){e.target.textContent="Copie manualmente"}
  setTimeout(()=>e.target.textContent="Copiar e-mail",2200);
};
document.getElementById("form").onsubmit=e=>{
  e.preventDefault();
  const f=new FormData(e.target);
  const corpo="Nome: "+f.get("nome")+"\nEmpresa: "+f.get("empresa")+"\n\n"+f.get("msg");
  location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Quero conhecer o S.C.A.C")+"&body="+encodeURIComponent(corpo);
};
