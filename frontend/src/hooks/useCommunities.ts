import { useState, useEffect, useCallback } from 'react';
import { groupService, firebaseUtils } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  maxMembers: number;
  isPrivate: boolean;
  category: string;
  tags: string[];
  createdAt: any;
  updatedAt: any;
  lastActivity: any;
  creatorId: string;
  members: string[];
  onlineCount: number;
  isMember: boolean;
  posts: string[];
  rules: string[];
}

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Carregar todas as comunidades
  const loadCommunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedCommunities = await groupService.getGroups(50);
      
      // Converter timestamps e formatar dados
      const formattedCommunities = fetchedCommunities.map(community => ({
        ...community,
        createdAt: firebaseUtils.convertTimestamp(community.createdAt),
        updatedAt: firebaseUtils.convertTimestamp(community.updatedAt),
        lastActivity: firebaseUtils.convertTimestamp(community.lastActivity),
        isMember: community.members?.includes(user?.uid || '') || false
      }));
      
      setCommunities(formattedCommunities);
      
      // Filtrar comunidades do usuário
      const userComms = formattedCommunities.filter(comm => comm.isMember);
      setUserCommunities(userComms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar comunidades');
      console.error('Erro ao carregar comunidades:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Carregar comunidades por categoria
  const loadCommunitiesByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedCommunities = await groupService.getGroupsByCategory(category);
      
      // Converter timestamps e formatar dados
      const formattedCommunities = fetchedCommunities.map(community => ({
        ...community,
        createdAt: firebaseUtils.convertTimestamp(community.createdAt),
        updatedAt: firebaseUtils.convertTimestamp(community.updatedAt),
        lastActivity: firebaseUtils.convertTimestamp(community.lastActivity),
        isMember: community.members?.includes(user?.uid || '') || false
      }));
      
      setCommunities(formattedCommunities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar comunidades por categoria');
      console.error('Erro ao carregar comunidades por categoria:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Criar nova comunidade
  const createCommunity = useCallback(async (communityData: Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity' | 'members' | 'memberCount' | 'onlineCount' | 'posts' | 'isMember'>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const newCommunityData = {
        ...communityData,
        creatorId: user.uid,
        members: [user.uid],
        memberCount: 1,
        onlineCount: 0,
        posts: [],
        rules: communityData.rules || []
      };

      const result = await groupService.createGroup(newCommunityData);
      
      if (result.success) {
        // Recarregar comunidades para incluir a nova
        await loadCommunities();
        return result.groupId;
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao criar comunidade:', err);
      throw err;
    }
  }, [user, loadCommunities]);

  // Entrar em uma comunidade
  const joinCommunity = useCallback(async (communityId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const result = await groupService.joinGroup(communityId, user.uid);
      
      if (result.success) {
        // Atualizar estado local
        setCommunities(prevCommunities => 
          prevCommunities.map(community => {
            if (community.id === communityId) {
              return {
                ...community,
                members: [...community.members, user.uid],
                memberCount: community.memberCount + 1,
                isMember: true
              };
            }
            return community;
          })
        );
        
        // Atualizar lista de comunidades do usuário
        const community = communities.find(c => c.id === communityId);
        if (community) {
          setUserCommunities(prev => [...prev, { ...community, isMember: true }]);
        }
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao entrar na comunidade:', err);
      throw err;
    }
  }, [user, communities]);

  // Sair de uma comunidade
  const leaveCommunity = useCallback(async (communityId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const result = await groupService.leaveGroup(communityId, user.uid);
      
      if (result.success) {
        // Atualizar estado local
        setCommunities(prevCommunities => 
          prevCommunities.map(community => {
            if (community.id === communityId) {
              return {
                ...community,
                members: community.members.filter(id => id !== user.uid),
                memberCount: Math.max(0, community.memberCount - 1),
                isMember: false
              };
            }
            return community;
          })
        );
        
        // Remover da lista de comunidades do usuário
        setUserCommunities(prev => prev.filter(c => c.id !== communityId));
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao sair da comunidade:', err);
      throw err;
    }
  }, [user]);

  // Buscar comunidade por ID
  const getCommunityById = useCallback((communityId: string) => {
    return communities.find(community => community.id === communityId);
  }, [communities]);

  // Verificar se usuário é membro de uma comunidade
  const isUserMember = useCallback((communityId: string) => {
    if (!user) return false;
    const community = communities.find(c => c.id === communityId);
    return community ? community.isMember : false;
  }, [user, communities]);

  // Carregar comunidades na inicialização
  useEffect(() => {
    if (user) {
      loadCommunities();
    }
  }, [user, loadCommunities]);

  return {
    communities,
    userCommunities,
    loading,
    error,
    loadCommunities,
    loadCommunitiesByCategory,
    createCommunity,
    joinCommunity,
    leaveCommunity,
    getCommunityById,
    isUserMember,
    refreshCommunities: loadCommunities
  };
};
