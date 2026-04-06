let charts={};
function crearGraficoUniforme(id1,id2,id3,d){[id1,id2,id3].forEach(i=>charts[i]&&charts[i].destroy());const keys=Object.keys(d);[id1,id2,id3].forEach((id,i)=>{charts[id]=new Chart(document.getElementById(id),{type:'pie',data:{labels:Object.keys(d[keys[i]]),datasets:[{data:Object.values(d[keys[i]])}]}});});}
