import api from './axios';

// Public
export const getPublicPosts = (params) => api.get('/posts', { params });

// Private
export const getMyPosts = (params) => api.get('/posts/my', { params });
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const updatePostStatus = (id, status) => api.patch(`/posts/${id}/status`, { status });

// Comments
export const getComments = (postId) => api.get(`/posts/${postId}/comments`);
export const addComment = (postId, content) => api.post(`/posts/${postId}/comments`, { content });