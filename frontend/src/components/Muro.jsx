import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import escudo from '../assets/escudo.png';
import { Trash2, Camera } from 'lucide-react';

const Muro = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Estado para el botón de carga
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
    
    // Obligamos a que haya texto para que el post no falle
    if (!text.trim()) {
      alert("Por favor, escribe una descripción para tu mensaje o foto.");
      return;
    }

    setIsUploading(true); // Bloqueamos el botón
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('text', text);
    if (file) {
      formData.append('file', file);
    }

    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
      } 
    };

    try {
      await axios.post('https://elfogonsocial.onrender.com/api/posts', formData, config);
      setText('');
      setFile(null);
      getPosts();
    } catch (error) {
      console.error("Error al publicar", error);
      alert("Hubo un error al subir. Intenta con una imagen más liviana.");
    } finally {
      setIsUploading(false); // Liberamos el botón
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
            placeholder="Escribe una descripción para tu foto o video..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="post-footer">
            <input 
              type="file" 
              id="file-upload" 
              accept="image/*,video/*" 
              style={{ display: 'none' }} 
              onChange={(e) => setFile(e.target.files[0])}
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className={`btn-file ${file ? 'active' : ''}`} style={{ opacity: isUploading ? 0.5 : 1 }}>
              <Camera size={20} />
              <span>{file ? "Archivo listo" : "Foto/Video"}</span>
            </label>

            <button 
              type="submit" 
              className="btn-publicar" 
              disabled={isUploading || !text.trim()}
              style={{ opacity: (isUploading || !text.trim()) ? 0.6 : 1 }}
            >
              {isUploading ? "Publicando..." : "Publicar"}
            </button>
          </div>
          {file && <p style={{fontSize:'12px', color:'var(--celeste)', marginTop:'5px'}}>Seleccionado: {file.name}</p>}
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
              
              {user && post.user && (String(user._id || user.id) === String(post.user._id || post.user)) && (
                <button onClick={() => deletePost(post._id)} className="btn-delete">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <p className="post-text">{post.text}</p>

            {post.image && (
              <img src={post.image} alt="Post" className="post-media" style={{width:'100%', borderRadius:'8px', marginTop:'10px'}} />
            )}
            {post.video && (
              <video src={post.video} controls className="post-media" style={{width:'100%', borderRadius:'8px', marginTop:'10px'}} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Muro;