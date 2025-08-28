// Script para configurar CORS no Firebase Storage
// Execute este script após fazer deploy das regras de storage

const { Storage } = require('@google-cloud/storage');

async function configureStorageCors() {
  const storage = new Storage({
    projectId: 'hackathon-8b0e1',
    keyFilename: './service-account-key.json' // Você precisará criar este arquivo
  });

  const bucket = storage.bucket('hackathon-8b0e1.firebasestorage.app');

  try {
    await bucket.setCorsConfiguration([
      {
        origin: ['*'],
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
        maxAgeSeconds: 3600,
        responseHeader: [
          'Content-Type',
          'Access-Control-Allow-Origin',
          'Access-Control-Allow-Methods',
          'Access-Control-Allow-Headers'
        ]
      }
    ]);

    console.log('CORS configurado com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar CORS:', error);
  }
}

// Para usar este script:
// 1. npm install @google-cloud/storage
// 2. Crie uma service account key no Firebase Console
// 3. Execute: node setup-storage-cors.js

module.exports = { configureStorageCors };
