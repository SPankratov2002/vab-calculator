import React, { useState, useEffect } from "react";
import "../styles/ResultSection.css";

function ResultSection({
  results,
  onCalculate,
  getResultColor,
  onReset,
  resultText,
  isCalculated,
}) {
  const [animatedRight, setAnimatedRight] = useState(0);
  const [animatedLeft, setAnimatedLeft] = useState(0);
  const [animatedSummary, setAnimatedSummary] = useState(0);

  useEffect(() => {
    animateValue(results.right, setAnimatedRight);
    animateValue(results.left, setAnimatedLeft);
    animateValue(results.summary, setAnimatedSummary);
  }, [results]);

  // Функция анимации
  const animateValue = (endValue, setValue) => {
    let start = 0;
    const duration = 1000; // Продолжительность анимации
    const stepTime = 20; // Интервал обновления

    const step = () => {
      start += (endValue - start) / 10; // Плавный рост значения
      setValue(start.toFixed(0));
      if (Math.abs(start - endValue) > 0.5) {
        setTimeout(step, stepTime);
      } else {
        setValue(endValue.toFixed(0)); // Обновление до конечного значения
      }
    };
    step();
  };

  const defaultColor =
    results.summary > 0 ? getResultColor(results.summary) : "bg-secondary";
  return (
    <div className="result-section p-3 rounded  bg-light">
      <div className="d-flex justify-content-around mb-2">
        <span className="badge text-white px-4 py-2 mx-1">ВАБ справа</span>
        <span className="badge text-white px-4 py-2 mx-1">ВАБ слева</span>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div className="result-block text-center w-50 me-2">
          <div className="result-value border rounded-pill p-2 mt-2">
            {animatedRight}%
          </div>
        </div>
        <div className="result-block text-center w-50 ms-2">
          <div className="result-value border rounded-pill p-2 mt-2">
            {animatedLeft}%
          </div>
        </div>
      </div>

      <div className="result-section p-1 rounded">
        <div className="text-center mb-3">
          <h5 className="text-center text-info fw-bold py-2 ">Суммарный ВАБ</h5>
        </div>

        {/* Кнопка "Рассчитать" и Суммарный ВАБ */}
        <div className="d-flex align-items-center mb-3">
          <button
            className="btn btn-success px-4 me-3 w-50"
            onClick={onCalculate}
          >
            Рассчитать
          </button>
          <div
            className={`result-summary border rounded-pill p-3 w-50 text-white ${defaultColor}`}
          >
            {animatedSummary}%
          </div>
        </div>

        {isCalculated && (
          <p className={`text-center ${resultText.color} fw-bold py-2`}>
            {resultText.text}
          </p>
        )}

        <div className="danger-sections mb-4">
          <button className="btn btn-danger me-3" onClick={onReset}>
            Сбросить
          </button>
          <p className="text-muted m-0">Сброс всех параметров калькулятора</p>
        </div>
      </div>
    </div>
  );
}

export default ResultSection;
