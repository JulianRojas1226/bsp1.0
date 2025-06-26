import mpdf from "../modulos/mpdf.js";
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

const cpdf={
      get_pdf: async (req,res) => {
          const filtros = req.session.filtros || {};
          const {fecha_inicio, fecha_fin, empleado, categoria_e,metodo_p} = filtros;
          const egresos = await mpdf.egresos({fecha_inicio,fecha_fin,empleado,categoria_e})
          const pagos = await mpdf.pagos({fecha_inicio, fecha_fin, empleado,metodo_p})
          const ventas_u = await mpdf.ventas({fecha_inicio, fecha_fin, empleado,metodo_p})
          const egresos_d = await mpdf.egresos_d({fecha_inicio,fecha_fin,empleado,categoria_e})
          const pagos_d = await mpdf.pagos_d({fecha_inicio, fecha_fin, empleado,metodo_p})
          const ganancias = await mpdf.obtenerMargen({fecha_inicio, fecha_fin, empleado, metodo_p,categoria_e})
          console.log("datos de ganancias ", ganancias)
          res.render("pdf",{egresos,pagos,ventas_u,egresos_d,pagos_d,ganancias})
      },
      get_venta_diaria: async (req,res) => {
          try {
              const filtros = req.session.filtros || {};
              
            const data = await mpdf.ventasDiarias(filtros)
            const labels = data.map(d=>`${d.fecha}`)
            const values_cantidad = data.map(d=>`${d.cantidad_ventas}`)
            const values_ventas = data.map(d =>`${d.total_ventas}`)
            console.log("Labels generados:", labels); 
            console.log("valor de cantidades",values_cantidad)
            console.log("valor ventas",values_ventas)
            res.json({labels,values_cantidad,values_ventas})
          } catch (error) {
            res.status(500).send("error al obtener datos")
          }
        },
        get_ventas_categorias: async (req, res) => {
          try {
              const filtros = req.session.filtros || {};
            const data = await mpdf.ventasPorCategoria(filtros)
            const categorias = data.map(d => `${d.categoria}`)
            const cantidades = data.map(d => `${d.cantidad_vendida}`)
            const ingresos = data.map(d => `${d.total_ingresos}`)
            
            console.log("Categorías generadas:", categorias)
            console.log("Cantidades por categoría:", cantidades)
            console.log("Ingresos por categoría:", ingresos)
            
            res.json({ categorias, cantidades, ingresos })
          } catch (error) {
            console.error("Error al obtener datos de categorías:", error)
            res.status(500).send("Error al obtener datos")
          }
        },
        get_ventas_anuales: async (req,res) => {
          try {
            const data = await mpdf.comparativoAnual()
            const mes = data.map(d => `${d.mes}`)
            const cantidad = data.map(d =>`${d.cantidad_ventas}`)
            const total = data.map(d =>`${d.total_ventas}`)
            const promedio = data.map(d => `${d.ticket_promedio}`)
            
            res.json({mes,cantidad,total,promedio})
          } catch (error) {
            console.error("no se trajeron los datos", error)
          }
        },
  generarPdf: async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    if (req.headers.cookie) {
      await page.setExtraHTTPHeaders({ cookie: req.headers.cookie });
    }

    await page.goto('https://bsp1-0.onrender.com/pdf', { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px', 
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);

  } catch (error) {
    if (browser) await browser.close();
    console.error('❌ Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando PDF' });
  }
  }


    
}
export default cpdf