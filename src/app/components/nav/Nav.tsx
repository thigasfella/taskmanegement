import styles from '../../styles/styles_modules/taskdashboard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * Componente de navegação.
 * 
 * @returns JSX.Element - Componente que exibe a barra de navegação e o botão de logout.
 */
export default function Nav() {
    const { push } = useRouter();

    /**
     * Função para realizar o logout do usuário.
     * 
     * @param cookie - Nome do cookie a ser removido
     */
    function logout(cookie: string) {
        // Remove o cookie definindo sua data de expiração para o passado
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        // Redireciona o usuário para a página de login
        push('/login');
    }

    return (
        <>
            <nav>
                <div className={styles.navDiv}>
                    {/* Botão para realizar logout */}
                    <button onClick={() => logout('token')} className={`${styles.btnTask} ${styles.btnLogout}`}>
                        <Image src="/logout.svg" alt="Icon" width={24} height={24} className={styles.icon} />
                    </button>
                    {/* Link para a página de dashboard */}
                    <Link href={'/TaskDashboard'} className={styles.link}>Inicio</Link>
                    {/* Link para a página de criação de tarefas */}
                    <Link href={'/CreateTask'} className={styles.link}>Criar tarefa</Link>
                </div>
            </nav>
        </>
    );
}
