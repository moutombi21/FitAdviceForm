import fastify from 'fastify';
import mongoose from 'mongoose';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: './.env' });

const app = fastify();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI;

// Connexion MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Schéma Mongoose – simplifié pour éviter les erreurs
const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: false },
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
    size: Number // Taille estimée via part.file.bytesRead
  }],
  residencyProof: [{
    originalname: String,
    mimetype: String,
    size: Number
  }],
  qualifications: [{
    originalname: String,
    mimetype: String,
    size: Number
  }],
  businessPermit: [{
    originalname: String,
    mimetype: String,
    size: Number
  }],
  liabilityInsurance: [{
    originalname: String,
    mimetype: String,
    size: Number
  }],
  companyStatutes: [{
    originalname: String,
    mimetype: String,
    size: Number
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

// Route POST principale – soumission du formulaire
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
        // Ne sauvegarde pas le fichier – juste les métadonnées
        files[part.fieldname].push({
          originalname: part.filename,
          mimetype: part.mimetype,
          size: part.file.bytesRead
        });
      } else if (part.fieldname && typeof part.value === 'string') {
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

    // Envoi d’e-mail (si tu utilises Resend)
    // await sendEmail(submission);

    return reply.send({
      success: true,
      message: 'Formulaire soumis avec succès',
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

// Route GET – récupérer les soumissions
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

// Route inconnue
app.setNotFoundHandler((req, reply) => {
  return reply.status(404).send({
    success: false,
    message: 'Endpoint not found'
  });
});

// Démarrage du serveur
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