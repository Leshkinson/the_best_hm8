import nodemailer from 'nodemailer'
import {UserFromDBType} from "../types/types";


export const emailManager = {

    async sendEmailConfirmationMessage(email: string, subject: string, text: string) {
        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587, // 587
            secure: false,
            //service: "gmail",
            auth: {
                user: 'dmitri.aleks.work@gmail.com',
                pass: 'mygopuwhdfclsjvz'
            },
        })
        await transport.sendMail({
            from: "DimaCorpareited <dmitri.aleks.work@gmail.com>",
            to: email,
            subject: subject,
            html: text
        })
    }
}
