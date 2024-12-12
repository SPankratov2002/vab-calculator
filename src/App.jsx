import React, { useState, useEffect } from "react";
import "./App.css";
import SectionGroup from "./components/SectionGroup";
import ResultSection from "./components/ResultSection";

function App() {
  const [tg, setTg] = useState(null);

  // Инициализация Telegram SDK
  useEffect(() => {
    const tg = window.Telegram.WebApp;

    tg.ready(); // Сообщаем, что приложение готово
    tg.MainButton.text = "Открыть приложение";
    tg.MainButton.show(); // Показываем кнопку

    tg.onEvent("mainButtonClicked", () => {
      tg.sendData("Приложение работает!"); // Отправка тестового сообщения
    });

    console.log("Telegram WebApp Initialized");
  }, []);

  const [inputs, setInputs] = useState({
    right: { svjav: 0, vvjav: 0, sosa: 0, vosa: 0, spa: 0, vpa: 0 },
    left: { svjav: 0, vvjav: 0, sosa: 0, vosa: 0, spa: 0, vpa: 0 },
  });

  const [results, setResults] = useState({
    right: 0,
    left: 0,
    summary: 0,
  });

  const [errors, setErrors] = useState(false);

  // Проверка на заполненность всех полей
  const areInputsValid = () => {
    return (
      Object.values(inputs.right).every((value) => value > 0) &&
      Object.values(inputs.left).every((value) => value > 0)
    );
  };

  // Обработчик изменения полей
  const handleInputChange = (side, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  // Определение цвета для фона результата
  const getResultColor = (value) => {
    if (value >= 65 && value <= 85) {
      return "bg-success"; // Зелёный
    } else if ((value > 60 && value < 65) || (value > 85 && value <= 90)) {
      return "bg-warning"; // Жёлтый
    } else {
      return "bg-danger"; // Красный
    }
  };

  // Функция расчета ВАБ
  const calculateVAB = () => {
    if (!areInputsValid()) {
      setErrors(true);
      return;
    }

    setErrors(false);

    const calculateSide = (data) => {
      const numerator = data.svjav * data.vvjav;
      const denominator = data.sosa * data.vosa + data.spa * data.vpa;
      return denominator !== 0
        ? ((numerator / denominator) * 100).toFixed(2)
        : 0;
    };

    const vabRight = calculateSide(inputs.right);
    const vabLeft = calculateSide(inputs.left);
    const vabSummary = (parseFloat(vabRight) + parseFloat(vabLeft)).toFixed(2);

    setResults({
      right: vabRight,
      left: vabLeft,
      summary: vabSummary,
    });

    // Отправка данных в Telegram
    if (tg) {
      tg.sendData(
        JSON.stringify({
          vabRight,
          vabLeft,
          vabSummary,
        })
      );
    }
  };

  // Основная кнопка Telegram
  const onCalculate = () => {
    calculateVAB();
  };

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-around mb-4">
        <span className="badge text-white px-4 py-2 ">Правая сторона</span>
        <span className="badge text-white px-4 py-2 mx-1">Левая сторона</span>
      </div>

      <SectionGroup
        title="Внутренние яремные вены (ВЯВ)"
        inputs={{
          right: [
            { label: "S вяв", field: "svjav", unit: "см²" },
            { label: "V вяв", field: "vvjav", unit: "см/с" },
          ],
          left: [
            { label: "S вяв", field: "svjav", unit: "см²" },
            { label: "V вяв", field: "vvjav", unit: "см/с" },
          ],
        }}
        onChange={handleInputChange}
      />

      <SectionGroup
        title="Общие сонные артерии (ОСА)"
        inputs={{
          right: [
            { label: "S osa", field: "sosa", unit: "см²" },
            { label: "V osa", field: "vosa", unit: "см/с" },
          ],
          left: [
            { label: "S osa", field: "sosa", unit: "см²" },
            { label: "V osa", field: "vosa", unit: "см/с" },
          ],
        }}
        onChange={handleInputChange}
      />

      <SectionGroup
        title="Позвоночные артерии (ПА)"
        inputs={{
          right: [
            { label: "S pa", field: "spa", unit: "см²" },
            { label: "V pa", field: "vpa", unit: "см/с" },
          ],
          left: [
            { label: "S pa", field: "spa", unit: "см²" },
            { label: "V pa", field: "vpa", unit: "см/с" },
          ],
        }}
        onChange={handleInputChange}
      />

      {errors && (
        <div className="alert alert-danger text-center error-alert animate__animated animate__fadeInDown">
          Пожалуйста, заполните все поля!
        </div>
      )}

      <ResultSection
        results={results}
        onCalculate={calculateVAB}
        getResultColor={getResultColor}
      />
    </div>
  );
}

export default App;
