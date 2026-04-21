document.getElementById("formInforme").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar firma
  const blank = document.createElement("canvas");
  blank.width = canvas.width;
  blank.height = canvas.height;

  if (canvas.toDataURL() === blank.toDataURL()) {
    alert("Debe ingresar la firma del docente");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  let y = 15;

  pdf.setFontSize(14);
  pdf.text("Informe de Novedades", 10, y);
  y += 10;

  pdf.setFontSize(11);
  pdf.text(`Docente: ${docente.value}`, 10, y); y += 7;
  pdf.text(`Asignatura: ${asignatura.value}`, 10, y); y += 7;
  pdf.text(`Fecha: ${fecha.value}`, 10, y); y += 7;
  pdf.text(`Horario: ${horario.value}`, 10, y); y += 7;
  pdf.text(`Laboratorio: ${lab.value}`, 10, y); y += 10;

  pdf.text("Descripción:", 10, y); y += 6;
  pdf.text(pdf.splitTextToSize(descripcion.value, 180), 10, y);
  y += 30;

  pdf.text("Firma Docente:", 10, y); y += 5;
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, y, 60, 30);

  const pdfBlob = pdf.output("blob");
  const file = new File([pdfBlob], "Informe_Novedades.pdf", {
    type: "application/pdf"
  });

  // ✅ INTENTO 1: compartir archivo (mejor experiencia)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: "Informe de Novedades",
        text: "Adjunto Informe de Novedades del laboratorio.",
        files: [file]
      });
      return;
    } catch (err) {
      console.warn("Compartir cancelado, usando mailto");
    }
  }

  // ✅ INTENTO 2: fallback clásico (mailto)
  pdf.save("Informe_Novedades.pdf");

  const asunto = encodeURIComponent("Informe de Novedades – Laboratorio");
  const cuerpo = encodeURIComponent(
    "Estimado/a,\n\n" +
    "Adjunto envío Informe de Novedades del laboratorio.\n\n" +
    "Saludos."
  );

  window.location.href =
    `mailto:${correo.value}` +
    `?bcc=carrerastitemuco@inacap.cl` +
    `&subject=${asunto}` +
    `&body=${cuerpo}`;
});
