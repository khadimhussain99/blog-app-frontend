import { useState, useEffect } from 'react';
import { getPublicPosts } from '../api/posts';
import useAuth from '../hooks/useAuth';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';

const Blog = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  // Comments state
  const [expandedPost, setExpandedPost] = useState(null); 
  const [comments, setComments] = useState({});           
  const [commentText, setCommentText] = useState({});     
  const [commentLoading, setCommentLoading] = useState({}); 
  const [commentError, setCommentError] = useState({});  

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
          placeholder="Search by title or tag..."
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
              <PostCard
                key={post._id}
                post={post}
                user={user}
                expandedPost={expandedPost}
                setExpandedPost={setExpandedPost}
                comments={comments}
                setComments={setComments}
                commentText={commentText}
                setCommentText={setCommentText}
                commentLoading={commentLoading}
                setCommentLoading={setCommentLoading}
                commentError={commentError}
                setCommentError={setCommentError}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={{
                  ...styles.pageBtn,
                  opacity: !pagination.hasPrev ? 0.5 : 1,
                }}
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span style={styles.pageInfo}>
                Page {page} of {pagination.totalPages}
              </span>
              <button
                style={{
                  ...styles.pageBtn,
                  opacity: !pagination.hasNext ? 0.5 : 1,
                }}
                disabled={!pagination.hasNext}
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
  empty: { textAlign: 'center', padding: '60px', color: '#999' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px' },
  pageBtn: { padding: '10px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px' },
  pageInfo: { fontSize: '14px', color: '#666' },
};

export default Blog;