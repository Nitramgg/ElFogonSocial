import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import escudo from '../assets/escudo.png';
import { Trash2, Camera, X, Heart } from 'lucide-react';

const Muro = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const { user, logout } = useContext(AuthContext);

  const getPosts = async () => {
    try {
      const res = await axios.get('https://elfogonsocial.onrender.com/api/posts');
      setPosts(res.data);
    } catch (error) {
      console.error("Error al obtener posts", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  // --- FUNCIÓN DE LIKE CORREGIDA ---
  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Enviamos la petición al backend
      const res = await axios.put(`https://elfogonsocial.onrender.com/api/posts/${postId}/like`, {}, config);
      
      // IMPORTANTE: res.data ahora contiene el array de likes actualizado
      // Actualizamos el estado local para que el cambio sea instantáneo
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId ? { ...post, likes: res.data } : post
      ));
    } catch (error) {
      console.error("Error al procesar like", error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("Por favor, escribe una descripción.");
      return;
    }

    setIsUploading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('text', text);
    if (file) formData.append('file', file);

    const config = { 
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } 
    };

    try {
      await axios.post('https://elfogonsocial.onrender.com/api/posts', formData, config);
      setText('');
      setFile(null);
      getPosts();
    } catch (error) {
      console.error("Error al publicar", error);
    } finally {
      setIsUploading(false);
    }
  };

  const deletePost = async (id) => {
    if (window.confirm('¿Quieres eliminar este mensaje?')) {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        await axios.delete(`https://elfogonsocial.onrender.com/api/posts/${id}`, config);
        setPosts(posts.filter(p => p._id !== id));
      } catch (error) {
        console.error("Error al borrar:", error);
      }
    }
  };

  return (
    <div className="muro-container">
      {selectedImg && (
        <div className="modal-overlay" onClick={() => setSelectedImg(null)}>
          <button className="modal-close"><X size={30} color="white" /></button>
          <img src={selectedImg} alt="Zoom" className="modal-content" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <header className="header">
        <div className="club-brand">
          <img src={escudo} alt="" className="club-escudo-img" />
          <h1 className="club-title">El Fogón</h1>
        </div>
        <div className="user-nav">
          <img src={user?.foto} referrerPolicy="no-referrer" className="user-avatar-nav" alt="" />
          <button onClick={logout} className="btn-logout-minimal">Salir</button>
        </div>
      </header>

      <div className="post-box">
        <form onSubmit={onSubmit}>
          <textarea 
            placeholder="Escribe una descripción..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="post-footer">
            <input type="file" id="file-upload" accept="image/*,video/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} disabled={isUploading} />
            <label htmlFor="file-upload" className={`btn-file ${file ? 'active' : ''}`}>
              <Camera size={20} />
              <span>{file ? "Listo" : "Foto/Video"}</span>
            </label>
            <button type="submit" className="btn-publicar" disabled={isUploading || !text.trim()}>
              {isUploading ? "..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>

      <div className="feed">
        {posts.map((post) => {
          // Lógica robusta para verificar si el usuario dio like
          const currentUserId = user?._id || user?.id;
          const hasLiked = post.likes?.some(likeId => String(likeId) === String(currentUserId));

          return (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={post.user?.foto} referrerPolicy="no-referrer" className="avatar-post" alt="" />
                  <div className="post-info">
                    <span className="post-author">{post.user?.name}</span>
                  </div>
                </div>
                {user && post.user && (String(currentUserId) === String(post.user._id || post.user)) && (
                  <button onClick={() => deletePost(post._id)} className="btn-delete"><Trash2 size={18} /></button>
                )}
              </div>
              
              <p className="post-text">{post.text}</p>
              
              {post.image && (
                <img 
                  src={post.image} 
                  className="post-media clickable" 
                  alt="" 
                  onClick={() => setSelectedImg(post.image)} 
                />
              )}
              {post.video && <video src={post.video} controls className="post-media" />}

              {/* SECCIÓN DE ACCIONES (LIKE) */}
              <div className="post-actions">
                <button 
                  className={`btn-like ${hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                >
                  <Heart 
                    size={20} 
                    fill={hasLiked ? "#ff4b4b" : "none"} 
                    color={hasLiked ? "#ff4b4b" : "#888"} 
                  />
                  <span>{post.likes?.length || 0}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Muro;