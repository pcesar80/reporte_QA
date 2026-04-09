let charts={};

function crearGraficoUniforme(id1,id2,id3,d){
  [id1,id2,id3].forEach(i=>charts[i]&&charts[i].destroy());
  const keys=Object.keys(d);

  [id1,id2,id3].forEach((id,i)=>{
    charts[id]=new Chart(document.getElementById(id),{
      type:'pie',
      data:{
        labels:Object.keys(d[keys[i]]),
        datasets:[{data:Object.values(d[keys[i]])}]
      }
    });
  });
}

// 🔥 NUEVO GRÁFICO (ID + TIPO) SEGURO
function renderGraficoTiempoAsignado(obj){

  try {

    const idCanvas = "tiempoChart";
    const canvas = document.getElementById(idCanvas);

    if(!canvas) return; // evita errores si no existe

    if(charts[idCanvas]){
      charts[idCanvas].destroy();
    }

    const ids = Object.keys(obj.data || {});
    const tipos = obj.tipos || [];

    const datasets = tipos.map(tipo => {

      const tipoLimpio = (tipo || "").toLowerCase().trim();

      const color = tipoLimpio.includes("casos de prueba")
        ? "#2ecc71"
        : "#e74c3c";

      return {
        label: tipo,
        data: ids.map(id => (obj.data[id] && obj.data[id][tipo]) ? obj.data[id][tipo] : 0),
        backgroundColor: color
      };
    });

    charts[idCanvas] = new Chart(canvas,{
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

        // 🔥 CLICK SEGURO (no rompe nada)
        onClick: function(evt, elements){
          try {
            if(elements && elements.length > 0){
              const index = elements[0].index;
              const idSeleccionado = ids[index];

              if(!idSeleccionado) return;

              const url = `https://openproject.casademoneda.gob.ar/projects/nuevo-sistema-rrhh/work_packages/${idSeleccionado}/relations`;

              window.open(url, '_blank');
            }
          } catch(e){
            console.error("Error click gráfico:", e);
          }
        }

      }
    });

    canvas.style.cursor = "pointer";

  } catch(e){
    console.error("Error renderGraficoTiempoAsignado:", e);
  }
}
