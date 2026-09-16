import api from "@/utils/api";

export function getBlogs({ title, category, authorId } = {}) {
  const params = {};
  if (title) params.title = title;
  if (category && category !== "All") params.category = category;
  if (authorId) params.authorId = authorId;
  return api.get("/blogs", { params });
}

export function getBlogById(id) {
  return api.get(`/blogs/${id}`);
}

export function createBlog({ blogTitle, blog, category }) {
  return api.post("/blogs/create", { blogTitle, blog, category });
}

export function updateBlog(id, { blogTitle, blog, category }) {
  return api.put(`/blogs/update/${id}`, { blogTitle, blog, category });
}

export function deleteBlog(id) {
  return api.delete(`/blogs/delete/${id}`);
}
