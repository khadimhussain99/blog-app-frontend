import { useState, useEffect, useCallback } from 'react';
import { getMyPosts, deletePost as deletePostApi, createPost as createPostApi, updatePost as updatePostApi } from '../api/posts';

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const { data } = await getMyPosts(filters);
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

  const createPost = async (postData) => {
    const tempId = `temp-${Date.now()}`;
    const tempPost = { ...postData, _id: tempId, createdAt: new Date().toISOString() };
    setPosts((prev) => [...prev, tempPost]);

    try {
      const { data } = await createPostApi(postData);
      setPosts((prev) => prev.map((p) => (p._id === tempId ? data.post : p)));
      return data.post;
    } catch (err) {
      setPosts((prev) => prev.filter((p) => p._id !== tempId));
      setError(err.response?.data?.message || 'Failed to create post');
      throw err;
    }
  };

  const updatePost = async (id, postData) => {
    const originalPost = posts.find((p) => p._id === id);
    if (!originalPost) return;

    setPosts((prev) => prev.map((p) => (p._id === id ? { ...p, ...postData } : p)));

    try {
      const { data } = await updatePostApi(id, postData);
      setPosts((prev) => prev.map((p) => (p._id === id ? data.post : p)));
      return data.post;
    } catch (err) {
      setPosts((prev) => prev.map((p) => (p._id === id ? originalPost : p)));
      setError(err.response?.data?.message || 'Failed to update post');
      throw err;
    }
  };

  const deletePost = async (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
    try {
      await deletePostApi(id);
    } catch (err) {
      fetchPosts();
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return { posts, loading, error, fetchPosts, createPost, updatePost, deletePost };
};

export default usePosts;