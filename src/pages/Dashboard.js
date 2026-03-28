import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import usePosts from '../hooks/usePosts';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { posts, loading, error, deletePost } = usePosts();

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      await deletePost(id);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container" style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome, {user.name} —{' '}
            <span style={styles.role}>{user.role}</span>
          </p>
        </div>
        <Link to="/posts/new" style={styles.newBtn}>+ New Post</Link>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {posts.length === 0 ? (
        <div style={styles.empty}>
          <p>No posts yet. <Link to="/posts/new">Create your first post</Link></p>
        </div>
      ) : (
        <div style={styles.table}>
          {/* Table header */}
          <div style={styles.tableHeader}>
            <span style={{ flex: 3 }}>Title</span>
            <span style={{ flex: 1 }}>Status</span>
            {user.role === 'admin' && <span style={{ flex: 1 }}>Author</span>}
            <span style={{ flex: 1 }}>Date</span>
            <span style={{ flex: 1 }}>Actions</span>
          </div>

          {/* Table rows */}
          {posts.map((post) => (
            <div key={post._id} style={styles.row}>
              <span style={{ flex: 3, fontWeight: 500 }}>{post.title}</span>
              <span style={{ flex: 1 }}>
                <span style={{
                  ...styles.badge,
                  background: post.status === 'published' ? '#d4edda' : '#fff3cd',
                  color: post.status === 'published' ? '#155724' : '#856404',
                }}>
                  {post.status}
                </span>
              </span>
              {user.role === 'admin' && (
                <span style={{ flex: 1, fontSize: '13px', color: '#666' }}>
                  {post.author?.name}
                </span>
              )}
              <span style={{ flex: 1, fontSize: '13px', color: '#666' }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span style={{ flex: 1, display: 'flex', gap: '8px' }}>
                <Link to={`/posts/edit/${post._id}`} style={styles.editBtn}>Edit</Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { padding: '40px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: 700 },
  subtitle: { color: '#666', marginTop: '4px' },
  role: { color: '#e94560', fontWeight: 600, textTransform: 'uppercase', fontSize: '13px' },
  newBtn: { background: '#e94560', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 },
  error: { background: '#fff0f0', color: '#e94560', padding: '10px', borderRadius: '6px', marginBottom: '16px' },
  empty: { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' },
  table: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'flex', padding: '14px 20px', background: '#f8f9fa', fontWeight: 600, fontSize: '13px', color: '#666', textTransform: 'uppercase' },
  row: { display: 'flex', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid #f0f0f0' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
  editBtn: { color: '#1a1a2e', background: '#f0f0f0', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' },
  deleteBtn: { color: '#fff', background: '#e94560', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '13px' },
};

export default Dashboard;