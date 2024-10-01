import "./globals.css";
import { Montserrat} from 'next/font/google'


const font = Montserrat({
  subsets: ['latin']
})

export const metadata = {
  title: "Hipersorte",
  description: "Crie o seu Jogo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={font.className}
      >
        {children}
      </body>
    </html>
  );
}
