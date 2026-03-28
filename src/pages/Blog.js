import { useState, useEffect } from 'react';
import { getPublicPosts } from '../api/posts';
import Spinner from '../components/Spinner';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await getPublicPosts({ page, limit: 6, search: query });
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  return (
    <div className="container" style={styles.wrapper}>
      <h1 style={styles.title}>Blog</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button style={styles.searchBtn} type="submit">Search</button>
      </form>

      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <p style={styles.empty}>No posts found.</p>
      ) : (
        <>
          <div style={styles.grid}>
            {posts.map((post) => (
              <div key={post._id} style={styles.card}>
                <h2 style={styles.postTitle}>{post.title}</h2>
                {post.excerpt && <p style={styles.excerpt}>{post.excerpt}</p>}
                <p style={styles.content}>
                  {post.content.length > 150
                    ? post.content.substring(0, 150) + '...'
                    : post.content}
                </p>
                <div style={styles.meta}>
                  <span>By {post.author?.name}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span style={styles.pageInfo}>
                Page {page} of {pagination.pages}
              </span>
              <button
                style={styles.pageBtn}
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  wrapper: { padding: '40px 20px' },
  title: { fontSize: '32px', fontWeight: 700, marginBottom: '24px' },
  searchForm: { display: 'flex', gap: '10px', marginBottom: '32px' },
  searchInput: { flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px' },
  searchBtn: { padding: '12px 24px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
  card: { background: '#fff', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  postTitle: { fontSize: '20px', fontWeight: 700, marginBottom: '10px' },
  excerpt: { color: '#e94560', fontSize: '14px', marginBottom: '10px', fontStyle: 'italic' },
  content: { color: '#555', lineHeight: 1.7, marginBottom: '16px' },
  meta: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#999', borderTop: '1px solid #f0f0f0', paddingTop: '12px' },
  empty: { textAlign: 'center', padding: '60px', color: '#999' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px' },
  pageBtn: { padding: '10px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px' },
  pageInfo: { fontSize: '14px', color: '#666' },
};

export default Blog;