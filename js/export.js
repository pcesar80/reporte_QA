function exportarPDF(){

    const {jsPDF} = window.jspdf;
  
    const barra = document.querySelector(".barra-superior");
    const tabs = document.querySelector(".tabs");
  
    // 🔽 ocultar UI
    barra.style.display="none";
    tabs.style.display="none";
  
    html2canvas(document.body,{scale:2,useCORS:true}).then(c=>{
  
      const pdf = new jsPDF();
  
      pdf.addImage(c.toDataURL("image/png"),'PNG',10,10,190,0);
  
      // 🔥 GENERAR NOMBRE DINÁMICO
      const fecha = new Date().toISOString().split("T")[0];
  
      const mainView = document.getElementById("mainView").classList.contains("active");
      const noDateView = document.getElementById("noDateView").classList.contains("active");
      const allIssuesView = document.getElementById("allIssuesView").classList.contains("active");
  
      let nombre = "Reporte";
  
      if(mainView) nombre = "Dashboard general";
      else if(noDateView) nombre = "Tareas sin fecha";
      else if(allIssuesView) nombre = "Todas";
  
      pdf.save(`${nombre} ${fecha}.pdf`);
  
      // 🔽 restaurar UI
      barra.style.display="flex";
      tabs.style.display="flex";
  
    });
  }