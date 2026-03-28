import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, getPost, updatePost } from '../api/posts';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',      
    status: 'draft',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If editing, load existing post data
  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const { data } = await getPost(id);
          const { title, content, tags, status } = data.post;
          setForm({
            title,
            content,
            tags: tags ? tags.join(', ') : '', 
            status,
          });
        } catch (err) {
          setError('Failed to load post');
        }
      };
      fetchPost();
    }
  }, [id, isEditing]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      if (isEditing) {
        await updatePost(id, payload);
      } else {
        await createPost(payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isEditing ? 'Edit Post' : 'New Post'}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            type="text"
            name="title"
            placeholder="Post title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Content</label>
          <textarea
            style={styles.textarea}
            name="content"
            placeholder="Write your post content..."
            value={form.content}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Tags</label>
          <input
            style={styles.input}
            type="text"
            name="tags"
            placeholder="e.g. react, javascript, nodejs (comma separated)"
            value={form.tags}
            onChange={handleChange}
          />
          <small style={styles.hint}>Separate tags with commas</small>

          <label style={styles.label}>Status</label>
          <select
            style={styles.input}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button style={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { padding: '40px 20px' },
  card: { background: '#fff', padding: '40px', borderRadius: '12px', maxWidth: '780px', margin: '0 auto', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  title: { fontSize: '26px', marginBottom: '28px', fontWeight: 700 },
  label: { display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#444' },
  input: { display: 'block', width: '100%', padding: '12px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px' },
  textarea: { display: 'block', width: '100%', padding: '12px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', minHeight: '240px', resize: 'vertical' },
  hint: { display: 'block', color: '#999', fontSize: '12px', marginBottom: '20px' },
  error: { background: '#fff0f0', color: '#e94560', padding: '10px', borderRadius: '6px', marginBottom: '16px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' },
  cancelBtn: { padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', fontSize: '15px' },
  saveBtn: { padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600 },
};

export default PostEditor;