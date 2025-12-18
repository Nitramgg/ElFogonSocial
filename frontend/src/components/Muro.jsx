import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import escudo from '../assets/escudo.png';
import { Trash2, Camera } from 'lucide-react'; // Añadimos Camera

const Muro = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null); // NUEVO: Estado para la foto/video
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
    if (!text.trim() && !file) return;

    const token = localStorage.getItem('token');
    
    // CORRECCIÓN: Usamos FormData para enviar archivos
    const formData = new FormData();
    formData.append('text', text);
    if (file) {
      formData.append('file', file); // El nombre 'file' debe coincidir con upload.single('file')
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
      setFile(null); // Limpiamos el archivo después de subir
      getPosts();
    } catch (error) {
      console.error("Error al publicar", error);
      alert("Error al subir el archivo. Verifica el tamaño.");
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
            {/* Botón de archivo oculto */}
            <input 
              type="file" 
              id="file-upload" 
              accept="image/*,video/*" 
              style={{ display: 'none' }} 
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file-upload" className={`btn-file ${file ? 'active' : ''}`}>
              <Camera size={20} />
              <span>{file ? "Archivo listo" : "Foto/Video"}</span>
            </label>

            <button type="submit" className="btn-publicar">Publicar</button>
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

            {/* MOSTRAR CONTENIDO MULTIMEDIA */}
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