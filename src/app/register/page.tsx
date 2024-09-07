"use client";

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Store, ReactNotifications } from 'react-notifications-component'; 
import 'react-notifications-component/dist/theme.css'; 
import Link from 'next/link';
import styles from '../styles/styles_modules/login_register.module.css';
import VanillaTilt from 'vanilla-tilt';
import ParticlesBackground from '../components/particles/ParticlesBackground';

export default function Regis() {
    // Estados para armazenar os valores dos campos do formulário
    const [name, setName] = useState(''); // Armazena o nome do usuário
    const [email, setEmail] = useState(''); // Armazena o email do usuário
    const [password, setPassword] = useState(''); // Armazena a senha do usuário
    const [confirmPassword, setConfirmPassword] = useState(''); // Armazena a confirmação da senha do usuário

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        // Verifica se algum campo está vazio
        if (!name || !email || !password || !confirmPassword) {
            // Exibe uma notificação de erro se algum campo estiver vazio
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
            return; // Interrompe o envio do formulário
        }

        // Verifica se as senhas coincidem
        if (password !== confirmPassword) {
            // Exibe uma notificação de erro se as senhas não coincidirem
            Store.addNotification({
                title: 'Erro',
                message: 'As senhas não coincidem!',
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
            return; // Interrompe o envio do formulário
        }

        // Define a URL da API para o registro do usuário
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/register`;

        try {
            // Envia os dados do formulário para a API
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }), // Converte os dados do formulário para JSON
            });

            if (response.ok) {
                const responseData = await response.text(); // Obtém a resposta da API como texto
                // Exibe uma notificação de sucesso
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
                // Reseta os campos do formulário
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                const errorMessage = await response.text(); // Obtém a mensagem de erro da API
                // Exibe uma notificação de erro
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
            // Exibe uma notificação de erro caso ocorra um erro na requisição
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
            console.error('Erro ao realizar cadastro:', error); // Loga o erro no console
        }
    };

    // Referência para o elemento do card, usada para aplicar o efeito de tilt
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            // Inicializa o efeito VanillaTilt no elemento do card
            VanillaTilt.init(cardRef.current, {
                speed: 11000, // Velocidade do efeito
                scale: 1.02, // Escala o card para um efeito de profundidade
                glare: false, // Desativa o efeito de brilho
                "max-glare": 0, // Define o brilho máximo como 0 para evitar desfoque
            });
        }
    });

    return (
        <>
            <ReactNotifications /> {/* Componente de notificações */}
            <main className={styles.main}>
                <div ref={cardRef} className={styles.form}> {/* Div com efeito de tilt */}
                    <form onSubmit={handleSubmit} method="post" className={styles.containerFormRegister}>
                        <div className={styles.containerRegister}>
                            <div className={styles.dataRegister}>
                                <h1 className={styles.title}>CADASTRE-SE</h1>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    placeholder="Digite seu nome" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className={styles.inputRegister} 
                                />
                                <input 
                                    type="text" 
                                    name="email" 
                                    id="email" 
                                    placeholder="Digite seu email" 
                                    autoComplete='email'
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className={styles.inputRegister} 
                                />
                                <input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="Crie uma senha" 
                                    autoComplete='new-password'
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className={styles.inputRegister} 
                                />
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    id="confirmPassword" 
                                    placeholder="Confirme sua senha" 
                                    autoComplete='new-password'
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className={styles.inputRegister} 
                                />
                                {/* Botão para submeter o formulário */}
                                <button type="submit" className={`${styles.inputRegister} ${styles.button}`}>Cadastrar</button>
                                <Link href="/login" className={styles.link}>Já tem uma conta? Faça login aqui.</Link> {/* Link para a página de login */}
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <ParticlesBackground/> {/* Componente de fundo com partículas */}
        </>
    );
}
