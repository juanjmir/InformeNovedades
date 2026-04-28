// ===============================
// Inicialización
// ===============================

// Fecha actual automática
document.getElementById("fecha").valueAsDate = new Date();

// Horarios
const horarioSelect = document.getElementById("horario");
horarioSelect.add(new Option("Seleccione horario", ""));

let hora = 8.5;
while (hora <= 22) {
  const h = Math.floor(hora);
  const m = hora % 1 === 0 ? "00" : "30";
  horarioSelect.add(new Option(`${h}:${m}`));
  hora += 1.5;
}

// Mostrar observaciones por checkbox
document.querySelectorAll(".problema").forEach(chk => {
  chk.addEventListener("change", e => {
    document
      .getElementById(`obs-${e.target.dataset.id}`)
      .classList.toggle("d-none", !e.target.checked);
  });
});

// ===============================
// Envío del formulario
// ===============================

document.getElementById("formInforme").addEventListener("submit", async e => {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  let y = 15;

  // Título
  pdf.setFontSize(16);
  pdf.text(
    "Informe de Novedades",
    pdf.internal.pageSize.getWidth() / 2,
    y,
    { align: "center" }
  );

  y += 10;

  pdf.setFontSize(10);
  pdf.text(
    "Describir cualquier novedad o problemática que ha detectado en el Laboratorio / Taller.",
    10, y
  );
  y += 7;
  pdf.text(
    "Favor una vez completa hacer entrega del documento al Operador Técnico de Laboratorio o Encargado de Laboratorio/Taller.",
    10, y
  );

  y += 15;

  // Nombre Docente
  pdf.text("Nombre Docente:", 10, y);
  pdf.line(45, y, 200, y);
  pdf.text(docente.value, 47, y - 1);
  y += 10;

  // Asignatura
  pdf.text("Nombre Asignatura/Laboratorio:", 10, y);
  pdf.line(75, y, 200, y);
  pdf.text(asignatura.value, 77, y - 1);
  y += 12;

  // Fecha / Horario / Lab
  pdf.text("Fecha:", 10, y);
  pdf.line(25, y, 45, y);
  pdf.text(fecha.value, 26, y - 1);

  pdf.text("Horario:", 60, y);
  pdf.line(78, y, 115, y);
  pdf.text(horario.value, 79, y - 1);

  pdf.text("Laboratorio N°:", 130, y);
  pdf.line(165, y, 200, y);
  pdf.text(laboratorio.value, 166, y - 1);

  y += 15;

  // Tabla Problemas
  const tableTop = y;
  const rowH = 10;

  pdf.rect(10, tableTop, 190, rowH);
  pdf.line(90, tableTop, 90, tableTop + rowH * 5);

  pdf.text("Problema", 12, tableTop + 7);
  pdf.text("Observaciones", 95, tableTop + 7);

  const problemas = [
    { label: "Falla de Equipos / Instrumentos / Software", id: "equipos" },
    { label: "Falta Equipamiento", id: "equipamiento" },
    { label: "Falta de Insumos", id: "insumos" },
    { label: "Otros", id: "otros" }
  ];

  problemas.forEach((p, i) => {
    const rowY = tableTop + rowH * (i + 1);
    pdf.rect(10, rowY, 190, rowH);
    pdf.line(90, rowY, 90, rowY + rowH);

    pdf.text(p.label, 12, rowY + 7);

    const obs = document.getElementById(`obs-${p.id}`).value || "";
    pdf.setFontSize(9);
    pdf.text(pdf.splitTextToSize(obs, 100), 95, rowY + 6);
    pdf.setFontSize(10);
  });

  y = tableTop + rowH * 5 + 15;

  // Descripción
  pdf.text("Descripción o Sugerencia:", 10, y);
  y += 6;

  for (let i = 0; i < 6; i++) {
    pdf.line(10, y, 200, y);
    y += 7;
  }

  pdf.text(
    pdf.splitTextToSize(descripcion.value, 185),
    12, y - 42
  );

  y += 10;

  // Firma
  pdf.text("Firma Docente,", 10, y);
  pdf.addImage(firma.toDataURL(), "PNG", 50, y - 5, 60, 25);

  // ===============================
  // Envío por Google Apps Script
  // ===============================
const mensajeCarga = document.getElementById("mensajeCarga");
mensajeCarga.style.display = "inline";
const pdfBase64 = pdf.output("datauristring").split(',')[1]; 

try {
  const payload = {
    correoUsuario: document.getElementById("correo").value,
    pdfBase64: pdfBase64
  };

  await fetch(
    "https://script.google.com/macros/s/AKfycbzAslIkRCiJLKyRCKIdU8JKPxNlfz4KsBuMBc2IitOpygQ4Ntr_Jk33r_hLMJta3Eg/exec",
    {
      method: "POST",
      mode: "no-cors", // Evita problemas de redirección CORS con Google
      cache: "no-cache",
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // Importante para Google Apps Script
      },
      body: JSON.stringify(payload)
    }
  );

  alert("Informe enviado correctamente ✅");
  document.getElementById("formInforme").reset();
  limpiarFirma();

} catch (err) {
  console.error(err);
  alert("Error al enviar el informe.");
}
finally {
  // 3. Finalización: Ocultar mensaje y reactivar botón
  // El bloque 'finally' se ejecuta siempre, funcione o falle el envío.
 
  mensajeCarga.style.display = "none";
}
});
