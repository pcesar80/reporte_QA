let dataOriginal=[];
document.getElementById('fileInput').addEventListener('change',handleFile);
document.getElementById('filtroVersion').addEventListener('change',aplicarFiltro);

function handleFile(e){const r=new FileReader();r.onload=e=>{dataOriginal=parseCSV(e.target.result);cargarFiltroVersion(dataOriginal);procesar(dataOriginal);};r.readAsText(e.target.files[0]);}

function aplicarFiltro(){const v=document.getElementById("filtroVersion").value;procesar(v==="ALL"?dataOriginal:dataOriginal.filter(t=>t["versión"]===v));}

function procesar(data){
let estado={},severidad={},prioridad={};
let tareas=[],sinFecha=[],proyectos=new Set();

// 🔥 SOLO PARA EL GRÁFICO (AISLADO)
let tiempoPorIdTipo = {};
let tiposSet = new Set();

data.forEach(t=>{
const id=t.id;if(!id)return;

// 🔥 BLOQUE NUEVO (NO INTERFIERE)
const tipo = t.tipo || "Sin tipo";
const tiempo = parseFloat(t["tiempo invertido"]);

if(!isNaN(tiempo) && tiempo > 0){
  tiposSet.add(tipo);

  if(!tiempoPorIdTipo[id]){
    tiempoPorIdTipo[id]={};
  }

  if(!tiempoPorIdTipo[id][tipo]){
    tiempoPorIdTipo[id][tipo]=0;
  }

  tiempoPorIdTipo[id][tipo]+=tiempo;
}

// 🔽 TODO ORIGINAL

if(t.proyecto)proyectos.add(t.proyecto);

const est=(t.estado||"").trim();
const estL=est.toLowerCase().replace(/\s/g,'');
if(est)estado[est]=(estado[est]||0)+1;

if(t.severidad)severidad[t.severidad]=(severidad[t.severidad]||0)+1;
if(t.prioridad)prioridad[t.prioridad]=(prioridad[t.prioridad]||0)+1;

const inicio=parseFecha(t["fecha de inicio"]);
const fin=parseFecha(t["fecha de finalización"]);

if(["closed","cerrado","done"].includes(estL)){
  if(!inicio || !fin){

    let motivo="";
    if(!inicio && !fin) motivo="Falta inicio y fin";
    else if(!inicio) motivo="Falta inicio";
    else if(!fin) motivo="Falta fin";

    sinFecha.push({
      id,
      version:t["versión"],
      estado:est,
      motivo
    });
  }
  return;
}

if(!inicio){
  sinFecha.push({
    id,
    version:t["versión"],
    estado:est,
    motivo:"Falta inicio"
  });
  return;
}

const dias=Math.floor((new Date()-inicio)/86400000);
tareas.push({id,asunto:t.asunto||"-",estado:est,dias});
});

// 🔽 UI ORIGINAL

document.getElementById("tituloProyecto").innerText=[...proyectos].join("_");

document.querySelector("#topTareas tbody").innerHTML=
tareas.sort((a,b)=>b.dias-a.dias).slice(0,5).map(t=>`
<tr>
<td><a href="https://openproject.casademoneda.gob.ar/projects/nuevo-sistema-rrhh/work_packages/${t.id}/relations" target="_blank">${t.id}</a></td>
<td>${t.asunto}</td>
<td>${t.estado}</td>
<td>${t.dias}</td>
</tr>`).join("");

document.querySelector("#tablaSinFecha tbody").innerHTML=
sinFecha.map(t=>`
<tr>
<td><a href="https://openproject.casademoneda.gob.ar/projects/nuevo-sistema-rrhh/work_packages/${t.id}/relations" target="_blank">${t.id}</a></td>
<td>${t.version}</td>
<td>${t.estado}</td>
<td>${t.motivo||""}</td>
</tr>`).join("");

document.querySelector("#tablaTodos tbody").innerHTML=
data.map(t=>`
<tr>
<td><a href="https://openproject.casademoneda.gob.ar/projects/nuevo-sistema-rrhh/work_packages/${t.id}/relations" target="_blank">${t.id}</a></td>
<td>${t.asunto||"-"}</td>
<td>${t.estado||"-"}</td>
</tr>`).join("");

generarTabla("tablaEstado",estado);
generarTabla("tablaSeveridad",severidad);
generarTabla("tablaPrioridad",prioridad);

crearGraficoUniforme("estadoChart","severidadChart","prioridadChart",{estado,severidad,prioridad});

// 🔥 NUEVO GRÁFICO (PROTEGIDO)
try{
  renderGraficoTiempoAsignado({
    data: tiempoPorIdTipo,
    tipos: Array.from(tiposSet)
  });
}catch(e){
  console.error("grafico tiempo error:", e);
}

}

// 🔽 NO SE TOCA
function cargarDesdeOpenProject(){

  alert("⚠️ Recordá: debés estar logueado en OpenProject para poder descargar el CSV");

  const w = window.open("https://openproject.casademoneda.gob.ar", "_blank");

  setTimeout(()=>{
    try {
      if(!w || w.closed){
        alert("❌ No se pudo abrir OpenProject. Verificá bloqueador de popups.");
      } else {
        window.open(
          "https://openproject.casademoneda.gob.ar/projects/nuevo-sistema-rrhh/work_packages.csv?query_id=960",
          "_blank"
        );
      }
    } catch(e){
      alert("⚠️ Error al intentar acceder a OpenProject");
    }
  },1500);
}