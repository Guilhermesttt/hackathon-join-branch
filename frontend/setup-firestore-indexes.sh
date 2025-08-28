#!/bin/bash

echo "🚀 Configurando índices do Firestore..."

# Fazer login no Firebase
echo "📝 Fazendo login no Firebase..."
firebase login

# Selecionar projeto
echo "🔍 Selecionando projeto..."
firebase use hackathon-8b0e1

# Deploy dos índices
echo "📊 Deployando índices do Firestore..."
firebase deploy --only firestore:indexes

echo "✅ Índices configurados com sucesso!"
echo "💡 Os avisos de índice devem parar de aparecer agora."
