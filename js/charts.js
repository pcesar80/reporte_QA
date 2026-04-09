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

// 🔥 NUEVA FUNCIÓN (para reemplazar el gráfico de asignado)
function renderGraficoTiempoAsignado(obj){

    const idCanvas = "tiempoChart";
  
    if(charts[idCanvas]){
      charts[idCanvas].destroy();
    }
  
    const ids = Object.keys(obj.data);
    const tipos = obj.tipos;
  
    const datasets = tipos.map(tipo => {

        const tipoLimpio = (tipo || "").toLowerCase().trim();
      
        const color = tipoLimpio.includes("casos de prueba")
          ? "#2ecc71" // verde
          : "#e74c3c"; // rojo (todo lo demás = issues)
      
        return {
          label: tipo,
          data: ids.map(id => obj.data[id][tipo] || 0),
          backgroundColor: color
        };
      });
  
    charts[idCanvas] = new Chart(document.getElementById(idCanvas),{
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
        onClick: (evt, elements) => {
            if(elements.length > 0){
              const index = elements[0].index;
              const idSeleccionado = ids[index];
          
              const url = `https://openproject.casademoneda.gob.ar/projects/nuevo-sistema-rrhh/work_packages/${idSeleccionado}/relations`;
          
              window.open(url, '_blank');
            }
          }
      }
    });
  }
