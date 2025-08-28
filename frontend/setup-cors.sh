#!/bin/bash

# Script para configurar CORS no Firebase Storage
echo "🔧 Configurando CORS no Firebase Storage..."

# Verificar se o Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado. Instale com: npm install -g firebase-tools"
    exit 1
fi

# Fazer login no Firebase
echo "🔐 Fazendo login no Firebase..."
firebase login

# Selecionar o projeto
echo "📁 Selecionando projeto hackathon-8b0e1..."
firebase use hackathon-8b0e1

# Fazer deploy das regras de storage
echo "🚀 Fazendo deploy das regras de storage..."
firebase deploy --only storage

echo "✅ CORS configurado! Tente fazer upload novamente."
echo "💡 Se ainda houver problemas, configure manualmente no Firebase Console:"
echo "   Storage > Rules > CORS"
