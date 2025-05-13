
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
document.addEventListener("DOMContentLoaded", async ()=>{
  try {
  const response =await fetch("/graficobarras")
  const data= await response.json()
  const chartDom= document.getElementById("grafico_ventas")
  const myChart = echarts.init(chartDom)
  const option={
  title: {text: "ventas meses"},
  tooltip: {},
  xAxis: { type: "category", data: data.labels }, // Agregar eje X
  yAxis: { type: "value" },
  series:{
    name: "ventas mensual",
    type: "bar",
    data: data.values
  }
  }

  myChart.setOption(option)
  } catch (error) {
  console.error("Error al cargar el gráfico:", error);
  }
})
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/graficolineal")
    const data = await response.json()
    const chartDom= document.getElementById("grafico_lineal")
    const myChart= echarts.init(chartDom)
    const option ={
    title: {text: "ventas"},
    tooltip:{},
    xAxis : {type:"category", data: data.labels},
    yAxis :{ type: "value"},
    series:{
      name: "venta",
      tooltip:{},
      type:"line",
      data: data.values
    }

    }
    myChart.setOption(option)
  } catch (error) {
  console.error("Error al cargar el gráfico:", error);
  }
})
