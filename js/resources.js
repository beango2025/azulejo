/* Azulejo — external resources that use European Portuguese, never pt-BR. */
(function () {
  'use strict';

  window.AZ_RESOURCES = [
    {
      id: 'falar',
      name: 'Falar',
      kind: 'App completo',
      level: 'A1–B1',
      license: 'MIT',
      url: 'https://falar.dubkov.eu/',
      repo: 'https://github.com/vokdub/falar',
      icon: 'play',
      accent: 'blue',
      desc: '16 lições curtas com tradução, escuta, reconhecimento de fala e construção de frases. Inclui exames, SRS e PWA.',
      note: 'Interface em inglês/russo; todo o conteúdo é PT-PT.'
    },
    {
      id: 'fala-bem',
      name: 'Fala Bem',
      kind: 'Curso em HTML',
      level: 'A2–B1',
      license: 'Sem licença',
      url: 'https://github.com/imansdn/fala-bem',
      repo: 'https://github.com/imansdn/fala-bem',
      icon: 'book',
      accent: 'terra',
      desc: '43 páginas de aulas com diálogos e vocabulário de Portugal: SEF, SNS, trabalho, entrevistas e cidadania.',
      note: 'Link apenas; não reutilizar conteúdo sem licença explícita.'
    },
    {
      id: 'ptpt-index',
      name: 'PTptIndex',
      kind: 'Input compreensível',
      level: 'A2+',
      license: 'Apache-2.0',
      url: 'https://github.com/norsigmacom/PTptIndex',
      repo: 'https://github.com/norsigmacom/PTptIndex',
      icon: 'layers',
      accent: 'olive',
      desc: 'Uma lista curada de conteúdo original em português europeu: YouTube, podcasts, livros infantis e canais de ensino.',
      note: 'Não é um curso; é uma boa fonte para ouvir Portugal todos os dias.'
    },
    {
      id: 'ep-frequency',
      name: 'EP Spoken Frequency',
      kind: 'Frequência + Anki',
      level: 'A2+',
      license: 'CC BY-SA 4.0',
      url: 'https://github.com/professorcdp/EPspokenfrequency',
      repo: 'https://github.com/professorcdp/EPspokenfrequency',
      icon: 'volume',
      accent: 'gold',
      desc: '10.000 lemas mais frequentes em filmes e séries portuguesas, com tradução inglesa, exemplos e baralhos Anki.',
      note: 'Dados sob CC BY-SA 4.0; o código está sob MIT.'
    },
    {
      id: 'amalia',
      name: 'Conversas com Amália',
      kind: 'Conversa por voz',
      level: 'B2+',
      license: 'Apache-2.0',
      url: 'https://github.com/ricardocsantana/conversas-com-amalia',
      repo: 'https://github.com/ricardocsantana/conversas-com-amalia',
      icon: 'mic',
      accent: 'plum',
      desc: 'Conversa em tempo real com a Amália, um modelo aberto treinado nativamente em português europeu, com voz pt-PT local.',
      note: 'Requer macOS/Linux, Ollama e configuração local; não é uma app de iniciante.'
    }
  ];
})();
