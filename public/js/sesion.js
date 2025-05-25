
document.addEventListener("DOMContentLoaded",async () => {
  try {
    const response = await fetch("/grafico-costo")
    const data =  await response.json()
    const chartDom= document.getElementById("grafico-costos")
    const myChart= echarts.init(chartDom)
    const option={
      title: {text: "Costos meses"},
      tooltip: {},
      xAxis: {type: "category", data: data.labels},
      yAxis: {type: "value"},
      series:{
        name: "costo mensual",
        type: "line",
        data: data.values
      }
    }
    myChart.setOption(option)
  } catch (error) {
    console.error("Error al cargar el gráfico:", error);
  }
})
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
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const calendario= document.getElementById("calendar")
     const calendar = new FullCalendar.Calendar(calendario,{
      initialView: 'dayGridMonth',
      locale: 'es',
      eventColor: '#ff5733',
      events : async function (fetchInfo,successCallback,failureCallback) {
        try {
          const response = await fetch("/calendario")
          const data = await response.json()
          console.log("Eventos cargados:", data)
          successCallback(data)
        } catch (error) {
          console.error('Error fetching events:', error);
              failureCallback(error);

        }
      },
      eventMouseEnter: function(info) {
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip-event";
        tooltip.innerHTML = `<strong>${info.event.start}</strong><br>${info.event.extendedProps.description || "Sin descripción"}`;

        document.body.appendChild(tooltip);

        tooltip.style.position = "absolute";
        tooltip.style.background = "#333";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "5px";
        tooltip.style.borderRadius = "5px";
        tooltip.style.top = `${info.jsEvent.clientY + 10}px`;
        tooltip.style.left = `${info.jsEvent.clientX + 10}px`;

        info.el.addEventListener("mouseleave", () => {
          tooltip.remove();
        });
      }
    

     })
     
    calendar.render();

  } catch (error) {
    console.error("Error al cargar el claendario:", error);
  }
})
 const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"), // Botón para colapsar/expandir
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    modeText.innerText = "Light Mode";
}
modeSwitch.addEventListener("click", () => {
        
    body.classList.toggle("dark");

    // Guardar la preferencia en localStorage
    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        modeText.innerText = "Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        modeText.innerText = "Dark Mode";
    }

    });
    
    ;

