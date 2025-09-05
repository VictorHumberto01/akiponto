"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [score, setScore] = useState(0);
  const [milestone, setMilestone] = useState(100);
  const [remainingTime, setRemainingTime] = useState(600);
  const [isReviewMode, setIsReviewMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isReviewMode");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [reviewTime, setReviewTime] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reviewTime");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [studyTime, setStudyTime] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("studyTime");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    let savedScore = localStorage.getItem("score");
    if (savedScore) {
      savedScore = parseInt(savedScore, 10);
    } else {
      savedScore = 0;
    }

    const savedMilestone = localStorage.getItem("milestone");
    if (savedMilestone) {
      setMilestone(parseInt(savedMilestone, 10));
    }

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
    localStorage.setItem("milestone", milestone);
  }, [milestone]);

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
    setScore((prevScore) => prevScore + 2);
  };

  const resetScore = () => {
    setScore(0);
    setRemainingTime(600);
    localStorage.setItem("lastResetTime", Date.now().toString());
  };

  const handleMilestoneChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseInt(value, 10) >= 0) {
      setMilestone(value === "" ? "" : parseInt(value, 10));
    }
  };

  const progress = milestone > 0 ? (score / milestone) * 100 : 0;

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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pontos
            </h1>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {isReviewMode ? (
                <span>Tempo em revisão: {formatTime(reviewTime)}</span>
              ) : (
                <span>-1 ponto em: {formatTime(remainingTime)}</span>
              )}
            </div>
          </div>
          <p className="text-6xl font-bold text-center text-gray-900 dark:text-white">
            {score}
          </p>
          <button
            onClick={addPoints}
            className="w-full px-4 py-2 mt-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ganha 2 pontos
          </button>
          <button
            onClick={resetScore}
            className="w-full px-4 py-2 mt-2 text-lg font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset
          </button>
          <button
            onClick={toggleReviewMode}
            className={`w-full px-4 py-2 mt-2 text-lg font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isReviewMode
                ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
            }`}
          >
            {isReviewMode ? "Finalizar Revisão" : "Iniciar Revisão"}
          </button>
          <button
            onClick={resetReviewTime}
            className="w-full px-4 py-2 mt-2 text-lg font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Resetar Tempo de Revisão
          </button>
          <button
            onClick={resetStudyTime}
            className="w-full px-4 py-2 mt-2 text-lg font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Resetar Tempo de Estudo
          </button>
          <button
            onClick={toggleStats}
            className="w-full px-4 py-2 mt-2 text-lg font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            {showStats ? "Ocultar Rendimento" : "Ver Rendimento"}
          </button>

          {showStats && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                Estatísticas
              </h3>
              <div className="space-y-2 text-gray-800 dark:text-gray-200">
                <p>Tempo de Estudo: {formatTime(studyTime)}</p>
                <p>Tempo de Revisão: {formatTime(reviewTime)}</p>
                <p>Rendimento: {calculateEfficiency()}% estudo</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Meta
            </h2>
            <div className="flex items-center mt-2">
              <input
                type="number"
                value={milestone}
                onChange={handleMilestoneChange}
                className="w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            {milestone > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
