import { getComments, addComment } from '../api/posts';

const PostCard = ({
  post,
  user,
  expandedPost,
  setExpandedPost,
  comments,
  setComments,
  commentText,
  setCommentText,
  commentLoading,
  setCommentLoading,
  commentError,
  setCommentError,
}) => {
  const handleToggleComments = async (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }
    setExpandedPost(postId);

    if (!comments[postId]) {
      try {
        const { data } = await getComments(postId);
        setComments((prev) => ({ ...prev, [postId]: data.comments }));
      } catch (err) {
        console.error('Failed to load comments');
      }
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    setCommentLoading((prev) => ({ ...prev, [postId]: true }));
    setCommentError((prev) => ({ ...prev, [postId]: '' }));

    try {
      const { data } = await addComment(postId, text);

      setComments((prev) => ({
        ...prev,
        [postId]: [data.comment, ...(prev[postId] || [])],
      }));

      setCommentText((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setCommentError((prev) => ({
        ...prev,
        [postId]: err.response?.data?.message || 'Failed to add comment',
      }));
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div style={styles.card}>
      {/* Post content */}
      <h2 style={styles.postTitle}>{post.title}</h2>
      {post.tags?.length > 0 && (
        <div style={styles.tags}>
          {post.tags.map((tag) => (
            <span key={tag} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}
      <p style={styles.content}>
        {post.content.length > 150
          ? post.content.substring(0, 150) + '...'
          : post.content}
      </p>
      <div style={styles.meta}>
        <span>By {post.author?.name}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Toggle comments button */}
      <button
        onClick={() => handleToggleComments(post._id)}
        style={styles.commentToggle}
      >
        {expandedPost === post._id ? 'Hide Comments' : 'View Comments'}
      </button>

      {/* Comments section */}
      {expandedPost === post._id && (
        <div style={styles.commentsSection}>
          {/* Add comment — only for logged in users */}
          {user ? (
            <div style={styles.addComment}>
              <textarea
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={commentText[post._id] || ''}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                rows={2}
              />
              {commentError[post._id] && (
                <p style={styles.commentError}>{commentError[post._id]}</p>
              )}
              <button
                onClick={() => handleAddComment(post._id)}
                style={styles.commentBtn}
                disabled={commentLoading[post._id]}
              >
                {commentLoading[post._id] ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          ) : (
            <p style={styles.loginPrompt}>
              <a href="/login">Login</a> to leave a comment
            </p>
          )}

          {/* Comments list */}
          {!comments[post._id] ? (
            <p style={styles.loadingComments}>Loading comments...</p>
          ) : comments[post._id].length === 0 ? (
            <p style={styles.noComments}>No comments yet. Be the first!</p>
          ) : (
            comments[post._id].map((comment) => (
              <div key={comment._id} style={styles.comment}>
                <div style={styles.commentMeta}>
                  <span style={styles.commentAuthor}>
                    {comment.author?.name}
                  </span>
                  <span style={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={styles.commentContent}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  card: { background: '#fff', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  postTitle: { fontSize: '20px', fontWeight: 700, marginBottom: '10px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  tag: { background: '#f0f0f0', color: '#555', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' },
  content: { color: '#555', lineHeight: 1.7, marginBottom: '16px' },
  meta: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#999', borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginBottom: '12px' },
  commentToggle: { background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#555', width: '100%' },
  commentsSection: { marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' },
  addComment: { marginBottom: '16px' },
  commentInput: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'none', marginBottom: '8px' },
  commentBtn: { padding: '8px 18px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px' },
  commentError: { color: '#e94560', fontSize: '13px', marginBottom: '8px' },
  loginPrompt: { fontSize: '13px', color: '#999', marginBottom: '12px' },
  loadingComments: { fontSize: '13px', color: '#999' },
  noComments: { fontSize: '13px', color: '#999', textAlign: 'center', padding: '16px 0' },
  comment: { background: '#f8f9fa', borderRadius: '8px', padding: '12px', marginBottom: '10px' },
  commentMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  commentAuthor: { fontWeight: 600, fontSize: '13px' },
  commentDate: { fontSize: '12px', color: '#999' },
  commentContent: { fontSize: '14px', color: '#444', lineHeight: 1.6 },
};

export default PostCard;