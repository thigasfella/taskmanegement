'use client'

import { FormEvent, useState } from "react";
import Nav from "../components/nav/Nav";
import { Store, ReactNotifications } from 'react-notifications-component'; 
import 'react-notifications-component/dist/theme.css'; 
import styles from '../styles/styles_modules/taskdashboard.module.css'
import Cookies from 'js-cookie';

export default function CreateTask(){
    // Estado para armazenar o título da tarefa
    const [title, setTitle] = useState('');

    // Estado para armazenar a descrição da tarefa
    const [description, setDescription] = useState('');

    /**
     * Manipulador do evento de envio do formulário.
     * 
     * @param event - Evento de submissão do formulário
     */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Verifica se todos os campos foram preenchidos
        if(!title || !description){
            Store.addNotification({
                title: 'Erro',
                message: 'Todos os campos devem ser preenchidos!',
                type: 'danger',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
            return;
        }   

        // Obtém o token dos cookies
        const token = Cookies.get('token');

        // URL da API para criar a tarefa
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/createtask`;
        try {
            // Faz a requisição para criar a tarefa
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, token })
            });

            // Verifica se a resposta foi bem-sucedida
            if(response.ok){
                const responseData = await response.text();
                Store.addNotification({
                    title: 'Sucesso',
                    message: responseData,
                    type: 'success',
                    insert: 'top',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                        duration: 9000,
                        onScreen: true
                    }
                });
                // Limpa os campos do formulário após o sucesso
                setTitle('');
                setDescription('');
            } else {
                // Exibe uma mensagem de erro se a resposta não for bem-sucedida
                const errorMessage = await response.text();
                Store.addNotification({
                    title: 'Erro',
                    message: errorMessage,
                    type: 'danger',
                    insert: 'top',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
            }
        } catch (error) {
            // Exibe uma mensagem de erro se ocorrer uma exceção
            Store.addNotification({
                title: 'Erro',
                message: 'Erro ao realizar cadastro. Tente novamente.',
                type: 'danger',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
            console.error('Erro ao criar tarefa:', error);
        }
    }

    return(
        <>
        <ReactNotifications />
            <header>
                <Nav/>
            </header>
            <main>
                <div className={styles.containerForm}>
                    <form onSubmit={handleSubmit} method="post" className={styles.form}>
                        <div className={styles.containerinputs}>
                            <div className={styles.DivInputs}>
                                <h1 className={styles.title}>REGISTRE SUA TAREFA</h1>
                                <input 
                                    type="text" 
                                    name="title" 
                                    id="title" 
                                    placeholder="Digite o título da tarefa" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    className={styles.input} 
                                />
                                <textarea 
                                    name="description" 
                                    id="description" 
                                    placeholder="Escreva a descrição da tarefa" 
                                    autoComplete='email'
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    className={styles.textArea} 
                                />
                                <button type="submit" className={`${styles.button} ${styles.buttonRegisTask}`}>Criar Tarefa</button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}
