export const onRequest=async({request,env,next}:any)=>{
  const u=new URL(request.url),ap:string|undefined=env.ADMIN_PATH;
  if(u.pathname.startsWith('/_admin'))return new Response('Not found',{status:404});
  if(ap&&u.pathname===ap)return Response.redirect(u.origin+ap+'/',308);
  if(ap&&u.pathname===ap+'/'){
    const r=await env.ASSETS.fetch(new URL('/_admin/',u));
    return new Response(r.body,{headers:{'content-type':'text/html;charset=utf-8','x-robots-tag':'noindex','cache-control':'no-store'}});
  }
  if(ap&&u.pathname===ap+'/app.js'){
    const r=await env.ASSETS.fetch(new URL('/_admin/app.js',u));
    return new Response(r.body,{headers:{'content-type':'text/javascript;charset=utf-8','cache-control':'no-store'}});
  }
  return next();
};
