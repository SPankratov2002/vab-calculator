import React, { useState, useEffect } from "react";
import "./App.css";
import SectionGroup from "./components/SectionGroup";
import ResultSection from "./components/ResultSection";

function App() {
  const [tg, setTg] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const telegram = window.Telegram.WebApp;
  // Инициализация Telegram SDK
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.MainButton.setParams({ is_visible: false });

    // Сообщаем Telegram, что приложение готово
    tg.ready();

    console.log("Telegram WebApp Initialized");
    setTg(telegram); // Сохраняем Telegram объект в состоянии
  }, []);

  const [inputs, setInputs] = useState({
    right: {
      svjav: "",
      vvjav: "",
      sosa: "",
      vosa: "",
      spa: "",
      vpa: "",
    },
    left: {
      svjav: "",
      vvjav: "",
      sosa: "",
      vosa: "",
      spa: "",
      vpa: "",
    },
  });

  const [results, setResults] = useState({
    right: 0,
    left: 0,
    summary: 0,
  });

  const [errors, setErrors] = useState(false);

  // Сброс полей
  const resetInputs = () => {
    setInputs({
      right: { svjav: "", vvjav: " ", sosa: "", vosa: "", spa: "", vpa: "" },
      left: { svjav: "", vvjav: "", sosa: "", vosa: "", spa: "", vpa: "" },
    });

    setResults({
      right: 0,
      left: 0,
      summary: 0,
    });

    setErrors(false);
    setIsCalculated(false);
  };

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
        [field]: value === "" ? "" : parseFloat(value), // Оставляем пустую строку, если поле очищено
      },
    }));
  };

  // Определение цвета для фона результата
  const getResultColor = (value) => {
    if (value >= 65 && value <= 100) {
      return "bg-success";
    } else if (value > 40 && value < 65) {
      return "bg-warning";
    } else {
      return "bg-danger";
    }
  };

  // Определение цвета для текста результата
  const getResultText = (value) => {
    if (value >= 65 && value <= 100) {
      return { text: "Норма", color: "text-success" };
    } else if (value > 40 && value < 65) {
      return { text: "Риск венозного застоя", color: "text-warning" };
    } else {
      return { text: "Венозный застой", color: "text-danger" };
    }
  };

  // Функция расчета ВАБ
  const calculateVAB = () => {
    if (!areInputsValid()) {
      setErrors(true);
      return;
    }

    setErrors(false);

    const calculateSide = (data, oppositeData) => {
      const numerator = data.svjav * data.vvjav; // ВЯВ
      const denominator =
        data.sosa * data.vosa +
        oppositeData.sosa * oppositeData.vosa + // Сумма ОСА
        data.spa * data.vpa +
        oppositeData.spa * oppositeData.vpa; // Сумма ПА

      console.log(
        data.sosa * data.vosa,
        oppositeData.sosa * oppositeData.vosa,
        data.spa * data.vpa,
        oppositeData.spa * oppositeData.vpa
      );

      return denominator !== 0
        ? ((numerator / denominator) * 100).toFixed(2)
        : 0;
    };

    const vabRight = calculateSide(inputs.right, inputs.left); // Правая сторона
    const vabLeft = calculateSide(inputs.left, inputs.right); // Левая сторона
    const vabSummary = (parseFloat(vabRight) + parseFloat(vabLeft)).toFixed(2); // Итоговый ВАБ

    setResults({
      right: vabRight,
      left: vabLeft,
      summary: vabSummary,
    });

    setIsCalculated(true); // Показываем текст результата
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
        values={inputs}
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
        values={inputs}
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
        values={inputs}
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
        onReset={resetInputs}
        isCalculated={isCalculated}
        resultText={getResultText(results.summary)} // Передача текста и цвета
      />
    </div>
  );
}

export default App;
