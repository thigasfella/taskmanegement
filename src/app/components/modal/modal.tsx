'use client'

import { FormEvent, useState, useEffect } from "react";
import ParticlesBackground from "../particles/ParticlesBackground";
import styles from '../../styles/styles_modules/taskdashboard.module.css';
import Image from 'next/image';
import Cookies from 'js-cookie';

/**
 * Propriedades do componente Modal.
 * 
 * @interface ModalProps
 * @property {() => void} onClose - Função chamada quando o modal deve ser fechado.
 * @property {number | null} taskId - ID da tarefa a ser carregada e editada.
 */
interface ModalProps {
    onClose: () => void;
    taskId: number | null;
}

/**
 * Componente Modal para visualização e atualização de tarefas.
 * 
 * @param {ModalProps} props - Propriedades passadas para o componente.
 * @returns {JSX.Element | null} - Componente Modal ou null se não estiver renderizando no cliente.
 */
export default function Modal({ onClose, taskId }: ModalProps) {
    const [title, setTitle] = useState<string>(''); // Estado para armazenar o título da tarefa
    const [description, setDescription] = useState<string>(''); // Estado para armazenar a descrição da tarefa
    const [isClient, setIsClient] = useState(false); // Estado para verificar se está renderizando no cliente
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

    useEffect(() => {
        // Marca o componente como renderizado no cliente
        setIsClient(true);
    }, []);

    // Obtém o token dos cookies
    const token = Cookies.get('token');

    useEffect(() => {
        if (taskId) {
            /**
             * Função assíncrona para buscar dados da tarefa.
             */
            const fetchTask = async () => {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/task/${taskId}`;
                try {
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });

                    if (response.ok) {
                        const task = await response.json();
                        
                        // Extração dos dados
                        const rowData = task.row;
                        if (rowData) {
                            // Extrai o título e a descrição de rowData, ignorando vírgulas, aspas e parênteses
                            const [titleExtracted, descriptionExtracted] = rowData.match(/[^,"()]+/g) || ['', ''];
                            setTitle(titleExtracted || '');
                            setDescription(descriptionExtracted || '');
                        } else {
                            console.error('Erro: Dados da tarefa estão vazios ou mal formatados.');
                        }
                    } else {
                        console.error('Erro ao buscar tarefa:', response.statusText);
                    }
                } catch (error) {
                    console.error('Erro ao buscar tarefa:', error);
                } finally {
                    setIsLoading(false);
                }
            }

            fetchTask();
        } else {
            setIsLoading(false);
        }
    }, [taskId]);
    

    /**
     * Manipulador de envio do formulário para atualizar a tarefa.
     * 
     * @param {FormEvent} event - Evento de submissão do formulário.
     */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!title || !description) {
            alert('Todos os campos devem ser preenchidos!')
            return;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/updateTask`;
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: taskId, title, description, token })
            });

            if (response.ok) {
                const responseData = await response.text();
                alert(responseData)
                setTitle('');
                setDescription('');
                onClose(); // Fecha o modal após a atualização

            } else {
                const errorMessage = await response.text();
                alert(errorMessage)
            }
        } catch (error) {
            alert('Erro ao atualizar a tarefa. Tente novamente.')
            console.error('Erro ao atualizar a tarefa:', error);
        }
    };

    if (!isClient) {
        return null; // Não renderiza no servidor
    }

    return (
        <>
            <div className={styles.containerModal}>
                <div className={styles.cardModal}>
                  <div className={styles.itemsModal}>
                    <form onSubmit={handleSubmit} className={styles.formModal}>
                        <div className={styles.containerinputs}>
                            <div className={styles.DivInputs}>
                                <div className={styles.divBtnModal}>
                                    {/* Botão para fechar o modal */}
                                    <button onClick={onClose} className={styles.btnTask}><Image src="/close.svg" alt="Icon" width={24} height={24} className={styles.icon} /></button>
                                </div>
                                <h1 className={`${styles.title} ${styles.titleModal}`}>ATUALIZE SUA TAREFA</h1>
                                {/* Campo para título da tarefa */}
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder={title ? '' : "Digite o título da tarefa"}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`${styles.input} ${styles.inputModal}`}
                                />
                                {/* Campo para descrição da tarefa */}
                                <textarea
                                    name="description"
                                    id="description"
                                    placeholder={description ? '' : "Escreva a descrição da tarefa"}
                                    autoComplete='off'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`${styles.textArea} ${styles.inputModal}`}
                                />
                                {/* Botão para enviar o formulário */}
                                <button type="submit" className={`${styles.button} ${styles.buttonRegisTask}`}>Atualizar Tarefa</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ParticlesBackground />
        </div>
        </>
    );
}
