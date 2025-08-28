// Dados mockados para desenvolvimento
export const mockPosts = [
  {
    id: '1',
    content: 'Hoje foi um dia incrível! Consegui enfrentar uma situação que me causava muita ansiedade. A terapia está realmente fazendo diferença na minha vida. É incrível como pequenos passos podem levar a grandes mudanças! 💪✨',
    author: 'Maria Silva',
    userId: 'user1',
    avatar: null,
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    likes: ['user2', 'user3'],
    commentCount: 2,
    shares: 1,
    tags: ['ansiedade', 'terapia', 'progresso'],
    isAnonymous: false,
    visibility: 'public',
    isEdited: false
  },
  {
    id: '2',
    content: 'Estou me sentindo um pouco perdido ultimamente. Alguém mais já passou por isso? Às vezes parece que estou andando em círculos...',
    author: 'João Santos',
    userId: 'user2',
    avatar: null,
    createdAt: new Date('2024-01-15T09:30:00'),
    updatedAt: new Date('2024-01-15T09:30:00'),
    likes: ['user1'],
    commentCount: 1,
    shares: 0,
    tags: ['reflexão', 'apoio'],
    isAnonymous: false,
    visibility: 'public',
    isEdited: false
  },
  {
    id: '3',
    content: 'Dica do dia: respiração 4-7-8. Inspire por 4 segundos, segure por 7, expire por 8. Funciona muito bem para momentos de estresse! 🧘‍♀️',
    author: 'Ana Costa',
    userId: 'user3',
    avatar: null,
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
    likes: ['user1', 'user2', 'user4'],
    commentCount: 0,
    shares: 3,
    tags: ['dica', 'respiração', 'estresse'],
    isAnonymous: false,
    visibility: 'public',
    isEdited: false
  },
  {
    id: '4',
    content: 'Post anônimo para testar funcionalidade',
    author: 'Usuário Anônimo',
    userId: 'user1',
    avatar: null,
    createdAt: new Date('2024-01-15T08:30:00'),
    updatedAt: new Date('2024-01-15T08:30:00'),
    likes: [],
    commentCount: 0,
    shares: 0,
    tags: ['teste'],
    isAnonymous: true,
    visibility: 'anonymous',
    isEdited: false
  }
];

export const mockGroups = [
  {
    id: 'ansiedade',
    name: 'Ansiedade & Estresse',
    description: 'Grupo de apoio para gerenciar ansiedade e estresse do dia a dia',
    icon: '🧠',
    memberCount: 1247,
    maxMembers: 2000,
    isPrivate: false,
    category: 'saude-mental',
    tags: ['ansiedade', 'estresse', 'apoio'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    lastActivity: new Date('2024-01-15T10:00:00'),
    creatorId: 'admin1',
    members: ['user1', 'user2', 'user3'],
    onlineCount: 45,
    isMember: true,
    posts: ['1', '2'],
    rules: [
      'Respeite todos os membros',
      'Não julgue as experiências dos outros',
      'Mantenha a confidencialidade',
      'Seja gentil e empático'
    ]
  },
  {
    id: 'bem-estar',
    name: 'Bem-estar & Autocuidado',
    description: 'Dicas e práticas para melhorar o bem-estar mental e físico',
    icon: '✨',
    memberCount: 892,
    maxMembers: 1500,
    isPrivate: false,
    category: 'bem-estar',
    tags: ['bem-estar', 'autocuidado', 'dicas'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lastActivity: new Date('2024-01-15T08:45:00'),
    creatorId: 'admin2',
    members: ['user1', 'user3', 'user4'],
    onlineCount: 32,
    isMember: true,
    posts: ['3'],
    rules: [
      'Compartilhe experiências positivas',
      'Ofereça suporte construtivo',
      'Mantenha o foco no bem-estar',
      'Celebre as conquistas dos outros'
    ]
  }
];

export const mockUsers = [
  {
    id: 'user1',
    displayName: 'Maria Silva',
    email: 'maria@email.com',
    photoURL: null,
    role: 'cliente',
    bio: 'Em busca de equilíbrio mental e emocional',
    location: 'São Paulo, SP',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'user2',
    displayName: 'João Santos',
    email: 'joao@email.com',
    photoURL: null,
    role: 'cliente',
    bio: 'Aprendendo a lidar com a ansiedade',
    location: 'Rio de Janeiro, RJ',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'user3',
    displayName: 'Ana Costa',
    email: 'ana@email.com',
    photoURL: null,
    role: 'cliente',
    bio: 'Psicóloga em formação, apaixonada por ajudar pessoas',
    location: 'Belo Horizonte, MG',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockNotifications = [
  {
    id: '1',
    type: 'like',
    title: 'Novo like no seu post',
    message: 'João Santos curtiu seu post sobre terapia',
    recipientId: 'user1',
    senderId: 'user2',
    senderName: 'João Santos',
    postId: '1',
    createdAt: new Date('2024-01-15T10:15:00'),
    read: false
  },
  {
    id: '2',
    type: 'comment',
    title: 'Novo comentário no seu post',
    message: 'Ana Costa comentou no seu post sobre ansiedade',
    recipientId: 'user2',
    senderId: 'user3',
    senderName: 'Ana Costa',
    postId: '2',
    createdAt: new Date('2024-01-15T10:00:00'),
    read: false
  }
];

export const mockComments = [
  {
    id: '1',
    postId: '1',
    authorId: 'user2',
    authorName: 'João Santos',
    authorAvatar: null,
    content: 'Que ótimo que está se sentindo melhor! A terapia realmente faz diferença.',
    likes: [],
    createdAt: new Date('2024-01-15T10:05:00')
  },
  {
    id: '2',
    postId: '1',
    authorId: 'user3',
    authorName: 'Ana Costa',
    authorAvatar: null,
    content: 'Continue assim! O progresso é gradual mas muito gratificante.',
    likes: ['user1'],
    createdAt: new Date('2024-01-15T10:10:00')
  }
];
