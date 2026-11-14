(() => {
  const key='shici-pages-session-v1';
  let latest={};
  async function request(path,body) {
    const value=sessionStorage.getItem(key);
    if(!value){location.replace('./');throw Error('请先登录')}
    const response=await fetch(SHICI_API_ORIGIN+path,{method:body?'POST':'GET',credentials:'omit',cache:'no-store',
      headers:{Authorization:'Bearer '+value,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
    if(response.status===401){sessionStorage.removeItem(key);location.replace('./');throw Error('登录已过期，请重新登录')}
    const data=await response.json();
    if(!response.ok)throw Error(data.error||'请求失败，请重试');
    if(path==='/api/data')latest=data.progress;
    if(path==='/api/status')latest={...latest,[body.id]:body.status};
    if(path==='/api/restore')latest={...body.progress};
    return data;
  }
  async function downloadJson() {
    const data=await request('/api/data');
    const blob=new Blob([JSON.stringify({version:1,progress:data.progress},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),anchor=document.createElement('a');
    anchor.href=url;anchor.download='雅思词库学习进度.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  window.studyStore={request,read:()=>latest,downloadJson};
  document.getElementById('logout')?.addEventListener('click',async()=>{
    try{await request('/api/auth/logout',{})}finally{sessionStorage.removeItem(key);location.replace('./')}
  });
})();
