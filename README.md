# 🎯 AkiPonto

Sistema de gamificação para estudo e revisão com controle de tempo e pontuação automática.

## ✨ Funcionalidades

### Sistema de Pontuação
- ➕ Ganhe 2 pontos ao completar tarefas/exercícios
- ➖ Perca 1 ponto a cada 10 minutos de inatividade
- 🎯 Defina metas personalizadas e acompanhe seu progresso

### Controle de Tempo
- ⏱️ Timer de 10 minutos para manter o foco
- 📚 Modo revisão que pausa a perda de pontos
- 📊 Estatísticas detalhadas de estudo vs. revisão
- 💯 Cálculo de rendimento baseado no tempo de estudo efetivo

### Persistência
- 💾 Salva automaticamente seu progresso
- 🔄 Mantém os dados mesmo após fechar o navegador
- 📈 Histórico de tempo de estudo e revisão

## 🚀 Como Usar

1. **Sistema de Pontos**
   - Clique em "Ganha 2 pontos" ao completar exercícios/tarefas
   - Observe o timer de 10 minutos - quando chegar a zero, perde 1 ponto
   - Use "Reset" para zerar a pontuação quando necessário

2. **Modo Revisão**
   - Clique em "Iniciar Revisão" para pausar a perda de pontos
   - O tempo em revisão será contabilizado separadamente
   - Use "Finalizar Revisão" para voltar ao modo normal
   - O tempo total em revisão é acumulativo

3. **Controle de Rendimento**
   - Use "Ver Rendimento" para acompanhar suas estatísticas
   - Monitore o tempo de estudo vs. tempo de revisão
   - Acompanhe sua porcentagem de tempo efetivo de estudo
   - Reset independente para tempos de estudo e revisão

## 🛠️ Tecnologias

- Next.js
- React
- TailwindCSS
- LocalStorage para persistência

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📝 Notas

- O sistema usa localStorage para manter seus dados - não limpe os dados do navegador se quiser manter seu progresso
- Recomenda-se manter a aba do AkiPonto sempre visível para melhor acompanhamento do timer
- O modo revisão não reseta automaticamente - use o botão específico quando quiser zerar o contador

## 📱 Responsividade

O AkiPonto é totalmente responsivo e funciona em:
- 💻 Desktops
- 📱 Tablets
- 📱 Smartphones

## 🤝 Contribuição

Sugestões e contribuições são sempre bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação
- Enviar pull requests
