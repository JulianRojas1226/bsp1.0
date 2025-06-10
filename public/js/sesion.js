document.addEventListener("DOMContentLoaded", async () => {
  await inicializarCalendario();
  await cargargraficodiario();
  await cargarcategoria()
  inicializarSidebar();
  aplicarTemaGuardado();
});

// ─────────────── FUNCIONES DE GRÁFICOS ─────────────── //
let graficosCargados = {
  diario: null,
  categoria: null
};
function formatCurrency(value) {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(value);
        }
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
    await cargargraficodiario();
    
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
async function cargargraficodiario() {
  try {
    const response = await fetch("/graficoventas_diarias")
    const data = await response.json()
    const colores = obtenerColores()
    
    // Limpiar gráfico anterior si existe
    if(graficosCargados.diario){
      graficosCargados.diario.dispose()
    }
    
    const contenedor = document.getElementById("ventasDiarias")
    if(!contenedor){
      console.error('Contenedor ventasDiarias no encontrado')
      return
    }
    
    // Inicializar nuevo gráfico
    graficosCargados.diario = echarts.init(contenedor, obtenerTema())
    
    graficosCargados.diario.setOption({
      tooltip: {
        trigger: 'axis', // Agregar trigger para mostrar ambas series
        backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)',
        borderColor: colores.accent,
        borderWidth: 1,
        textStyle: { color: colores.text },
        formatter: function(params) {
          let tooltip = `<strong>${params[0].axisValue}</strong><br/>`;
          params.forEach(param => {
            const value = param.seriesName === 'Ventas ($)' 
              ? `$${Number(param.value).toLocaleString('es-ES')}` 
              : `${param.value} unidades`;
            tooltip += `${param.marker} ${param.seriesName}: ${value}<br/>`;
          });
          return tooltip;
        }
      },
      
      legend: {
        data: ['Ventas ($)', 'Cantidad'],
        textStyle: { color: colores.text }
      },
      
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      
      xAxis: {
        type: "category",
        data: data.labels = data.labels.map(label => {
          const fecha = new Date(label);
          return `${fecha.getFullYear()}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getDate().toString().padStart(2, '0')}`;
        }),
        axisLine: { lineStyle: { color: colores.neutral } },
        axisLabel: { 
          color: colores.text,
           // Rotar etiquetas si hay muchas fechas
        },
        splitLine: { 
          lineStyle: { 
            color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' 
          } 
        }
      },
      
      yAxis: [
        {
          type: "value",
          name: 'Ventas ($)',
          position: 'left',
          scale: true,
          axisLine: { lineStyle: { color: colores.neutral } },
          axisLabel: {
            color: colores.text,
            formatter: '${value}' // Corregir formato
          },
          splitLine: {
            lineStyle: { 
              color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)' 
            }
          }
        },
        {
          type: 'value',
          name: 'Cantidad',
          position: 'right', // Corregir 'rigth' por 'right'
          axisLine: { lineStyle: { color: colores.neutral } },
          axisLabel: {
            color: colores.text,
            formatter: '{value}' // Corregir formato para cantidad
          },
          splitLine: { show: false } // Ocultar líneas del segundo eje
        }
      ],
      
      series: [
        {
          name: 'Ventas ($)',
          type: 'line',
          yAxisIndex: 0,
          data: data.values_ventas.map(v => parseFloat(v)), // Usar data en lugar de datosVentas
          
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: colores.text
          },
          areaStyle: {
            opacity: 0.3,
            color: colores.neutral
          },
          itemStyle: {
            color: colores.text 
          }
        },
        {
          name: 'Cantidad',
          type: 'bar',
          yAxisIndex: 1,
          data: data.values_cantidad.map(v => parseInt(v)),
          itemStyle: {
            color: colores.primary,
            borderRadius: [4, 4, 0, 0] // Esquinas redondeadas
          },
          emphasis: {
            itemStyle: {
              color: colores.accent// Color más oscuro al hacer hover
            }
          }
        }
      ],
      
      // Agregar animaciones
      animationDuration: 1500,
      animationEasing: 'cubicOut'
    })
    
    // Manejar resize de ventana
    const resizeHandler = () => {
      if (graficosCargados.diario) {
        graficosCargados.diario.resize();
      }
    };
    
    // Remover listener anterior si existe para evitar duplicados
    window.addEventListener('resize', () => {
      if (graficosCargados.categoria) {
        graficosCargados.diario.resize();
      }
    })
    
    console.log('Gráfico de ventas diarias cargado exitosamente');
    
  } catch (error) {
    console.error("Error al cargar el gráfico diario:", error);
    // Opcional: mostrar mensaje de error al usuario
    const contenedor = document.getElementById("ventasDiarias");
    if (contenedor) {
      contenedor.innerHTML = '<div style="text-align: center; padding: 20px; color: #dc3545;">Error al cargar los datos del gráfico</div>';
    }
  }
}

let modoCategoria = 'cantidad'; // puede ser 'cantidad' o 'ingreso'

async function cargarcategoria() {
  try {
    const response = await fetch("/grafico_categoria");
    const data = await response.json();
    const colores = obtenerColores();
    const contenedor = document.getElementById("categoria");

    if (!contenedor) {
      console.error('Contenedor "categoria" no encontrado');
      return;
    }

    const formatoCOP = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    // Elegir datos según el modo actual
    const valores = modoCategoria === 'ingreso'
      ? data.ingresos.map((v, i) => ({ name: data.categorias[i], value: Number(v) }))
      : data.cantidades.map((v, i) => ({ name: data.categorias[i], value: Number(v) }));

    // Inicializar o reutilizar
    if (!graficosCargados.categoria) {
      graficosCargados.categoria = echarts.init(contenedor, obtenerTema());
    }

    graficosCargados.categoria.setOption({
      title: {
        text: modoCategoria === 'ingreso' ? 'Ingresos por categoría' : 'Cantidad por categoría',
        left: 'center',
        textStyle: { color: colores.text }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)',
        borderColor: colores.accent,
        borderWidth: 1,
        textStyle: { color: colores.text },
        formatter: params => {
          const valorFormateado = modoCategoria === 'ingreso'
            ? formatoCOP.format(params.value)
            : params.value;
          return `${params.name}<br/>Valor: ${valorFormateado}<br/>Porcentaje: ${params.percent}%`;
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        data: data.categorias,
        textStyle: { color: colores.text }
      },
      series: {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: valores,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 12,
          fontWeight: 'bold',
          color: colores.text
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: idx => Math.random() * 200
      }
    });

    graficosCargados.categoria.resize();

  } catch (error) {
    console.error("Error al cargar el gráfico categoria:", error);
    const contenedor = document.getElementById("categoria");
    if (contenedor) {
      contenedor.innerHTML = '<div style="text-align: center; padding: 20px; color: #dc3545;">Error al cargar los datos del gráfico</div>';
    }
  }
}

// Botón o selector para alternar el modo
document.getElementById("modoCategoriaBtn").addEventListener("click", () => {
  modoCategoria = modoCategoria === 'cantidad' ? 'ingreso' : 'cantidad';
  cargarcategoria();
});

// Resize seguro
window.addEventListener('resize', () => {
  if (graficosCargados.categoria) graficosCargados.categoria.resize();
});



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