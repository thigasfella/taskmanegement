"use client";

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Store, ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/styles_modules/login_register.module.css';
import VanillaTilt from 'vanilla-tilt';
import jwt from "jsonwebtoken";
import ParticlesBackground from '../components/particles/ParticlesBackground';

/**
 * Componente de Login.
 * 
 * Este componente exibe um formulário de login e lida com a autenticação do usuário.
 * Após o login, um token é enviado por e-mail e deve ser inserido na área de token para completar o login.
 */
export default function Login() {
  const [email, setEmail] = useState(''); // Estado para armazenar o e-mail do usuário
  const [password, setPassword] = useState(''); // Estado para armazenar a senha do usuário
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar a visibilidade do formulário de login
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a visibilidade do modal de token
  const [token, setToken] = useState(''); // Estado para armazenar o token inserido pelo usuário
  const [generatedToken, setGeneratedToken] = useState(''); // Estado para armazenar o token gerado e enviado por e-mail

  const { push } = useRouter(); // Hook para navegação

  /**
   * Função para lidar com o envio do formulário de login.
   * 
   * Envia uma solicitação POST para a API de login e lida com a resposta,
   * exibindo notificações apropriadas.
   * @param event - Evento de submissão do formulário
   */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Verifica se todos os campos estão preenchidos
    if (!email || !password) {
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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/login`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Verifica se a resposta da API é bem-sucedida
      if (response.ok) {
        const responseData = await response.json();
        Store.addNotification({
          title: 'Informação',
          message: 'Por gentileza, copie e cole o token enviado no email na área de token e envie para acessar a página!',
          type: 'info',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
        Store.addNotification({
          title: 'Sucesso',
          message: "Token enviado no email!",
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
        setGeneratedToken(responseData.token);
        setEmail('');
        setPassword('');
        setIsVisible(false);
        setIsModalOpen(true);
      } else {
        // Trata erros retornados pela API
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
      // Trata erros de rede ou outros erros
      Store.addNotification({
        title: 'Erro',
        message: 'Erro ao realizar login. Tente novamente.',
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
  };

  /**
   * Função para lidar com o envio do token.
   * 
   * Verifica se o token inserido corresponde ao token gerado e, se for válido,
   * armazena o token em um cookie e redireciona o usuário para o painel de tarefas.
   */
  const handleTokenSubmit = () => {
    if (token === generatedToken) {
       const decodedToken = jwt.decode(token);
      if (decodedToken && typeof decodedToken !== 'string') {
        Cookies.set('token', token, {
          expires: 1,
          secure: true,
          sameSite: 'None', // Necessário para cookies cross-site
          path: '/'
        });
        Store.addNotification({
          title: 'Sucesso',
          message: 'Login realizado com sucesso!',
          type: 'success',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
        push('/TaskDashboard') // Redireciona para o painel de tarefas
      } else {
        Store.addNotification({
          title: 'Erro',
          message: 'Token inválido! Por favor, tente novamente.',
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
    } else {
      Store.addNotification({
        title: 'Erro',
        message: 'Token não corresponde ao gerado. Por favor, tente novamente.',
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
  };

  const cardRef = useRef<HTMLDivElement>(null);

  // Efeito para inicializar o VanillaTilt no elemento de cartão
  useEffect(() => {
    if(cardRef.current) {
        VanillaTilt.init(cardRef.current, {
            speed: 11000,
            scale: 1.02, // Reduz se o efeito de escala for muito forte
            glare: false, // Desativa o efeito de brilho, que pode causar desfoque
            "max-glare": 0, // Reduz o brilho máximo a 0 para evitar desfoque
        })
    }
  })

  return (
    <>
      <ReactNotifications />
      <main className={styles.main}>
        <div ref={cardRef} className={styles.form}>
          <form onSubmit={handleSubmit} method="post" className={styles.containerFormRegister}>
            <div className={styles.containerRegister}>
              <div className={styles.dataRegister}>
                {isVisible && (
                  <>
                    <h1 className={styles.title}>LOGIN</h1>
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
                      placeholder="Digite sua senha"
                      autoComplete='current-password'
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className={styles.inputRegister}
                    />
                    <button type="submit" className={`${styles.inputRegister} ${styles.button}`}>Entrar</button>
                    <Link href="/register" className={styles.link}>Não tem uma conta? Faça cadastro aqui.</Link>
                  </>
                )}
                {isModalOpen && (
                  <div className={styles.modal}>
                    <div className={styles.modalcontent}>
                      <h1 className={styles.title}>Insira o Token</h1>
                      <input 
                        type="text" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        placeholder="Insira o token" 
                        className={styles.inputRegister}
                      />
                      <button type="button" onClick={handleTokenSubmit} className={`${styles.inputRegister} ${styles.button}`}>Enviar Token</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
      <ParticlesBackground/>
    </>
  );
}
