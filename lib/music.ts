export type Song={id:number;titulo:string;artista:string;genero:string;duracion:number|string;audio_url?:string}
export type User={id:number;nombre:string;email:string}
export type View='Inicio'|'Usuarios'|'Canciones'|'Favoritos'
export const genres=['Pop','Rock','Electrónica','Urbano']
export const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
export const duration=(v:number|string)=>Number.isFinite(Number(v))?`${Math.floor(Number(v)/60)}:${String(Number(v)%60).padStart(2,'0')}`:String(v)
export async function api<T>(path:string,body?:unknown):Promise<T>{const res=await fetch('/api/musica/'+path,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:undefined); const data=await res.json(); if(!res.ok)throw new Error(data.message||'Error de conexión.');return data}
export async function favorites(id:number):Promise<Song[]>{const list=await api<(Song|{cancion:Song})[]>(`usuarios/${id}/favoritos`);return list.map(x=>'cancion' in x?x.cancion:x)}
