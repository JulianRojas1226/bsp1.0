import nodemailer from "nodemailer";
import { google } from "googleapis";

// Variables sensibles (mejor si las pones en .env)
const CLIENT_ID = "484470950938-6evqfk2s9ers4ebevjba5035nan0te12.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04jbPVyhRunbhCgYIARAAGAQSNwF-L9IrFCW7l_ei91Gup2xJfMLq8q8ygC6P4Zcc9aZH-TdOzAW6tXf9kZ5YU840zNHipCULC00";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function enviarCorreo(destinatario, asunto, mensajeHtml) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "bassprod61@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: "BassProd <bassprod61@gmail.com>",
      to: destinatario,
      subject: asunto,
      html: mensajeHtml,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", result.response);
    return result;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
}

async function enviar_recuperacion({ destinatario, token }) {
  const enlace = `http://localhost:3000/reset-password?token=${token}`;
  const html = `<p>Para restablecer tu contraseña, haz clic en:</p>
                <a href="${enlace}">Restablecer contraseña</a>`;

  try {
    console.log("Preparando para enviar a:", destinatario);
    const info = await enviarCorreo(destinatario, "Recuperación de contraseña", html);
    console.log("Correo enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar recuperación:", error);
    throw error;
  }
}

export default enviar_recuperacion;


