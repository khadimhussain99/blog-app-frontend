import { useState, useEffect, useCallback } from 'react';
import { getPosts, deletePost as deletePostApi } from '../api/posts';

// Custom hook — encapsulates all post fetching logic for dashboard
const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getPosts();
      setPosts(data.posts);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const deletePost = async (id) => {
    // Optimistic update — remove from UI immediately
    setPosts((prev) => prev.filter((p) => p._id !== id));
    try {
      await deletePostApi(id);
    } catch (err) {
      // Rollback on failure
      fetchPosts();
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return { posts, loading, error, fetchPosts, deletePost };
};

export default usePosts;