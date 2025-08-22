import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from '../config/env.js';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

const sendEmail = async ({ to, type, data }) => {
    let subject, html;

    switch (type) {
        case 'forgot-password':
            subject = 'Reset Your Password';
            html = `
                <p>Hi ${data.name},</p>
                <p>You requested to reset your password. Click the link below to proceed:</p>
                <a href="${data.resetLink}">Reset Password</a>
                <p>This link will expire in 15 minutes.</p>
            `;
            break;

        case 'password-changed':
            subject = 'Your Password Was Changed';
            html = `
                <p>Hello ${data.name},</p>
                <p>Your password was recently changed. If this wasn't you, please contact support immediately.</p>
            `;
            break;

        case 'welcome':
            subject = 'Welcome to Artzen 🎉';
            html = `
                <h2>Welcome aboard, ${data.name}!</h2>
                <p>We're excited to have you join Artzen.</p>
            `;
            break;

        default:
            throw new Error('Invalid email type');
    }

    await transporter.sendMail({
        from: `"Artzen" <${EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

export default sendEmail;
