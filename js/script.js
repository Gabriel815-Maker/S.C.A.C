const EMAIL="grupo4hackathon2026@gmail.com";
const apps=["VS Code","Documentos Google","Google Meet","GitHub","YouTube","Redes sociais","Jogos online"];
const perfis={
"Treinamento":[1,1,0,1,0,0,0],
"Reunião":[0,1,1,0,0,0,0],
"Documentação":[0,1,0,0,0,0,0],
"Livre":[1,1,1,1,1,1,1]};
const tabs=document.getElementById("tabs"),list=document.getElementById("sites"),log=document.getElementById("log");
function pintar(nome){
  [...tabs.children].forEach(b=>b.setAttribute("aria-selected",b.textContent===nome));
  [...list.children].forEach((li,i)=>{
    const ok=perfis[nome][i];
    li.className=ok?"ok":"no";
    li.lastChild.textContent=ok?"Liberado":"Bloqueado";
  });
  const n=perfis[nome].filter(Boolean).length;
  log.textContent="> Perfil \""+nome+"\" enviado a todos os computadores da rede\n> "+n+" liberados, "+(apps.length-n)+" bloqueados";
}
Object.keys(perfis).forEach(n=>{
  const b=document.createElement("button");
  b.type="button";b.setAttribute("role","tab");b.textContent=n;
  b.onclick=()=>pintar(n);tabs.appendChild(b);
});
apps.forEach(a=>{
  const li=document.createElement("li");
  li.innerHTML="<span></span><span class=\"st\"></span>";
  li.firstChild.textContent=a;list.appendChild(li);
});
pintar("Treinamento");

document.getElementById("copy").onclick=async e=>{
  try{await navigator.clipboard.writeText(EMAIL);e.target.textContent="Copiado!"}
  catch(_){e.target.textContent="Copie manualmente"}
  setTimeout(()=>e.target.textContent="Copiar e-mail",2200);
};

const form=document.getElementById("form"),status=document.getElementById("status"),send=document.getElementById("send");
function aviso(tipo,html){status.className=tipo;status.innerHTML=html}
form.onsubmit=async e=>{
  e.preventDefault();
  const f=new FormData(form);
  const nome=(f.get("nome")||"").trim(),email=(f.get("email")||"").trim(),empresa=(f.get("empresa")||"").trim(),msg=(f.get("msg")||"").trim();
  if(!nome||!msg||!/^\S+@\S+\.\S+$/.test(email)){
    aviso("err","Preencha seu nome, um e-mail válido e a mensagem para enviar.");
    return;
  }
  if(f.get("_honey")){return}
  send.disabled=true;send.textContent="Enviando...";aviso("","");
  try{
    const r=await fetch("https://formsubmit.co/ajax/"+EMAIL,{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({
        "Nome":nome,
        "E-mail":email,
        "Empresa":empresa||"Não informada",
        "Mensagem":msg,
        "email":email,
        "_subject":"Novo contato pelo site S.C.A.C: "+nome,
        "_template":"table",
        "_captcha":"false"
      })
    });
    const d=await r.json();
    if(!r.ok||String(d.success)!=="true"){throw new Error(d.message||"falha")}
    form.reset();
    aviso("ok","Mensagem enviada! A nossa equipe responde no e-mail que você informou.");
  }catch(_){
    const corpo="Nome: "+nome+"\nEmail: "+email+"\nEmpresa: "+empresa+"\n\n"+msg;
    const link="mailto:"+EMAIL+"?subject="+encodeURIComponent("Quero conhecer o S.C.A.C")+"&body="+encodeURIComponent(corpo);
    aviso("err","Não conseguimos enviar agora. <a href=\""+link+"\">Clique aqui para enviar pelo seu programa de e-mail</a>.");
  }finally{
    send.disabled=false;send.textContent="Enviar para a equipe";
  }
};
