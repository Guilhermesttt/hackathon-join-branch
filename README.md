# Sereno - Plataforma de Saúde Mental

Uma plataforma inovadora que conecta tecnologia, comunidade e profissionais de saúde mental para democratizar o acesso ao cuidado psicológico.

## 🌟 Sobre o Projeto

O Sereno é uma rede social de apoio em saúde mental que funciona como uma ponte entre tecnologia, comunidade e profissionais da área psicológica. Oferecemos um espaço seguro e empático onde pessoas podem:

- **Compartilhar** sentimentos de forma anônima ou pública
- **Conectar-se** com grupos de apoio temáticos
- **Acessar** profissionais de saúde mental verificados
- **Acompanhar** seu bem-estar através de autoavaliações diárias
- **Evoluir** em sua jornada de saúde mental

## 🚀 Melhorias Implementadas

### ✅ **Firebase Integration Completa**
- **Firestore**: CRUD completo para posts, comentários, usuários e comunidades
- **Storage**: Upload de imagens com Firebase Storage (substituindo base64)
- **Real-time**: Atualizações em tempo real para posts e notificações
- **Authentication**: Sistema robusto com Google OAuth

### ✅ **Arquitetura de Código Melhorada**
- **Componentes Modulares**: Separação clara de responsabilidades
- **Hooks Customizados**: Lógica reutilizável para Firebase operations
- **Error Handling**: Sistema centralizado de tratamento de erros
- **TypeScript**: Tipagem forte para melhor desenvolvimento

### ✅ **UI/UX Aprimorada**
- **Componentes UI**: Biblioteca de componentes reutilizáveis
- **Loading States**: Estados de carregamento consistentes
- **Error States**: Tratamento visual de erros
- **Responsive Design**: Otimizado para todos os dispositivos

### ✅ **Funcionalidades Implementadas**
- **Posts**: Criação, edição, exclusão com Firebase
- **Comentários**: Sistema completo de comentários
- **Curtidas**: Sistema de likes em tempo real
- **Comunidades**: Criação e participação em grupos
- **Humor**: Rastreamento de humor com gráficos
- **Notificações**: Sistema completo de notificações
- **Busca**: Busca global por usuários, posts e comunidades
- **Upload de Imagens**: Sistema robusto com Firebase Storage

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com hooks modernos
- **Vite** para build otimizado
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **TypeScript** para tipagem

### Backend/Database
- **Firebase Authentication** para autenticação
- **Firestore** para banco de dados NoSQL
- **Firebase Storage** para armazenamento de arquivos
- **Firebase Functions** para lógica serverless

### Ferramentas de Desenvolvimento
- **ESLint** para linting
- **PostCSS** para processamento CSS
- **Terser** para minificação

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes UI reutilizáveis
│   ├── posts/           # Componentes relacionados a posts
│   ├── communities/     # Componentes de comunidades
│   ├── mood/            # Componentes de humor
│   ├── notifications/   # Componentes de notificações
│   ├── search/          # Componentes de busca
│   ├── profile/         # Componentes de perfil
│   ├── layout/          # Componentes de layout
│   └── common/          # Componentes comuns
├── contexts/            # React Contexts
├── hooks/               # Hooks customizados
├── services/            # Serviços Firebase
├── utils/               # Utilitários
├── types/               # Definições TypeScript
└── pages/               # Páginas da aplicação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Projeto Firebase configurado

### Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais Firebase

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Configuração do Firebase

1. **Criar projeto Firebase**
2. **Habilitar serviços**:
   - Authentication (Email/Password + Google)
   - Firestore Database
   - Storage
   - Functions (opcional)

3. **Configurar regras de segurança**:
   - Copiar `firestore.rules` para o console Firebase
   - Copiar `storage.rules` para o console Firebase

4. **Criar índices**:
   - Executar `firebase deploy --only firestore:indexes`

## 📊 Funcionalidades Principais

### 🔐 **Sistema de Autenticação**
- Login com email/senha
- Login com Google
- Registro de usuários e psicólogos
- Perfis personalizáveis

### 📝 **Sistema de Posts**
- Criação de posts públicos, privados ou anônimos
- Upload de imagens
- Sistema de tags
- Curtidas e comentários
- Edição e exclusão

### 👥 **Comunidades**
- Criação de grupos temáticos
- Participação em comunidades
- Posts específicos por comunidade
- Sistema de moderação

### 📈 **Rastreamento de Humor**
- Check-ins diários
- Gráficos de tendências
- Estatísticas personalizadas
- Histórico completo

### 🔔 **Sistema de Notificações**
- Notificações em tempo real
- Diferentes tipos (curtidas, comentários, etc.)
- Controle de leitura
- Configurações personalizáveis

### 🔍 **Busca Global**
- Busca por usuários
- Busca por comunidades
- Busca por posts
- Resultados em tempo real

## 🎨 Design System

### Cores (Mantidas do Design Original)
- **Background**: Preto (#000000)
- **Foreground**: Branco com opacidades variadas
- **Accent**: Azul e roxo gradientes
- **Success**: Verde
- **Warning**: Amarelo
- **Error**: Vermelho

### Tipografia
- **Font Family**: Montserrat
- **Weights**: 300, 400, 500, 600, 700
- **Scale**: Responsiva com Tailwind

### Componentes
- **Glass Morphism**: Efeitos de vidro com backdrop-blur
- **Gradientes**: Transições suaves de cor
- **Animações**: Micro-interações elegantes
- **Responsividade**: Mobile-first approach

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Build com análise
npm run build:analyze

# Preview do build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Limpeza
npm run clean
```

## 📱 Responsividade

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1280px+

## ♿ Acessibilidade

- **ARIA labels** apropriados
- **Navegação por teclado**
- **Contraste adequado**
- **Screen readers** compatíveis
- **Focus management**

## 🔒 Segurança

- **Validação de entrada** em todos os formulários
- **Sanitização** de conteúdo do usuário
- **Regras de segurança** Firebase configuradas
- **Rate limiting** para operações críticas
- **Error boundaries** para captura de erros

## 📈 Performance

### Otimizações Implementadas
- **Code splitting** automático
- **Lazy loading** de componentes
- **Image optimization** com Firebase Storage
- **Bundle analysis** integrado
- **Caching** estratégico

### Métricas
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 2MB

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes com coverage
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 🚀 Deploy

### Netlify (Recomendado)
```bash
npm run build
# Upload da pasta dist/ para Netlify
```

### Firebase Hosting
```bash
firebase login
firebase init hosting
firebase deploy
```

### Vercel
```bash
npm run build
vercel --prod
```

## 📚 Documentação Adicional

- [Guia de Contribuição](CONTRIBUTING.md)
- [Configuração Firebase](FIREBASE_SETUP.md)
- [Guia de Componentes](COMPONENTS.md)
- [API Reference](API.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Eduardo Silva Pimenta da Mota** - Desenvolvedor Full Stack
- **Bruno de Medeiros Rodrigues** - Desenvolvedor Frontend
- **Pedro Henrique Cavalcante dos Santos** - Designer UX/UI

## 📞 Suporte

- **Email**: contato@sereno.com
- **Discord**: [Servidor da Comunidade](https://discord.gg/sereno)
- **Issues**: [GitHub Issues](https://github.com/sereno/issues)

---

**Sereno** - Conecte-se, Entenda-se, Evolua. 💙