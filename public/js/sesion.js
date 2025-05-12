
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/graficopie"); // Obtiene los datos del backend
    const data = await response.json();

    const chartDom = document.getElementById("grafico_pie");
    const myChart = echarts.init(chartDom);

    const option = {
      title: { text: "Productos Más Vendidos" },
      tooltip: {},
      series: [
        {
          name: "Ventas",
          type: "pie",
          radius: "50%",
          data: data.labels.map((label, index) => ({
            name: label,
            value: data.values[index]
          }))
        }
      ]
    };

    myChart.setOption(option);
  } catch (error) {
    console.error("Error al cargar el gráfico:", error);
  }
});
