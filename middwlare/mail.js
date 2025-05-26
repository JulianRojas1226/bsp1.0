import nodemailer from "nodemailer";
import { google } from "googleapis"
const CLIENT_ID = "484470950938-6evqfk2s9ers4ebevjba5035nan0te12.apps.googleusercontent.com"
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04hvyQqrcbb_eCgYIARAAGAQSNwF-L9IrIkaFfaM0rtnSOlEnvz29eDfSLmyYrHWlKwcbhceIuyxiFkvZwjw_Bnqr_Pa1H1uwHck";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter() {
    const accessToken = await oAuth2Client.getAccessToken();

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "bassprod61@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
        tls: {
             rejectUnauthorized: false,
        }
    });
}

async function enviar_recuperacion({ destinatario, token }) {
    const enlace = `http://localhost:3000/reset-password?token=${token}`;
    try {
        const transporter = await createTransporter();
        console.log("Preparando para enviar a:", destinatario)
        let info = await transporter.sendMail({
            from: '"Bassprod" <bassprod61@gmail.com>',
            to: destinatario,
            subject: 'Recuperación de contraseña',
            html: `<p>Para restablecer tu contraseña, haz clic en:</p>
                   <a href="${enlace}">Restablecer contraseña</a>`,
        });

        console.log('Correo enviado:', info.messageId);
        return info;
    } catch (error) {
        
        throw error;
    }
}

export default enviar_recuperacion;

