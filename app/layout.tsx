import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/inter/index.css'
import './globals.css'
export const metadata:Metadata={title:'MusicaApp · Tu universo musical',description:'Explora canciones, organiza tu biblioteca y descubre tus favoritos.',icons:{icon:'/mark.svg'}}
export const viewport:Viewport={colorScheme:'dark',themeColor:'#0F0F0F'}
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body className="antialiased">{children}</body></html>}
