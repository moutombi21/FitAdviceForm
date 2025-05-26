import fastify from 'fastify';
import mongoose from 'mongoose';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { sendEmail } from './utils/sendEmail.js';

// Charger les variables d'environnement
dotenv.config({ path: './.env' });

const app = fastify();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI;

// Dossier uploads – à utiliser en développement seulement
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Dossier uploads créé: ${UPLOADS_DIR}`);
} else {
  console.log(`Dossier uploads trouvé: ${UPLOADS_DIR}`);
}

// Connexion MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Schéma Mongoose
const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,

  address: String,
  city: String,
  zipCode: String,
  country: String,

  taxNumber: String,
  vatNumber: String,
  bankDetails: String,

  hourlyRate: Number,
  halfHourRate: Number,

  identityDocument: [{
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
    filename: String
  }],
  residencyProof: [{
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
    filename: String
  }],
  qualifications: [{
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
    filename: String
  }],
  businessPermit: [{
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
    filename: String
  }],
  liabilityInsurance: [{
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
    filename: String
  }],
  companyStatutes: [{
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
    filename: String
  }],

  ipAddress: String,
  userAgent: String
}, { timestamps: true });

const FormSubmission = mongoose.model('FormSubmission', formSchema);

// Middleware avec gestion d'erreur
try {
  await Promise.all([
    app.register(helmet),
    app.register(cors, {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }),
    app.register(rateLimit, {
      timeWindow: '15 minutes',
      max: 100,
      errorResponse: { success: false, message: 'Too many requests from this IP' }
    }),
    app.register(multipart, {
      limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB par fichier
      }
    })
  ]);

  console.log('✅ Middlewares registered');
} catch (err) {
  console.error('❌ Error registering middlewares:', err.message);
  process.exit(1);
}

// Hook global de logging
app.addHook('onRequest', (req, reply, done) => {
  console.log(`[${req.method}] ${req.url}`);
  done();
});

// Route POST principale
app.post('/api/submit-form', async (req, reply) => {
  try {
    const body = {};
    const files = {
      identityDocument: [],
      residencyProof: [],
      qualifications: [],
      businessPermit: [],
      liabilityInsurance: [],
      companyStatutes: []
    };

    for await (const part of req.parts()) {
      if (part.file && part.fieldname) {
        const originalFilename = part.filename || 'unnamed';
        const cleanFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const savePath = path.join(UPLOADS_DIR, `${Date.now()}-${cleanFilename}`);

        try {
          const writeStream = fs.createWriteStream(savePath);
          await new Promise((resolve, reject) => {
            part.file.pipe(writeStream);
            part.file.on('end', resolve);
            part.file.on('error', reject);
          });

          if (fs.existsSync(savePath)) {
            files[part.fieldname].push({
              originalname: originalFilename,
              cleanname: cleanFilename,
              mimetype: part.mimetype,
              size: fs.statSync(savePath).size,
              path: savePath,
              filename: path.basename(savePath)
            });
          }

        } catch (fileError) {
          console.error('Échec d’upload du fichier:', fileError.message);
          return reply.status(500).send({ success: false, message: 'Erreur lors de l’upload du fichier' });
        }

      } else if (part.fieldname && typeof part.value === 'string') {
        // Champ texte
        body[part.fieldname] = part.value;
      }
    }

    const submission = new FormSubmission({
      ...body,
      ...files,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'Unknown User Agent'
    });

    await submission.save();

    await sendEmail(submission);

    return reply.send({
      success: true,
      message: 'Form submitted successfully!',
      data: {
        id: submission._id
      }
    });

  } catch (error) {
    console.error('❌ Internal server error:', error.message);
    return reply.status(500).send({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Route GET pour récupérer les soumissions
app.get('/api/submissions', async (req, reply) => {
  try {
    const submissions = await FormSubmission.find({})
      .select('-__v -updatedAt -ipAddress -userAgent')
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      count: submissions.length,
      data: submissions
    });

  } catch (error) {
    console.error('Fetch error:', error.message);
    return reply.status(500).send({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
});

// Gestion des erreurs centralisée
app.setErrorHandler((error, req, reply) => {
  console.error('🚨 Global error:', error.stack);
  return reply.status(500).send({
    success: false,
    message: 'An unexpected error occurred'
  });
});

// Route inconnue – Bien implémentée
app.setNotFoundHandler((req, reply) => {
  return reply.status(404).send({
    success: false,
    message: 'Endpoint not found'
  });
});

// Démarrage du serveur – après toutes les routes
const startServer = async () => {
  await connectDB();

  try {
    await app.ready(); // ⚠️ Important : attend que toutes les routes soient chargées
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`🌐 Allowed frontend: ${FRONTEND_URL}`);
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();