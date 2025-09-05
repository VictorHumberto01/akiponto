"use client";

import { useState, useEffect } from "react";
import {
  achievements,
  checkAchievement,
  calculateLevel,
  calculateLevelProgress,
} from "./achievements";

export default function Home() {
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [remainingTime, setRemainingTime] = useState(600);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewTime, setReviewTime] = useState(0);
  const [studyTime, setStudyTime] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("studyTime");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const savedScore = localStorage.getItem("score");
    if (savedScore) setScore(parseInt(savedScore, 10));

    const savedXp = localStorage.getItem("xp");
    if (savedXp) setXp(parseInt(savedXp, 10));

    const savedAchievements = localStorage.getItem("achievements");
    if (savedAchievements)
      setUnlockedAchievements(JSON.parse(savedAchievements));

    const savedStreak = localStorage.getItem("currentStreak");
    if (savedStreak) setCurrentStreak(parseInt(savedStreak, 10));

    const savedReviewMode = localStorage.getItem("isReviewMode");
    if (savedReviewMode) setIsReviewMode(JSON.parse(savedReviewMode));

    const savedReviewTime = localStorage.getItem("reviewTime");
    if (savedReviewTime) setReviewTime(parseInt(savedReviewTime, 10));

    const lastResetTime = localStorage.getItem("lastResetTime");
    if (lastResetTime) {
      const elapsedTime = Math.floor(
        (Date.now() - parseInt(lastResetTime, 10)) / 1000,
      );
      const cycles = Math.floor(elapsedTime / 600);
      console.log("Inicialização:", {
        lastResetTime: new Date(parseInt(lastResetTime, 10)).toISOString(),
        elapsedTime,
        cycles,
      });
      if (cycles > 0) {
        setScore(Math.max(0, savedScore - cycles));
        const newLastResetTime =
          parseInt(lastResetTime, 10) + cycles * 600 * 1000;
        localStorage.setItem("lastResetTime", newLastResetTime.toString());
        const remainingInCycle = elapsedTime % 600;
        setRemainingTime(600 - remainingInCycle);
        console.log("Reset por ciclos:", {
          newLastResetTime: new Date(newLastResetTime).toISOString(),
          remainingInCycle,
          newRemainingTime: 600 - remainingInCycle,
        });
      } else {
        setScore(savedScore);
        setRemainingTime(600 - elapsedTime);
        console.log("Sem reset necessário:", {
          elapsedTime,
          newRemainingTime: 600 - elapsedTime,
        });
      }
    } else {
      localStorage.setItem("lastResetTime", Date.now().toString());
      setScore(0);
      console.log("Primeira inicialização");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  useEffect(() => {
    localStorage.setItem("xp", xp);
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    console.log("Timer Effect: Iniciando com remainingTime:", remainingTime);
    const timer = setInterval(() => {
      if (isReviewMode) {
        setReviewTime((prev) => {
          const newTime = prev + 1;
          localStorage.setItem("reviewTime", newTime.toString());
          return newTime;
        });
      } else {
        setStudyTime((prev) => {
          const newTime = prev + 1;
          localStorage.setItem("studyTime", newTime.toString());
          return newTime;
        });
        setRemainingTime((prevTime) => {
          const newTime = prevTime <= 1 ? 600 : prevTime - 1;
          console.log("Timer Tick:", {
            previousTime: prevTime,
            newTime: newTime,
            isReset: prevTime <= 1,
            currentDate: new Date().toISOString(),
          });
          if (prevTime <= 1) {
            setScore((prevScore) => Math.max(0, prevScore - 1));
            setCurrentStreak(0); // Reset streak when losing points
            localStorage.setItem("currentStreak", "0");
            localStorage.setItem("lastResetTime", Date.now().toString());
            return 600;
          }
          return prevTime - 1;
        });
      }
    }, 1000);

    return () => {
      console.log("Timer Effect: Limpando timer");
      clearInterval(timer);
    };
  }, [remainingTime, isReviewMode]);

  const addPoints = () => {
    setScore((prevScore) => {
      const newScore = prevScore + 2;
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        localStorage.setItem("currentStreak", newStreak.toString());
        // Verifica conquistas de streak
        const streakAchievements = checkAchievement(
          "streaks",
          newStreak,
          unlockedAchievements,
        );
        if (streakAchievements.length > 0) {
          const streakXp = streakAchievements.reduce(
            (sum, ach) => sum + ach.xp,
            0,
          );
          setXp((prev) => prev + streakXp);
          setUnlockedAchievements((prev) => [
            ...prev,
            ...streakAchievements.map((ach) => ach.id),
          ]);
        }
        return newStreak;
      });

      // Verifica conquistas de pontuação
      const scoreAchievements = checkAchievement(
        "score",
        newScore,
        unlockedAchievements,
      );
      if (scoreAchievements.length > 0) {
        const scoreXp = scoreAchievements.reduce((sum, ach) => sum + ach.xp, 0);
        setXp((prev) => prev + scoreXp);
        setUnlockedAchievements((prev) => [
          ...prev,
          ...scoreAchievements.map((ach) => ach.id),
        ]);
      }
      return newScore;
    });
  };

  const resetScore = () => {
    setScore(0);
    setRemainingTime(600);
    setXp(0);
    setUnlockedAchievements([]);
    setCurrentStreak(0);
    localStorage.setItem("lastResetTime", Date.now().toString());
    localStorage.removeItem("xp");
    localStorage.removeItem("achievements");
    localStorage.removeItem("currentStreak");
    localStorage.removeItem("score");
  };

  // Funções de verificação de conquistas são chamadas em addPoints()
  const checkAllAchievements = () => {
    // Verifica conquistas de tempo de estudo
    const studyAchievements = checkAchievement(
      "studyTime",
      studyTime,
      unlockedAchievements,
    );
    // Verifica conquistas de eficiência
    const efficiencyValue = calculateEfficiency();
    const efficiencyAchievements = checkAchievement(
      "efficiency",
      efficiencyValue,
      unlockedAchievements,
    );

    const newAchievements = [...studyAchievements, ...efficiencyAchievements];
    if (newAchievements.length > 0) {
      const newXp = newAchievements.reduce((sum, ach) => sum + ach.xp, 0);
      setXp((prev) => prev + newXp);
      setUnlockedAchievements((prev) => [
        ...prev,
        ...newAchievements.map((ach) => ach.id),
      ]);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleReviewMode = () => {
    setIsReviewMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("isReviewMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  const resetReviewTime = () => {
    setReviewTime(0);
    localStorage.setItem("reviewTime", "0");
  };

  const resetStudyTime = () => {
    setStudyTime(0);
    localStorage.setItem("studyTime", "0");
  };

  const toggleStats = () => {
    setShowStats((prev) => !prev);
  };

  const calculateEfficiency = () => {
    const totalTime = studyTime + reviewTime;
    if (totalTime === 0) return 0;
    return ((studyTime / totalTime) * 100).toFixed(1);
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="grid gap-6">
          {/* Card Principal */}
          <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
            {/* Cabeçalho e Timer */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {score} pontos • {xp} XP
              </h1>
              <div className="inline-block px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {isReviewMode ? (
                    <span className="text-yellow-600 dark:text-yellow-400">
                      ⏱️ Revisão: {formatTime(reviewTime)}
                    </span>
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400">
                      ⏳ Próximo -1 em: {formatTime(remainingTime)}
                    </span>
                  )}
                </span>
              </div>
            </div>
            {/* Botões Principais */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={addPoints}
                className="col-span-2 px-6 py-4 text-lg font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
              >
                +2 Pontos
              </button>
              <button
                onClick={toggleReviewMode}
                className={`px-4 py-3 text-base font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  isReviewMode
                    ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {isReviewMode ? "⏸️ Pausar Revisão" : "▶️ Iniciar Revisão"}
              </button>
              <button
                onClick={toggleStats}
                className="px-4 py-3 text-base font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
              >
                📊 {showStats ? "Ocultar Stats" : "Ver Stats"}
              </button>
            </div>

            {/* Painel de Estatísticas */}
            {showStats && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  📊 Estatísticas de Estudo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Tempo de Estudo
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatTime(studyTime)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Tempo em Revisão
                    </p>
                    <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {formatTime(reviewTime)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Rendimento
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {calculateEfficiency()}%
                    </p>
                  </div>
                </div>
                {/* Botões de Reset */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button
                    onClick={resetStudyTime}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    🔄 Reset Estudo
                  </button>
                  <button
                    onClick={resetReviewTime}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    🔄 Reset Revisão
                  </button>
                </div>
              </div>
            )}

            {/* Nível e Conquistas */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  🏆 Conquistas
                </h2>
                <div className="flex gap-4 items-center">
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    Nível {calculateLevel(xp).level} •{" "}
                    {calculateLevel(xp).title}
                  </span>
                  <button
                    onClick={toggleStats}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    {showStats ? "▼" : "▶"}
                  </button>
                </div>
              </div>
              {showStats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {Object.entries(achievements).map(
                    ([category, categoryAchievements]) =>
                      categoryAchievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-3 rounded-lg ${
                            unlockedAchievements.includes(achievement.id)
                              ? "bg-green-100 dark:bg-green-800"
                              : "bg-gray-200 dark:bg-gray-600"
                          }`}
                        >
                          <div className="text-2xl mb-1">
                            {achievement.icon}
                          </div>
                          <h3 className="text-sm font-bold">
                            {achievement.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                            +{achievement.xp} XP
                          </p>
                        </div>
                      )),
                  )}
                </div>
              )}
              {/* Barra de Progresso do Nível */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200 dark:text-purple-200 dark:bg-purple-800">
                      XP: {xp}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-purple-600 dark:text-purple-400">
                      {calculateLevelProgress(xp).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-600">
                  <div
                    style={{ width: `${calculateLevelProgress(xp)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                  ></div>
                </div>
              </div>
            </div>

            {/* Botão de Reset */}
            <button
              onClick={resetScore}
              className="w-full px-4 py-3 text-base font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all mt-4"
            >
              🔄 Resetar Tudo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
