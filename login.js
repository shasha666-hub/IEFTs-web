const form=document.getElementById('form'),button=document.getElementById('submit'),error=document.getElementById('error');
const sessionKey='shici-pages-session-v1';
button.disabled=false;button.textContent='登录词库';
const saved=sessionStorage.getItem(sessionKey);
if(saved)fetch(SHICI_API_ORIGIN+'/api/auth/status',{headers:{Authorization:'Bearer '+saved},credentials:'omit',cache:'no-store'})
  .then(response=>response.json()).then(status=>{if(status.authenticated)location.replace('./app.html');else sessionStorage.removeItem(sessionKey)}).catch(()=>{});
form.addEventListener('submit',async event=>{
  event.preventDefault();error.textContent='';button.disabled=true;
  try{
    const response=await fetch(SHICI_API_ORIGIN+'/api/auth/login',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username:form.elements.username.value.trim(),password:form.elements.password.value})});
    const data=await response.json();
    if(!response.ok)throw Error(data.error||'登录失败，请重试');
    if(!/^[a-f0-9]{64}$/.test(data.sessionToken||''))throw Error('登录服务未返回有效会话，请稍后重试');
    sessionStorage.setItem(sessionKey,data.sessionToken);form.reset();location.replace('./app.html');
  }catch(e){error.textContent=e.message==='Failed to fetch'?'无法连接登录服务，请检查网络后重试':e.message;button.disabled=false}
});
