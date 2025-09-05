// Definição das conquistas do sistema
export const achievements = {
  // Conquistas de Pontuação
  score: [
    {
      id: "score_10",
      title: "Iniciante",
      description: "Alcance 10 pontos",
      requirement: 10,
      icon: "🌱",
      xp: 100,
    },
    {
      id: "score_50",
      title: "Estudante Dedicado",
      description: "Alcance 50 pontos",
      requirement: 50,
      icon: "📚",
      xp: 500,
    },
    {
      id: "score_100",
      title: "Mestre do Conhecimento",
      description: "Alcance 100 pontos",
      requirement: 100,
      icon: "🎓",
      xp: 1000,
    },
    {
      id: "score_500",
      title: "Sábio Supremo",
      description: "Alcance 500 pontos",
      requirement: 500,
      icon: "🏆",
      xp: 5000,
    },
  ],

  // Conquistas de Tempo de Estudo
  studyTime: [
    {
      id: "study_1h",
      title: "Primeira Hora",
      description: "Estude por 1 hora",
      requirement: 3600, // em segundos
      icon: "⏱️",
      xp: 200,
    },
    {
      id: "study_5h",
      title: "Maratonista",
      description: "Estude por 5 horas",
      requirement: 18000,
      icon: "⚡",
      xp: 1000,
    },
    {
      id: "study_24h",
      title: "Lendário",
      description: "Estude por 24 horas no total",
      requirement: 86400,
      icon: "👑",
      xp: 5000,
    },
  ],

  // Conquistas de Eficiência
  efficiency: [
    {
      id: "efficiency_70",
      title: "Foco Total",
      description: "Mantenha 70% do tempo em estudo",
      requirement: 70,
      icon: "🎯",
      xp: 300,
    },
    {
      id: "efficiency_85",
      title: "Mestre da Produtividade",
      description: "Mantenha 85% do tempo em estudo",
      requirement: 85,
      icon: "⭐",
      xp: 1000,
    },
  ],

  // Conquistas de Streaks
  streaks: [
    {
      id: "streak_3",
      title: "Trio Perfeito",
      description: "Ganhe pontos 3 vezes seguidas sem perder",
      requirement: 3,
      icon: "🔥",
      xp: 150,
    },
    {
      id: "streak_10",
      title: "Imparável",
      description: "Ganhe pontos 10 vezes seguidas sem perder",
      requirement: 10,
      icon: "💫",
      xp: 1000,
    },
  ],
};

// Sistema de níveis baseado em XP
export const levels = [
  { level: 1, xpRequired: 0, title: "Iniciante" },
  { level: 2, xpRequired: 1000, title: "Estudante" },
  { level: 3, xpRequired: 3000, title: "Estudante Avançado" },
  { level: 4, xpRequired: 6000, title: "Especialista" },
  { level: 5, xpRequired: 10000, title: "Mestre" },
  { level: 6, xpRequired: 15000, title: "Grão-Mestre" },
  { level: 7, xpRequired: 21000, title: "Lendário" },
  { level: 8, xpRequired: 28000, title: "Mítico" },
  { level: 9, xpRequired: 36000, title: "Transcendente" },
  { level: 10, xpRequired: 45000, title: "Iluminado" },
];

// Funções auxiliares para verificar conquistas
export const checkAchievement = (type, value, unlockedAchievements) => {
  const typeAchievements = achievements[type] || [];
  const newUnlocked = [];

  typeAchievements.forEach((achievement) => {
    if (
      !unlockedAchievements.includes(achievement.id) &&
      value >= achievement.requirement
    ) {
      newUnlocked.push(achievement);
    }
  });

  return newUnlocked;
};

// Calcula o nível atual baseado no XP total
export const calculateLevel = (totalXp) => {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXp >= levels[i].xpRequired) {
      return levels[i];
    }
  }
  return levels[0];
};

// Calcula o progresso para o próximo nível
export const calculateLevelProgress = (totalXp) => {
  const currentLevel = calculateLevel(totalXp);
  const nextLevel = levels[currentLevel.level] || levels[levels.length - 1];

  if (currentLevel.level === levels.length) {
    return 100;
  }

  const xpForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
  const currentLevelXp = totalXp - currentLevel.xpRequired;

  return Math.min(100, (currentLevelXp / xpForNextLevel) * 100);
};
