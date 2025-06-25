document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log('⏳ Cargando todos los gráficos...');
    await Promise.all([
      cargargraficodiario(),
      cargarcategoria(),
      cargaranuales()
    ]);

    // Verificar elementos visuales presentes
    const elementosReporte = document.querySelectorAll('table, canvas, svg, .chart, .grafico, .data');
    const tieneElementosReporte = elementosReporte.length > 0;

    if (tieneElementosReporte) {
      console.log('✅ Todos los gráficos y elementos cargados');
      window.reporteGraficosListo = true;
    } else {
      console.warn('⚠️ No se encontraron elementos gráficos visibles. Aun así marcando como listo tras 5s');
      setTimeout(() => { window.reporteGraficosListo = true; }, 5000);
    }
  } catch (error) {
    console.error('❌ Error cargando gráficos:', error);
    window.reporteGraficosListo = true; // fallback
  }
});

// ─────────────── FUNCIONES DE GRÁFICOS ─────────────── //
let graficosCargados = {
  diario: null,
  categoria: null,
  anual:null
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
    const response = await fetch("/pdf/graficoventas_diarias")
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
      
      
    })
    
    await new Promise(resolve => {
  setTimeout(() => {
    const img = new Image();
    img.src = graficosCargados.diario.getDataURL({ pixelRatio: 2, backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)' });
    const target = document.getElementById('ventasDiarias');
    if (target) target.replaceWith(img);
    resolve(); // ← se espera explícitamente
  }, 1000);
})
    
  
    
  } catch (error) {
    console.error("Error al cargar el gráfico diario:", error);
    // Opcional: mostrar mensaje de error al usuario
    const contenedor = document.getElementById("ventasDiarias");
    if (contenedor) {
      contenedor.innerHTML = '<div style="text-align: center; padding: 20px; color: #dc3545;">Error al cargar los datos del gráfico</div>';
    }
  }
}

async function cargarcategoria() {
  try {
    const response = await fetch("/pdf/grafico_categoria");
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

    const valores = data.ingresos.map((v, i) => ({
      name: data.categorias[i],
      value: Number(v)
    }));

    if (!graficosCargados.categoria) {
      graficosCargados.categoria = echarts.init(contenedor, obtenerColores());
    }

    graficosCargados.categoria.setOption({
      title: {
        text: 'Ingresos por categoría',
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
          const valorFormateado = formatoCOP.format(params.value);
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
        animation: false,
        animationDuration: 0,
        animationEasing: 'none'
        
      },
      
    });
    await new Promise(resolve => {
  setTimeout(() => {
    const img = new Image();
    img.src = graficosCargados.categoria.getDataURL({ pixelRatio: 2, backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)' });
    const target = document.getElementById('categoria');
    if (target) target.replaceWith(img);
    resolve(); // ← se espera explícitamente
  }, 1000);
})
    window.addEventListener('resize', () => {
      if (graficosCargados.categoria) graficosCargados.categoria.resize();
    });

  } catch (error) {
    console.error("Error al cargar el gráfico categoria:", error);
    const contenedor = document.getElementById("categoria");
    if (contenedor) {
      contenedor.innerHTML = '<div style="text-align: center; padding: 20px; color: #dc3545;">Error al cargar los datos del gráfico</div>';
    }
  }
} 




async function cargaranuales() {
  try {
    const response = await fetch("/pdf/grafico_anual")
    const data = await response.json()
    const colores = obtenerColores()
    const contenedor = document.getElementById("comparativoAnualChart")

    if (graficosCargados.anual) {
      graficosCargados.anual.dispose()
    }

    graficosCargados.anual = echarts.init(contenedor, obtenerTema())

    graficosCargados.anual.setOption({
      tooltip: {
        trigger: 'axis',
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
            tooltip += `${param.marker} ${param.seriesName}: ${value}</br>`;
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
        type: 'category',
        data: data.mes,
        axisLine: { lineStyle: { color: colores.neutral } },
        axisLabel: { color: colores.text },
        splitLine: {
          lineStyle: {
            color: colores.isDark ? 'rgba(238, 238, 238, 0.1)' : 'rgba(55, 58, 64, 0.1)'
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Ventas ($)',
          axisLabel: { color: colores.text },
          axisLine: { lineStyle: { color: colores.neutral } },
          splitLine: { show: false }
        },
        {
          type: 'value',
          name: 'Cantidad',
          axisLabel: { color: colores.text },
          axisLine: { lineStyle: { color: colores.neutral } },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Ventas ($)',
          type: 'line',
          yAxisIndex: 0,
          data: data.total .map(v => parseInt(v)),
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: colores.text },
          areaStyle: { opacity: 0.3, color: colores.neutral },
          itemStyle: { color: colores.text }
        },
        {
          name: 'Cantidad',
          type: 'bar',
          yAxisIndex: 1,
          data: data.cantidad.map(v => parseInt(v)),
          itemStyle: {
            color: colores.primary,
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: colores.accent
            }
          }
        }
      ],
      animation: false,
      animationDuration: 0,
      animationEasing: 'none',
    });
    await new Promise(resolve => {
  setTimeout(() => {
    const img = new Image();
    img.src = graficosCargados.anual.getDataURL({ pixelRatio: 2, backgroundColor: colores.isDark ? 'rgba(55, 58, 64, 0.95)' : 'rgba(238, 238, 238, 0.95)'});
    const target = document.getElementById('comparativoAnualChart');
    if (target) target.replaceWith(img);
    resolve(); // ← se espera explícitamente
  }, 1000);
})
    // Escucha de resize sin duplicar
    window.removeEventListener('resize', resizeHandler); // Limpia anterior
    window.addEventListener('resize', resizeHandler);

    function resizeHandler() {
      if (graficosCargados.anual) {
        graficosCargados.anual.resize();
      }
    }

  } catch (error) {
    console.error("Error al cargar el gráfico anual:", error);
    const contenedor = document.getElementById("comparativoAnualChart");
    if (contenedor) {
      contenedor.innerHTML = '<div style="text-align: center; padding: 20px; color: #dc3545;">Error al cargar los datos del gráfico</div>';
    }
  }
}

