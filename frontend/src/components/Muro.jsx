import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import escudo from '../assets/escudo.png';
import { Trash2 } from 'lucide-react';

const Muro = () => {
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const getPosts = async () => {
    try {
      const res = await axios.get('https://elfogonsocial.onrender.com/api/posts');
      setPosts(res.data);
    } catch (error) {
      console.error("Error al obtener posts", error);
    }
  };

  useEffect(() => { getPosts(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('https://elfogonsocial.onrender.com/api/posts', { text }, config);
      setText('');
      getPosts();
    } catch (error) {
      console.error("Error al publicar", error);
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
        console.error("Error al borrar:", error.response?.data || error.message);
        alert("No tienes permiso para borrar este post.");
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="muro-container">
      <header className="header">
        <div className="club-brand">
          <img src={escudo} alt="" className="club-escudo-img" />
          <h1 className="club-title">El Fogón</h1>
        </div>
        <div className="user-nav">
          {/* CORRECCIÓN: Foto de perfil con No-Referrer */}
          {user?.foto ? (
            <img src={user.foto} referrerPolicy="no-referrer" alt="" className="user-avatar-nav" />
          ) : (
            <div className="user-avatar-nav" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'var(--celeste)', color:'black', fontWeight:'bold'}}>
              {user?.name?.charAt(0)}
            </div>
          )}
          <button onClick={logout} className="btn-logout-minimal">Salir</button>
        </div>
      </header>

      <div className="post-box">
        <form onSubmit={onSubmit}>
          <textarea 
            placeholder="¿Qué novedades hay en el club?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="post-footer">
            <button type="submit" className="btn-publicar">Publicar</button>
          </div>
        </form>
      </div>

      <div className="feed">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img src={post.user?.foto || 'https://via.placeholder.com/40'} referrerPolicy="no-referrer" className="avatar-post" alt="" />
                <div className="post-info">
                  <span className="post-author">{post.user?.name || 'Socio del Club'}</span>
                  <span className="post-date">{formatearFecha(post.createdAt)}</span>
                </div>
              </div>
              
              {/* COMPARACIÓN DE ID REFORZADA: String() asegura que coincidan */}
              {user && post.user && (String(user._id || user.id) === String(post.user._id || post.user)) && (
                <button onClick={() => deletePost(post._id)} className="btn-delete">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <p className="post-text">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Muro;