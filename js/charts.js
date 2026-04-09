let charts={};

// 🔵 GRÁFICOS ORIGINALES (sin cambios funcionales)
function crearGraficoUniforme(id1,id2,id3,d){
  try {
    [id1,id2,id3].forEach(i=>charts[i]&&charts[i].destroy());
    const keys=Object.keys(d);

    [id1,id2,id3].forEach((id,i)=>{
      const el = document.getElementById(id);
      if(!el) return;

      charts[id]=new Chart(el,{
        type:'pie',
        data:{
          labels:Object.keys(d[keys[i]]),
          datasets:[{data:Object.values(d[keys[i]])}]
        }
      });
    });

  } catch(e){
    console.error("Error gráficos base:", e);
  }
}

// 🔥 NUEVO: GRÁFICO TIEMPO (ID + TIPO)
function renderGraficoTiempoAsignado(obj){

  try {

    const canvas = document.getElementById("tiempoChart");
    if(!canvas) return;

    if(charts["tiempoChart"]){
      charts["tiempoChart"].destroy();
    }

    const ids = Object.keys(obj?.data || {});
    const tipos = obj?.tipos || [];

    const datasets = tipos.map(tipo => {

      const tipoLimpio = (tipo || "").toLowerCase().trim();

      const color = tipoLimpio.includes("casos de prueba")
        ? "#2ecc71" // 🟢 Casos de prueba
        : "#e74c3c"; // 🔴 Issues

      return {
        label: tipo,
        data: ids.map(id => obj.data[id]?.[tipo] || 0),
        backgroundColor: color
      };
    });

    charts["tiempoChart"] = new Chart(canvas,{
      type:'bar',
      data:{
        labels: ids,
        datasets: datasets
      },
      options:{
        responsive:true,
        plugins:{
          legend:{display:true}
        },
        scales:{
          x:{stacked:true},
          y:{stacked:true}
        },

        // 🔗 CLICK EN BARRA → abre issue
        onClick: function(evt, elements){
          try {
            if(!elements || elements.length === 0) return;

            const index = elements[0].index;
            const idSeleccionado = this.data.labels[index];
            if(!idSeleccionado) return;

            const url = `https://openproject.casademoneda.gob.ar/projects/nuevo-sistema-rrhh/work_packages/${idSeleccionado}/relations`;
            window.open(url, '_blank');

          } catch(e){
            console.error("Error click gráfico:", e);
          }
        }
      }
    });

    // 🖱️ cursor tipo link
    canvas.style.cursor = "pointer";

  } catch(e){
    console.error("Error gráfico tiempo:", e);
  }
}