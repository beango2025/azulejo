/* Azulejo — original A2 mock-exam blueprints (not official CAPLE papers). */
window.AZ_EXAMS = [
  {
    id: 'a2-mock-1',
    title: 'A2 · CIPLE Mock 1',
    subtitle: 'Lisboa, trabalho e vida quotidiana',
    minutes: 75,
    readingIds: ['u4l1', 'u4l2'],
    listeningIds: ['A2.1', 'A2.2'],
    writing: [
      {
        prompt: 'Escreve um email curto ao teu senhorio a explicar que a torneira da cozinha está a pingar e a pedir uma reparação. (60–80 palavras)',
        min: 60,
        hint: 'Começa com «Exmo. Sr.», identifica o problema, diz desde quando e pede uma visita.'
      },
      {
        prompt: 'Escreve uma mensagem a um amigo a convidá-lo para jantar em tua casa no sábado. Diz o que vais cozinhar e a que horas. (50–70 palavras)',
        min: 50,
        hint: 'Usa «Queres vir…?», «Vou fazer…» e «Às… horas».'
      }
    ],
    speaking: [
      { prompt: 'Apresenta-te: nome, nacionalidade, onde vives e o que fazes.', model: 'Chamo-me… Sou… Vivo em… Trabalho/Estudo…' },
      { prompt: 'Descreve a tua rotina num dia de trabalho.', model: 'Acordo às…, tomo o pequeno-almoço e vou para…' },
      { prompt: 'Estás num café. Pede um café e um pastel de nata, e pergunta quanto custa.', model: 'Queria um café e um pastel de nata, se faz favor. Quanto custa?' }
    ]
  },
  {
    id: 'a2-mock-2',
    title: 'A2 · CIPLE Mock 2',
    subtitle: 'Família, viagens e serviços',
    minutes: 75,
    readingIds: ['u5l1', 'u5l2'],
    listeningIds: ['A2.3', 'A2.4'],
    writing: [
      {
        prompt: 'Escreve um email a um hotel a confirmar uma reserva para duas noites e a pedir um quarto sossegado. (60–80 palavras)',
        min: 60,
        hint: 'Indica as datas, o número de pessoas e o pedido.'
      },
      {
        prompt: 'Escreve um postal a um amigo sobre uma viagem que fizeste. Diz onde foste, o que viste e o que gostaste mais. (50–70 palavras)',
        min: 50,
        hint: 'Usa o pretérito perfeito: fui, vi, gostei.'
      }
    ],
    speaking: [
      { prompt: 'Fala da tua família: quantas pessoas são, onde vivem e o que fazem.', model: 'A minha família é… O meu pai… A minha mãe…' },
      { prompt: 'Estás numa estação. Pergunta onde fica a plataforma do comboio para o Porto.', model: 'Desculpe, onde fica a plataforma para o comboio do Porto?' },
      { prompt: 'Conta uma viagem recente: onde foste, com quem e o que fizeste.', model: 'No mês passado fui a… com… Visitei… e comi…' }
    ]
  }
];
