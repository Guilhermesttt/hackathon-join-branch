import React, { useEffect, useState, useRef } from 'react';
import { Heart, Send, Trash2, MoreVertical, EyeOff, Reply, Edit3, Flag, User, AlertTriangle } from 'lucide-react';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../contexts/AuthContext';

const CommentsThread = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showMenuFor, setShowMenuFor] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showReportModal, setShowReportModal] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const commentInputRef = useRef(null);
  const { user } = useAuth();

  const {
    comments,
    loading,
    error,
    addComment,
    editComment,
    deleteComment,
    toggleCommentLike,
    isCommentLiked,
    hideComment,
    reportComment
  } = useComments(postId);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const success = await addComment(newComment, isAnonymous);
    if (success) {
      setNewComment('');
      setIsAnonymous(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    const success = await editComment(commentId, editText);
    if (success) {
      setEditingComment(null);
      setEditText('');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Tem certeza que deseja deletar este comentário?')) {
      const success = await deleteComment(commentId);
      if (success) {
        setShowMenuFor(null);
      }
    }
  };

  const handleHideComment = async (commentId) => {
    const success = await hideComment(commentId);
    if (success) {
      setShowMenuFor(null);
    }
  };

  const handleReportComment = async (commentId) => {
    if (!reportReason.trim()) {
      alert('Por favor, informe o motivo do report.');
      return;
    }

    const success = await reportComment(commentId, reportReason);
    if (success) {
      setShowReportModal(null);
      setReportReason('');
      setShowMenuFor(null);
    }
  };

  const handleLikeComment = async (commentId) => {
    await toggleCommentLike(commentId);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const canModifyComment = (comment) => {
    return user && (comment.authorId === user.uid || user.role === 'admin');
  };

  const canHideComment = (comment) => {
    return user && (comment.authorId === user.uid || user.role === 'admin');
  };

  const canReportComment = (comment) => {
    return user && comment.authorId !== user.uid;
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenuFor && !event.target.closest('.comment-menu')) {
        setShowMenuFor(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenuFor]);

  if (loading) {
    return (
      <div className="text-center text-white/50 py-8">
        <div className="loading-spinner mx-auto mb-4"></div>
        Carregando comentários...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        Erro ao carregar comentários: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="bg-white/5 rounded-lg p-4">
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-white/70" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                rows={3}
              />
              
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center space-x-2 text-sm text-white/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-white focus:ring-white/30"
                  />
                  <span>Comentar anonimamente</span>
                </label>
                
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:bg-white/30 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>Comentar</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`bg-white/5 rounded-lg p-4 ${comment.isHidden ? 'opacity-50' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  {comment.authorAvatar ? (
                    <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-white/70" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-medium text-white">{comment.authorName}</h5>
                      {comment.isAnonymous && (
                        <span className="text-xs bg-white/20 text-white/70 px-2 py-1 rounded-full">
                          Anônimo
                        </span>
                      )}
                      <span className="text-xs text-white/50">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                      {comment.isEdited && (
                        <span className="text-xs text-white/30">(editado)</span>
                      )}
                    </div>
                    
                    {/* Comment Actions Menu */}
                    <div className="relative comment-menu">
                      <button
                        onClick={() => setShowMenuFor(showMenuFor === comment.id ? null : comment.id)}
                        className="p-1 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {showMenuFor === comment.id && (
                        <div className="absolute right-0 top-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-10 min-w-[160px]">
                          <div className="py-1">
                            {/* Editar comentário (apenas para o autor) */}
                            {canModifyComment(comment) && (
                              <button
                                onClick={() => {
                                  setEditingComment(comment.id);
                                  setEditText(comment.content);
                                  setShowMenuFor(null);
                                }}
                                className="w-full px-4 py-2 text-left text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Editar</span>
                              </button>
                            )}
                            
                            {/* Deletar comentário (apenas para o autor ou admin) */}
                            {canModifyComment(comment) && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 transition-colors flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Deletar</span>
                              </button>
                            )}
                            
                            {/* Ocultar comentário (apenas para o autor ou admin) */}
                            {canHideComment(comment) && (
                              <button
                                onClick={() => handleHideComment(comment.id)}
                                className="w-full px-4 py-2 text-left text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                              >
                                <EyeOff className="w-4 h-4" />
                                <span>{comment.isHidden ? 'Mostrar' : 'Ocultar'}</span>
                              </button>
                            )}
                            
                            {/* Reportar comentário (não para o próprio autor) */}
                            {canReportComment(comment) && (
                              <button
                                onClick={() => setShowReportModal(comment.id)}
                                className="w-full px-4 py-2 text-left text-orange-400 hover:bg-orange-500/20 transition-colors flex items-center space-x-2"
                              >
                                <Flag className="w-4 h-4" />
                                <span>Reportar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Comment Content */}
                  {editingComment === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="px-3 py-1 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingComment(null);
                            setEditText('');
                          }}
                          className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/90 leading-relaxed">{comment.content}</p>
                  )}
                  
                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 mt-3">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        isCommentLiked(comment.id)
                          ? 'text-red-400'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isCommentLiked(comment.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm">{comment.likes?.length || 0}</span>
                    </button>
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 text-white/50 hover:text-white transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      <span className="text-sm">Responder</span>
                    </button>
                  </div>
                  
                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 pl-6 border-l-2 border-white/20">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full" />
                          ) : (
                            <User className="w-3 h-3 text-white/70" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <textarea
                            placeholder="Responder ao comentário..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                            rows={2}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <label className="flex items-center space-x-2 text-sm text-white/70 cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-white/30 bg-white/10 text-white focus:ring-white/30"
                              />
                              <span>Responder anonimamente</span>
                            </label>
                            
                            <button className="px-3 py-1 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-medium text-white">Reportar Comentário</h3>
            </div>
            
            <p className="text-white/70 mb-4">
              Por favor, informe o motivo pelo qual está reportando este comentário:
            </p>
            
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Descreva o motivo do report..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 mb-4"
              rows={3}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowReportModal(null);
                  setReportReason('');
                }}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReportComment(showReportModal)}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Reportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsThread;