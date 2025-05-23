// server/utils/sendEmail.js
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Charge les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

// Initialisation de Resend avec la clé
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (submission) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('❌ RESEND_API_KEY manquant dans .env');
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'admin@example.com',
      to: submission.email,
      subject: '✅ Formulaire reçu !',
      html: `
        <h3>Nouvelle inscription</h3>
        <p><strong>Nom:</strong> ${submission.firstName} ${submission.lastName}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p>Merci pour votre soumission.</p>
      `,
    });

    console.log('📧 Email envoyé via Resend:', data);
  } catch (err) {
    console.error("❌ Échec de l’envoi de l’e-mail:", err.message);
    throw err;
  }
};