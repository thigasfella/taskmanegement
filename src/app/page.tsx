"use client"
import Link from "next/link";
import styles from "./styles/styles_modules/initial_page.module.css"
import ParticlesBackground from "./components/particles/ParticlesBackground"

// Componente principal da página inicial
export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <div>
          {/* Título principal da página */}
          <h1 className={styles.title}>Olá!</h1>
          {/* Subtítulo de boas-vindas com destaque para o nome da empresa */}
          <h2 className={styles.subtitle}>
            Seja bem vindo ao projeto do processo seletivo da <span className={styles.textMarc}>Jack Experts</span>
          </h2>
        </div>

        {/* Botões de navegação para login e cadastro */}
        <div className={styles.divBtn}>
          {/* Link para a página de login */}
          <Link href="/login" className={styles.linkBtn}>
            <button className={styles.btnLogin}>Efetuar Login</button>
          </Link>
          {/* Link para a página de cadastro */}
          <Link href="/register" className={styles.linkBtn}>
            <button className={styles.btnRegister}>Efetuar Cadastro</button>
          </Link>
        </div>
      </main>

      <footer>
        {/* Rodapé com texto de copyright */}
        <div className={styles.copyDiv}>
          <p className={styles.copyText}>&copy; Thiago Lopes - 2024</p>
        </div>
      </footer>

      {/* Componente de background com partículas animadas */}
      <ParticlesBackground/>
    </>
  );
}
