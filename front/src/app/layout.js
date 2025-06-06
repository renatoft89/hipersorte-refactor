import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import "./globals.css";
import { Montserrat } from 'next/font/google'


const font = Montserrat({
  subsets: ['latin']
})

export const metadata = {
  title: "Hypersorte",
  description: "Crie o seu Jogo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <link
        rel="icon"
        href="/trevo.png?<generated>"
        type="image/<generated>"
        sizes="<generated>"
      />
      <body className={`${font.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
