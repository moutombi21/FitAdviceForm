import fastify from 'fastify';
import mongoose from 'mongoose';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: './.env' });

const app = fastify();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI;

// Dossier uploads
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Connexion MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5001,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Modèle Mongoose
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

// Middleware
await app.register(helmet);
await app.register(cors, {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});
await app.register(rateLimit, {
  timeWindow: '15 minutes',
  max: 100,
  errorResponse: { success: false, message: 'Too many requests from this IP' }
});
await app.register(multipart, {
  limits: {
    fileSize: 20 * 1024 * 1024 // 10 MB par fichier (modifiable selon ton besoin)
  }
});


// Route POST pour soumettre le formulaire
app.post('/api/submit-form', async (req, reply) => {
  try {
    const parts = req.parts();
    const body = {};
    const files = {
      identityDocument: [],
      residencyProof: [],
      qualifications: [],
      businessPermit: [],
      liabilityInsurance: [],
      companyStatutes: []
    };

    for await (const part of parts) {
      if (part.file) {
        const savePath = path.join(UPLOADS_DIR, `${Date.now()}-${part.filename}`);
        const writeStream = fs.createWriteStream(savePath);
        await new Promise((resolve, reject) => {
          part.file.pipe(writeStream);
          part.file.on('end', resolve);
          part.file.on('error', reject);
        });

        const fileData = {
          originalname: part.filename,
          mimetype: part.mimetype,
          size: part.file.bytesRead || 0,
          path: savePath,
          filename: path.basename(savePath)
        };

        if (files[part.fieldname]) {
          files[part.fieldname].push(fileData);
        }
      } else {
        body[part.fieldname] = part.value;
      }
    }

    const submission = new FormSubmission({
      ...body,
      ...files,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'Unknown'
    });

    await submission.save();

    return reply.send({
      success: true,
      message: 'Form submitted successfully!',
      data: { id: submission._id }
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    return reply.status(500).send({ success: false, message: 'Internal server error' });
  }
});

// Route GET pour récupérer toutes les soumissions
app.get('/api/submissions', {}, async (req, reply) => {
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
    console.error('Fetch error:', error);
    return reply.status(500).send({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
});

// Gestion des erreurs globales
app.setErrorHandler((error, req, reply) => {
  console.error('🚨 Global error:', error.stack);
  return reply.status(500).send({
    success: false,
    message: 'An unexpected error occurred'
  });
});

// Gestion des routes 404
app.setNotFoundHandler((req, reply) => {
  return reply.status(404).send({
    success: false,
    message: 'Endpoint not found'
  });
});

app.addHook('onRequest', (req, reply, done) => {
  console.log(`[${req.method}] ${req.url}`);
  done();
});

// Démarrage du serveur
const startServer = async () => {
  await connectDB();

  try {
    await app.listen({ port: PORT });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Allowed frontend: ${FRONTEND_URL}`);
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
