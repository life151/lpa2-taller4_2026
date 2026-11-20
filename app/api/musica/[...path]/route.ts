import { NextResponse } from 'next/server'

type Context = {params: Promise<{path: string[]}>}
async function forward(req: Request, {params}: Context) {
  const path = (await params).path.join('/')
  const valid = req.method === 'GET' ? /^(usuarios|canciones|usuarios\/\d+\/favoritos)$/ : /^(usuarios|canciones|favoritos)$/
  if (!valid.test(path)) return NextResponse.json({message:'Ruta desconocida.'},{status:404})
  const origin = req.headers.get('origin')
  if(req.method === 'POST' && origin && new URL(origin).host !== req.headers.get('host') && new URL(origin).host !== req.headers.get('x-forwarded-host')) return NextResponse.json({message:'Origen no permitido.'},{status:403})
  let body: string | undefined
  if(req.method === 'POST') {
    try { const data = await req.json(); const fields = path==='usuarios'?['nombre','email','password']:path==='canciones'?['titulo','artista','genero','duracion','año']:['usuario_id','cancion_id']; if(!fields.every(k=>typeof data[k]==='string'?data[k].trim().length>0 && data[k].length<=256:Number.isSafeInteger(data[k])&&data[k]>0)) throw Error(); const parsed = Object.fromEntries(fields.map(k=>[k,['duracion','año','usuario_id','cancion_id'].includes(k)?Number(data[k]):data[k]])); body=JSON.stringify(parsed) } catch {return NextResponse.json({message:'Revisa los datos del formulario.'},{status:400})}
  }
  try {
    const upstream = await fetch(`${(process.env.MUSIC_API_URL || 'http://localhost:8000').replace(/\/$/,'')}/api/${path}${new URL(req.url).search}`,{method:req.method,body,headers:{'Content-Type':'application/json'},cache:'no-store',signal:AbortSignal.timeout(7000),redirect:'follow'})
    const text=await upstream.text(); const data=text?JSON.parse(text):null
    if(!upstream.ok) return NextResponse.json({message:typeof data?.detail==='string'?data.detail:upstream.status===409?'El registro ya existe.':'La API rechazó la solicitud. Revisa los datos.'},{status:upstream.status})
    if(req.method==='GET'&&!Array.isArray(data)) throw Error(); return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}})
  } catch {return NextResponse.json({message:'No se pudo conectar con la API de música.'},{status:503})}
}
export {forward as GET,forward as POST}
