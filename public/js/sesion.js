document.addEventListener("DOMContentLoaded", async () => {
  await cargarGraficoCostos();
  await cargarGraficoVentas();
  await cargarGraficoLineal();
  await inicializarCalendario();
  inicializarSidebar();
  aplicarTemaGuardado();
});

// ─────────────── FUNCIONES DE GRÁFICOS ─────────────── //
let graficosCargados = {
  costos: null,
  ventas: null,
  lineal: null
};

// Función para obtener colores según el tema actual
function obtenerColores() {
  const tema = localStorage.getItem("theme");
  const isDark = tema === "dark";
  
  // Colores para tema claro
  const coloresClaro = {
    background: '#EEEEEE',
    text: '#373A40',
    accent: '#DC5F00',
    neutral: '#686D76',
    primary: '#FF6500',
    secondary: '#1E3E62',
    isDark: false
  };
  
  // Colores para tema oscuro
  const coloresOscuro = {
    background: '#373A40',
    text: '#EEEEEE',
    accent: '#DC5F00',
    neutral: '#686D76',
    primary: '#FF6500',
    secondary: '#1E3E62',
    isDark: true
  };
  
  return isDark ? coloresOscuro : coloresClaro;
}

// Función para debug de colores


// Función para actualizar todos los gráficos con el nuevo tema
async function actualizarGraficos() {
  try {
    console.log('Actualizando gráficos con nuevo tema...');
    
    // Pequeño delay para asegurar que el DOM se actualice
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await cargarGraficoCostos();
    await cargarGraficoVentas();
    await cargarGraficoLineal();
    
    // También actualizar el calendario si existe
    if (typeof inicializarCalendario === 'function') {
      await inicializarCalendario();
    }
    
    console.log('Gráficos actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar gráficos:', error);
  }
}

// Función para crear tema personalizado basado en colores persistidos
function obtenerTema() {
  const colores = obtenerColores();
  
  return {
    backgroundColor: colores.background,
    textStyle: {
      color: colores.text,
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      textStyle: {
        color: colores.text,
        fontSize: 18,
        fontWeight: 'bold'
      },
      subtextStyle: {
        color: colores.neutral,
        fontSize: 14
      }
    },
    tooltip: {
      backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)',
      borderColor: colores.accent,
      borderWidth: 1,
      textStyle: {
        color: colores.text
      }
    },
    grid: {
      borderColor: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)'
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: colores.neutral } },
      axisTick: { lineStyle: { color: colores.neutral } },
      axisLabel: { color: colores.text },
      splitLine: { lineStyle: { color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' } }
    },
    valueAxis: {
      axisLine: { lineStyle: { color: colores.neutral } },
      axisTick: { lineStyle: { color: colores.neutral } },
      axisLabel: { color: colores.text },
      splitLine: { lineStyle: { color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' } }
    }
  };
}

// ─────────────── FUNCIONES DE CARGA DE GRÁFICOS ─────────────── //
async function cargarGraficoCostos() {
  try {
    const response = await fetch("/grafico-costo");
    const data = await response.json();
    const colores = obtenerColores();
    
    // Si ya existe el gráfico, lo destruimos antes de crear uno nuevo
    if (graficosCargados.costos) {
      graficosCargados.costos.dispose();
    }
    
    const contenedor = document.getElementById("grafico-costos");
    if (!contenedor) {
      console.error('Contenedor grafico-costos no encontrado');
      return;
    }
    
    graficosCargados.costos = echarts.init(contenedor, obtenerTema());
    graficosCargados.costos.setOption({
      title: { 
        text: "Costos meses",
        textStyle: {
          color: colores.text,
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)',
        borderColor: colores.accent,
        borderWidth: 1,
        textStyle: { color: colores.text },
        formatter: function(params) {
          return params.seriesName + '<br/>' + 
                 params.name + ': $' + Number(params.value).toLocaleString('es-ES');
        }
      },
      xAxis: { 
        type: "category", 
        data: data.labels,
        axisLine: { lineStyle: { color: colores.neutral } },
        axisLabel: { color: colores.text },
        splitLine: { lineStyle: { color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' } }
      },
      yAxis: { 
        type: "value",
        scale: true,
        axisLine: { lineStyle: { color: colores.neutral } },
        axisLabel: {
          color: colores.text,
          formatter: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value.toString();
          }
        },
        splitLine: { lineStyle: { color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' } }
      },
      series: {
        name: "Costo mensual",
        type: "line",
        data: data.values.map(v => Number(v)),
        itemStyle: {
          color: colores.accent,
          borderColor: colores.accent,
          borderWidth: 2
        },
        lineStyle: {
          color: colores.accent,
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colores.accent + '40' },
              { offset: 1, color: colores.accent + '10' }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            color: colores.accent,
            borderColor: colores.text,
            borderWidth: 2,
            shadowColor: colores.accent,
            shadowBlur: 10
          }
        }
      }
    });
    
    // Redimensionar en cambio de ventana
    window.addEventListener('resize', () => {
      if (graficosCargados.costos) {
        graficosCargados.costos.resize();
      }
    });
    
  } catch (error) {
    console.error("Error al cargar el gráfico de costos:", error);
  }
}

async function cargarGraficoVentas() {
  try {
    const response = await fetch("/graficobarras");
    const data = await response.json();
    const colores = obtenerColores();
    
    // Si ya existe el gráfico, lo destruimos antes de crear uno nuevo
    if (graficosCargados.ventas) {
      graficosCargados.ventas.dispose();
    }
    
    const contenedor = document.getElementById("grafico_ventas");
    if (!contenedor) {
      console.error('Contenedor grafico_ventas no encontrado');
      return;
    }
    
    graficosCargados.ventas = echarts.init(contenedor, obtenerTema());
    graficosCargados.ventas.setOption({
      title: { 
        text: "Ventas por mes",
        subtext: "En millones de pesos ($)",
        textStyle: {
          color: colores.text,
          fontSize: 18,
          fontWeight: 'bold'
        },
        subtextStyle: {
          color: colores.neutral,
          fontSize: 14
        }
      },
      tooltip: {
        backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)',
        borderColor: colores.accent,
        borderWidth: 1,
        textStyle: { color: colores.text },
        formatter: function(params) {
          return params.seriesName + '<br/>' + 
                 params.name + ': $' + Number(params.value).toLocaleString('es-ES');
        }
      },
      xAxis: { 
        type: "category", 
        data: data.labels,
        axisLine: { lineStyle: { color: colores.neutral } },
        axisLabel: { color: colores.text },
        splitLine: { lineStyle: { color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' } }
      },
      yAxis: { 
        type: "value",
        scale: true,
        axisLine: { lineStyle: { color: colores.neutral } },
        axisLabel: {
          color: colores.text,
          formatter: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value.toLocaleString('es-ES');
          }
        },
        splitLine: { lineStyle: { color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' } }
      },
      series: {
        name: "Ventas mensual",
        type: "bar",
        data: data.values.map(v => Number(v)),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colores.accent },
              { offset: 1, color: colores.accent + 'CC' }
            ]
          },
          borderColor: colores.accent,
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            color: colores.accent,
            shadowColor: colores.accent,
            shadowBlur: 10,
            shadowOffsetY: 2
          }
        },
        barWidth: '60%'
      }
    });
    
    // Redimensionar en cambio de ventana
    window.addEventListener('resize', () => {
      if (graficosCargados.ventas) {
        graficosCargados.ventas.resize();
      }
    });
    
  } catch (error) {
    console.error("Error al cargar el gráfico de ventas:", error);
  }
}

async function cargarGraficoLineal() {
  try {
    const response = await fetch("/graficolineal");
    const data = await response.json();
    const colores = obtenerColores();
    
    // Si ya existe el gráfico, lo destruimos antes de crear uno nuevo
    if (graficosCargados.lineal) {
      graficosCargados.lineal.dispose();
    }
    
    const contenedor = document.getElementById("grafico_lineal");
    if (!contenedor) {
      console.error('Contenedor grafico_lineal no encontrado');
      return;
    }
    
    graficosCargados.lineal = echarts.init(contenedor, obtenerTema());
    graficosCargados.lineal.setOption({
      title: { 
        text: "Ventas totales",
        subtext: "En millones de pesos ($)",
        textStyle: {
          color: colores.text,
          fontSize: 18,
          fontWeight: 'bold'
        },
        subtextStyle: {
          color: colores.neutral,
          fontSize: 14
        }
      },
      tooltip: {
        backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)',
        borderColor: colores.accent,
        borderWidth: 1,
        textStyle: { color: colores.text },
        formatter: function(params) {
          return params.seriesName + '<br/>' + 
                 params.name + ': $' + Number(params.value).toLocaleString('es-ES');
        }
      },
      xAxis: { 
        type: "category", 
        data: data.labels,
        axisLine: { lineStyle: { color: colores.neutral } },
        axisLabel: { color: colores.text },
        splitLine: { lineStyle: { color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' } }
      },
      yAxis: { 
        type: "value",
        scale: true,
        axisLine: { lineStyle: { color: colores.neutral } },
        axisLabel: {
          color: colores.text,
          formatter: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value.toLocaleString('es-ES');
          }
        },
        splitLine: { lineStyle: { color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' } }
      },
      series: {
        name: "Venta",
        type: "line",
        data: data.values.map(v => Number(v)),
        itemStyle: {
          color: colores.accent,
          borderColor: colores.accent,
          borderWidth: 2,
          borderRadius: '10px'
        },
        lineStyle: {
          color: colores.accent,
          width: 3
        },
        symbol: 'circle',
        symbolSize: 6,
        smooth: true,
        emphasis: {
          itemStyle: {
            color: colores.accent,
            borderColor: colores.text,
            borderWidth: 2,
            shadowColor: colores.accent,
            shadowBlur: 10
          }
        }
      }
    });
    
    // Redimensionar en cambio de ventana
    window.addEventListener('resize', () => {
      if (graficosCargados.lineal) {
        graficosCargados.lineal.resize();
      }
    });
    
  } catch (error) {
    console.error("Error al cargar el gráfico lineal:", error);
  }
}

// ─────────────── FUNCIONES AUXILIARES ─────────────── //
// Función para limpiar todos los gráficos (útil para limpiar memoria)
function limpiarGraficos() {
  Object.keys(graficosCargados).forEach(key => {
    if (graficosCargados[key]) {
      graficosCargados[key].dispose();
      graficosCargados[key] = null;
    }
  });
}

// Función para verificar el estado de los gráficos
function verificarEstadoGraficos() {
  console.log('Estado de gráficos cargados:', graficosCargados);
  console.log('Tema actual:', obtenerTemaGuardado());
}
// ─────────────── FUNCIÓN DEL CALENDARIO ─────────────── //

async function inicializarCalendario() {
  try {
    const calendario = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendario, {
      initialView: 'dayGridMonth',
      locale: 'es',
      eventColor: '#373A40',
      events: async function (fetchInfo, successCallback, failureCallback) {
        try {
          const response = await fetch("/calendario");
          const data = await response.json();
          successCallback(data);
        } catch (error) {
          console.error("Error al obtener eventos:", error);
          failureCallback(error);
        }
      },
      eventMouseEnter: function (info) {
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip-event";
        tooltip.innerHTML = `<strong>${info.event.start.toLocaleString()}</strong><br>${info.event.extendedProps.description || "Sin descripción"}`;

        Object.assign(tooltip.style, {
          position: "absolute",
          background: "#373A40",
          color: "#fff",
          padding: "6px",
          borderRadius: "5px",
          top: `${info.jsEvent.clientY + 10}px`,
          left: `${info.jsEvent.clientX + 10}px`,
          zIndex: 1000,
          fontSize: "14px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
          pointerEvents: "none"
        });

        document.body.appendChild(tooltip);

        info.el.addEventListener("mouseleave", () => {
          tooltip.remove();
        });
      }
    });

    calendar.render();
  } catch (error) {
    console.error("Error al inicializar el calendario:", error);
  }
}

// ─────────────── SIDEBAR Y TEMA OSCURO ─────────────── //

function inicializarSidebar() {
  const body = document.querySelector("body");
  const sidebar = body.querySelector(".sidebar");
  const toggle = body.querySelector(".toggle");
  const modeSwitch = body.querySelector(".toggle-switch");
  const modeText = body.querySelector(".mode-text");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    });
  }

  if (modeSwitch && modeText) {
    modeSwitch.addEventListener("click", () => {
      const dark = body.classList.toggle("dark");
      localStorage.setItem("theme", dark ? "dark" : "light");
      modeText.innerText = dark ? "Light Mode" : "Dark Mode";
      
      // Ejecutar debug y actualizar gráficos después del cambio de tema
      
      // Pequeño delay para asegurar que los estilos se hayan aplicado
    });
  }
}

function aplicarTemaGuardado() {
  const body = document.querySelector("body");
  const modeText = body.querySelector(".mode-text");

  const tema = localStorage.getItem("theme");
  if (tema === "dark") {
    body.classList.add("dark");
    if (modeText) modeText.innerText = "Light Mode";
  }
  
  // Debug inicial después de aplicar el tema guardado

}