const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// ===== FUNÇÕES DE NOTIFICAÇÕES =====

// Criar notificação quando alguém curtir um post
exports.createLikeNotification = functions.firestore
  .document('posts/{postId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    const postId = context.params.postId;

    // Verificar se houve mudança nos likes
    const newLikes = newData.likes || [];
    const previousLikes = previousData.likes || [];
    
    if (newLikes.length > previousLikes.length) {
      // Novo like adicionado
      const newLike = newLikes.find(like => !previousLikes.includes(like));
      
      if (newLike && newLike !== newData.authorId) {
        try {
          await db.collection('notifications').add({
            type: 'like',
            title: 'Novo like no seu post',
            message: `Alguém curtiu seu post: "${newData.content.substring(0, 50)}..."`,
            recipientId: newData.authorId,
            senderId: newLike,
            postId: postId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false
          });
        } catch (error) {
          console.error('Erro ao criar notificação de like:', error);
        }
      }
    }
  });

// Criar notificação quando alguém comentar em um post
exports.createCommentNotification = functions.firestore
  .document('comments/{commentId}')
  .onCreate(async (snap, context) => {
    const commentData = snap.data();
    const postId = commentData.postId;

    try {
      // Buscar dados do post
      const postDoc = await db.collection('posts').doc(postId).get();
      if (postDoc.exists) {
        const postData = postDoc.data();
        
        // Não notificar se o comentário for do próprio autor do post
        if (commentData.authorId !== postData.authorId) {
          await db.collection('notifications').add({
            type: 'comment',
            title: 'Novo comentário no seu post',
            message: `Alguém comentou no seu post: "${commentData.content.substring(0, 50)}..."`,
            recipientId: postData.authorId,
            senderId: commentData.authorId,
            postId: postId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false
          });
        }
      }
    } catch (error) {
      console.error('Erro ao criar notificação de comentário:', error);
    }
  });

// ===== FUNÇÕES DE LIMPEZA =====

// Limpar arquivos temporários após 24 horas
exports.cleanupTempFiles = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    try {
      const bucket = admin.storage().bucket();
      const [files] = await bucket.getFiles({ prefix: 'temp/' });
      
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      for (const file of files) {
        const [metadata] = await file.getMetadata();
        const createdAt = new Date(metadata.timeCreated).getTime();
        
        if (createdAt < oneDayAgo) {
          await file.delete();
          console.log(`Arquivo temporário deletado: ${file.name}`);
        }
      }
      
      console.log('Limpeza de arquivos temporários concluída');
    } catch (error) {
      console.error('Erro na limpeza de arquivos temporários:', error);
    }
  });

// ===== FUNÇÕES DE ESTATÍSTICAS =====

// Calcular estatísticas de humor do usuário
exports.calculateMoodStats = functions.firestore
  .document('moods/{moodId}')
  .onCreate(async (snap, context) => {
    const moodData = snap.data();
    const userId = moodData.userId;

    try {
      // Buscar todos os moods do usuário
      const moodsSnapshot = await db.collection('moods')
        .where('userId', '==', userId)
        .orderBy('recordedAt', 'desc')
        .limit(30)
        .get();

      const moods = moodsSnapshot.docs.map(doc => doc.data());
      
      if (moods.length > 0) {
        // Calcular estatísticas
        const totalMood = moods.reduce((sum, mood) => sum + (mood.intensity || 0), 0);
        const averageMood = totalMood / moods.length;
        
        // Atualizar estatísticas do usuário
        await db.collection('users').doc(userId).update({
          moodStats: {
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            totalEntries: moods.length,
            averageMood: Math.round(averageMood * 10) / 10,
            lastMood: moodData.intensity,
            trend: moods.length > 1 ? 
              (moods[0].intensity > moods[1].intensity ? 'up' : 'down') : 'stable'
          }
        });
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas de humor:', error);
    }
  });

// ===== FUNÇÕES DE SEGURANÇA =====

// Verificar e banir usuários com muitas denúncias
exports.checkUserReports = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap, context) => {
    const reportData = snap.data();
    const reportedUserId = reportData.reportedUserId;

    try {
      // Contar denúncias do usuário
      const reportsSnapshot = await db.collection('reports')
        .where('reportedUserId', '==', reportedUserId)
        .where('status', '==', 'pending')
        .get();

      if (reportsSnapshot.size >= 5) {
        // Usuário com muitas denúncias - marcar para revisão
        await db.collection('users').doc(reportedUserId).update({
          status: 'under_review',
          reviewReason: 'Múltiplas denúncias',
          reviewDate: admin.firestore.FieldValue.serverTimestamp()
        });

        // Notificar administradores
        const adminsSnapshot = await db.collection('users')
          .where('role', '==', 'admin')
          .get();

        for (const adminDoc of adminsSnapshot.docs) {
          await db.collection('notifications').add({
            type: 'system',
            title: 'Usuário marcado para revisão',
            message: `Usuário ${reportedUserId} foi marcado para revisão devido a múltiplas denúncias`,
            recipientId: adminDoc.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar denúncias do usuário:', error);
    }
  });

// ===== FUNÇÕES DE BACKUP =====

// Backup diário dos dados importantes
exports.dailyBackup = functions.pubsub
  .schedule('every day 02:00')
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Backup de usuários
      const usersSnapshot = await db.collection('users').get();
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      await db.collection('backups').doc(`users_${timestamp}`).set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'users',
        count: usersData.length,
        data: usersData
      });

      // Backup de posts
      const postsSnapshot = await db.collection('posts').get();
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      await db.collection('backups').doc(`posts_${timestamp}`).set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'posts',
        count: postsData.length,
        data: postsData
      });

      console.log('Backup diário concluído com sucesso');
    } catch (error) {
      console.error('Erro no backup diário:', error);
    }
  });

// ===== FUNÇÕES DE EMAIL =====

// Enviar email de boas-vindas
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  try {
    // Aqui você pode integrar com um serviço de email como SendGrid
    // Por enquanto, apenas logamos a ação
    console.log(`Email de boas-vindas enviado para: ${user.email}`);
    
    // Criar notificação de boas-vindas
    await db.collection('notifications').add({
      type: 'system',
      title: 'Bem-vindo ao Sereno!',
      message: 'Obrigado por se juntar à nossa comunidade de saúde mental.',
      recipientId: user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
  }
});

module.exports = {
  createLikeNotification: exports.createLikeNotification,
  createCommentNotification: exports.createCommentNotification,
  cleanupTempFiles: exports.cleanupTempFiles,
  calculateMoodStats: exports.calculateMoodStats,
  checkUserReports: exports.checkUserReports,
  dailyBackup: exports.dailyBackup,
  sendWelcomeEmail: exports.sendWelcomeEmail
};
