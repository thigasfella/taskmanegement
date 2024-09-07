import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

/**
 * Componente para exibir um fundo de partículas utilizando a biblioteca tsparticles.
 * 
 * @returns JSX.Element - Componente que exibe partículas no fundo da tela.
 */
const ParticlesBackground = React.memo(() => {
  // Estado para verificar se o mecanismo de partículas foi inicializado
  const [init, setInit] = useState(false);

  useEffect(() => {
    // Inicializa o mecanismo de partículas e carrega o plugin slim
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true); // Define o estado como verdadeiro após a inicialização
    });
  }, []);

  // Configurações para as partículas
  const options = useMemo(
    () => ({
      fpsLimit: 120, // Limite de FPS para a animação das partículas
      interactivity: {
        events: {
          onHover: {
            enable: true, // Habilita o efeito ao passar o mouse
            mode: "repulse", // Efeito de repulsão ao passar o mouse
          },
        },
        modes: {
          push: {
            quantity: 4, // Quantidade de partículas adicionadas ao clicar
          },
          repulse: {
            distance: 100, // Distância do efeito de repulsão
            duration: 0.4, // Duração do efeito de repulsão
          },
        },
      },
      particles: {
        color: {
          value: "#fff", // Cor das partículas
        },
        links: {
          enable: false, // Desativa a exibição de linhas entre partículas
        },
        move: {
          direction: "none", // Sem direção específica para o movimento das partículas
          enable: true, // Habilita o movimento das partículas
          outModes: {
            default: "bounce", // Comportamento das partículas ao sair da tela
          },
          random: false, // Desativa o movimento aleatório das partículas
          speed: 0.2, // Velocidade do movimento das partículas
          straight: false, // Desativa o movimento em linha reta das partículas
        },
        number: {
          density: {
            enable: true, // Habilita a densidade das partículas
            area: 1000, // Área de densidade das partículas
          },
          value: 800, // Número total de partículas
        },
        opacity: {
          value: 1, // Opacidade das partículas
        },
        shape: {
          type: "circle", // Forma das partículas
        },
        size: {
          value: { min: 0.2, max: 0.2 }, // Tamanho das partículas
        },
      },
      detectRetina: true, // Habilita a detecção de retina para garantir qualidade em diferentes resoluções
    }),
    []
  );

  // Retorna o componente Particles se o mecanismo estiver inicializado
  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
      />
    );
  }

  // Retorna um fragmento vazio enquanto o mecanismo não está inicializado
  return <></>;
});

export default ParticlesBackground;
