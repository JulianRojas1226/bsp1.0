import { format } from "mysql2";
import nodemailer from "nodemailer"

const transporter = {
    gmail: nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: "bassprod61@gmail.com", 
            pass: "bassprod2025"
        }
    }),
    
}

function enviar_recuperacion({destinatario,token}){
    const enlace = `http://localhost:3000/reset-password?token=${token}`;
    let info = await transporter.sendMail({
        from: ' "Bassprod" "bassprod61@gmail.com"',
        to: destinatario,
        subject:
    })
}