'use client'

import { useEffect, useState } from 'react'
import Nav from '../components/nav/Nav'
import styles from '../styles/styles_modules/taskdashboard.module.css'
import Image from 'next/image';
import Modal from '../components/modal/modal';
import Cookies from 'js-cookie';

// Definindo as propriedades da task e seus tipos
interface Task {
    id: number;
    name: string;
    description: string;
    iscompleted: boolean;
}

export default function TaskDashboard() {
    // Estado para armazenar as tasks
    const [tasks, setTasks] = useState<Task[]>([])
    // Estado para controlar a visibilidade do modal
    const [isVisible, setIsVisible] = useState(false)
    // Estado para armazenar o ID da task selecionada para edição
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
    // useEffect para buscar as tasks da API ao carregar o componente ou quando isVisible é atualizado

    // Obtém o token dos cookies
    const token = Cookies.get('token');

    useEffect(() => {


        
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`;

        const fetchTasks = async () => {
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // token no cabeçalho Authorization
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setTasks(data) // Atualiza o estado com as tasks recebidas da API
                } else {
                    console.error('Erro ao buscar tasks:', response.statusText)
                }
            } catch (error) {
                console.error('Erro ao buscar tasks:', error)
            }
        }

        fetchTasks()
        
        // isVisible é usado como dependência para atualizar as tasks em tempo real ao alterar a visibilidade do modal
    }, [isVisible])

    // Função para excluir uma task usando a rota DELETE da API
    const deleteTask = async (taskId: number) => {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/deleteTask`;

        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: taskId, token }) // Envia o ID da task a ser deletada no corpo da requisição
            });

            if (response.ok) {
                // Remove a task deletada do estado
                setTasks(tasks.filter(task => task.id !== taskId));
            } else {
                console.error('Erro ao deletar a tarefa:', response.statusText);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

 // Função assíncrona que alterna o status de conclusão de uma tarefa
const toggleTaskCompletion = async (taskId: number) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/completionTask`; // URL da API, obtida da variável de ambiente

    const taskToUpdate = tasks.find(task => task.id === taskId); // Encontra a tarefa correspondente ao ID fornecido
    if (!taskToUpdate) return; // Se a tarefa não for encontrada, a função retorna sem realizar nenhuma ação

    try {
        // Envia uma requisição PUT para a API com o status de conclusão da tarefa
        const response = await fetch(apiUrl, {
            method: 'PUT', // Método HTTP PUT para atualizar a tarefa
            headers: {
                'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
            },
            body: JSON.stringify({ 
                id: taskId, // ID da tarefa a ser atualizada
                iscompleted: !taskToUpdate.iscompleted, // Alterna o status 'iscompleted' da tarefa
                token
            })
        });

        if (response.ok) {
            const updatedTask = await response.json(); // Converte a resposta JSON da API para um objeto JavaScript

            if (updatedTask) {
                // Atualiza o estado das tarefas, modificando apenas a tarefa cujo ID foi alterado
                setTasks(tasks.map(task => 
                    task.id === taskId ? { ...task, iscompleted: updatedTask.iscompleted } : task
                ));
            } else {
                console.error('Resposta vazia do servidor.'); // Exibe um erro se a resposta estiver vazia
            }
        } else {
            const error = await response.text(); // Captura a resposta de erro do servidor
            console.error('Erro ao atualizar a tarefa:', error); // Exibe o erro no console
        }
    } catch (error) {
        console.error('Erro na requisição:', error); // Exibe erros relacionados à requisição no console
    }
};
    


    // Função para tratar o clique no botão de editar, setando o ID da task selecionada e tornando o modal visível
    const handleEditClick = (taskId: number) => {
        setSelectedTaskId(taskId);
        setIsVisible(true);
    }

    // Função para alternar a visibilidade do modal (abrir/fechar)
    const toggleModal = () => {
        setIsVisible(prev => !prev)
    }

    return (
        <>
            <header>
                <Nav />
            </header>
            <main>
                <div className={styles.containerDivTasks}>
                    <div className={styles.divTasks}>
                        <h1 className={styles.title}>SUAS TAREFAS</h1>
                        {tasks.length > 0 ? (
                            tasks.map(task => (
                                <div key={task.id} className={`${styles.taskCard} ${task.iscompleted ? styles.completedCard : ''}`}>
                                    <div className={styles.contentTask}>
                                    <h1 className={`${styles.titleTask} ${task.iscompleted ? styles.completed : ''}`}>{task.name}</h1>
                                        <p className={`${styles.subtitleTask} ${task.iscompleted ? styles.completed : ''}`}>{task.description}</p>
                                    </div>
                                    <div className={styles.containerBtnTasks}>
                                        {/* Botão para editar a task, acionando o modal */}
                                        <button onClick={() => handleEditClick(task.id)} className={`${styles.btnTask} ${task.iscompleted ? styles.btnHidden : ''}`}>
                                            <Image src="/edit.svg" alt="Icon" width={24} height={24} className={styles.icon} />
                                        </button>
                                        {/* Botão para excluir a task, com confirmação do usuário */}
                                        <button onClick={() => {
                                            if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
                                                deleteTask(task.id);
                                            }
                                        }} className={styles.btnTask}>
                                            <Image src="/lixeira.svg" alt="Icon" width={24} height={24} className={styles.icon} />
                                        </button>

                                        <button onClick={() => toggleTaskCompletion(task.id)} className={styles.btnTask}>
                                            <Image src="/check.svg" alt="Icon" width={24} height={24} className={styles.icon} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.notFoundTask}>Nenhuma atividade encontrada</p>
                        )}
                    </div>
                </div>
                {/* Renderiza o modal apenas se isVisible for true */}
                {isVisible && (
                    <Modal onClose={toggleModal} taskId={selectedTaskId} />
                )}
            </main>
            
        </>
    )
}
