import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartConsi = () => {
    const chartRef = useRef(null);

  useEffect(() => {
    const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const dataSets = [
     {
        data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
        borderColor: '#203764',
        fill: false
      }
    ];

    const myChart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: dataSets
      },
      options: {
        legend: { display: false }
      }
    });

    return () => {
      myChart.destroy();
    };
  }, []);
  return (
    <div>
   <canvas ref={chartRef} id="myChart" style={{ width: '100%', maxWidth: '1000px'}} />
    </div>
  )
}

export default ChartConsi
