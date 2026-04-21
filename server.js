const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const transporter = nodemailer.createTransport({
  host: "smtp.inacap.cl",
  port: 25,
  secure: false,
  tls: { rejectUnauthorized: false }
});

app.post("/enviar", async (req, res) => {
  try {
    const { correo, pdf, docente } = req.body;

    const buffer = Buffer.from(
      pdf.replace(/^data:application\/pdf;base64,/, ""),
      "base64"
    );

    await transporter.sendMail({
      from: "Informe Novedades <noreply@inacap.cl>",
      to: correo,
      bcc: "carrerastitemuco@inacap.cl",
      subject: "Informe de Novedades – Laboratorio",
      text: `Informe enviado por el docente ${docente}`,
      attachments: [{
        filename: "Informe_Novedades.pdf",
        content: buffer
      }]
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error de envío" });
  }
});

app.listen(3000, () => {
  console.log("Servidor activo en puerto 3000");
});
