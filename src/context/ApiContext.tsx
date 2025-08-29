import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../services/api';
import { Post, Category, Tag, Comment, Media, Page } from '../types';

interface ApiContextType {
  // Posts
  posts: Post[];
  loading: {
    posts: boolean;
    categories: boolean;
    tags: boolean;
    comments: boolean;
    media: boolean;
    pages: boolean;
  };
  refreshPosts: () => Promise<void>;
  getPost: (id: string) => Post | undefined;
  createPost: (post: Omit<Post, 'id' | 'date' | 'modified' | 'author'>) => Promise<Post>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<Post | undefined>;
  deletePost: (id: string) => Promise<boolean>;
  
  // Categories
  categories: Category[];
  refreshCategories: () => Promise<void>;
  getCategory: (id: string) => Category | undefined;
  createCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category | undefined>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Tags
  tags: Tag[];
  refreshTags: () => Promise<void>;
  getTag: (id: string) => Tag | undefined;
  createTag: (tag: Omit<Tag, 'id'>) => Promise<Tag>;
  updateTag: (id: string, updates: Partial<Tag>) => Promise<Tag | undefined>;
  deleteTag: (id: string) => Promise<boolean>;
  
  // Comments
  comments: Comment[];
  refreshComments: () => Promise<void>;
  getComment: (id: string) => Comment | undefined;
  createComment: (comment: Omit<Comment, 'id' | 'date'>) => Promise<Comment>;
  updateComment: (id: string, updates: Partial<Comment>) => Promise<Comment | undefined>;
  deleteComment: (id: string) => Promise<boolean>;
  
  // Media
  media: Media[];
  refreshMedia: () => Promise<void>;
  getMedia: (id: string) => Media | undefined;
  createMedia: (media: Omit<Media, 'id' | 'date'>) => Promise<Media>;
  updateMedia: (id: string, updates: Partial<Media>) => Promise<Media | undefined>;
  deleteMedia: (id: string) => Promise<boolean>;
  
  // Pages
  pages: Page[];
  refreshPages: () => Promise<void>;
  getPage: (id: string) => Page | undefined;
  createPage: (page: Omit<Page, 'id' | 'date' | 'modified' | 'author'>) => Promise<Page>;
  updatePage: (id: string, updates: Partial<Page>) => Promise<Page | undefined>;
  deletePage: (id: string) => Promise<boolean>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  // State for all data types
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    posts: true,
    categories: true,
    tags: true,
    comments: true,
    media: true,
    pages: true,
  });

  // Initialize API on component mount
  useEffect(() => {
    const initializeApi = async () => {
      try {
        // Initialize the API (sets up localStorage if needed)
        api.initialize();
        
        // Load all data
        await Promise.all([
          refreshPosts(),
          refreshCategories(),
          refreshTags(),
          refreshComments(),
          refreshMedia(),
          refreshPages(),
        ]);
      } catch (error) {
        console.error('Error initializing API data:', error);
      }
    };
    
    initializeApi();
  }, []);

  // Posts methods
  const refreshPosts = async () => {
    try {
      setLoading(prev => ({ ...prev, posts: true }));
      const data = await api.posts.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };
  
  const getPost = (id: string) => posts.find(post => post.id === id);
  
  const createPost = async (postData: Omit<Post, 'id' | 'date' | 'modified' | 'author'>) => {
    const newPost = await api.posts.createPost(postData);
    await refreshPosts();
    return newPost;
  };
  
  const updatePost = async (id: string, updates: Partial<Post>) => {
    const updatedPost = await api.posts.updatePost(id, updates);
    if (updatedPost) {
      await refreshPosts();
    }
    return updatedPost;
  };
  
  const deletePost = async (id: string) => {
    const result = await api.posts.deletePost(id);
    if (result) {
      await refreshPosts();
    }
    return result;
  };

  // Categories methods
  const refreshCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const data = await api.categories.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };
  
  const getCategory = (id: string) => categories.find(category => category.id === id);
  
  const createCategory = async (categoryData: Omit<Category, 'id'>) => {
    const newCategory = await api.categories.createCategory(categoryData);
    await refreshCategories();
    return newCategory;
  };
  
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const updatedCategory = await api.categories.updateCategory(id, updates);
    if (updatedCategory) {
      await refreshCategories();
    }
    return updatedCategory;
  };
  
  const deleteCategory = async (id: string) => {
    const result = await api.categories.deleteCategory(id);
    if (result) {
      await refreshCategories();
    }
    return result;
  };

  // Tags methods
  const refreshTags = async () => {
    try {
      setLoading(prev => ({ ...prev, tags: true }));
      const data = await api.tags.getTags();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(prev => ({ ...prev, tags: false }));
    }
  };
  
  const getTag = (id: string) => tags.find(tag => tag.id === id);
  
  const createTag = async (tagData: Omit<Tag, 'id'>) => {
    const newTag = await api.tags.createTag(tagData);
    await refreshTags();
    return newTag;
  };
  
  const updateTag = async (id: string, updates: Partial<Tag>) => {
    const updatedTag = await api.tags.updateTag(id, updates);
    if (updatedTag) {
      await refreshTags();
    }
    return updatedTag;
  };
  
  const deleteTag = async (id: string) => {
    const result = await api.tags.deleteTag(id);
    if (result) {
      await refreshTags();
    }
    return result;
  };

  // Comments methods
  const refreshComments = async () => {
    try {
      setLoading(prev => ({ ...prev, comments: true }));
      const data = await api.comments.getComments();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };
  
  const getComment = (id: string) => comments.find(comment => comment.id === id);
  
  const createComment = async (commentData: Omit<Comment, 'id' | 'date'>) => {
    const newComment = await api.comments.createComment(commentData);
    await refreshComments();
    return newComment;
  };
  
  const updateComment = async (id: string, updates: Partial<Comment>) => {
    const updatedComment = await api.comments.updateComment(id, updates);
    if (updatedComment) {
      await refreshComments();
    }
    return updatedComment;
  };
  
  const deleteComment = async (id: string) => {
    const result = await api.comments.deleteComment(id);
    if (result) {
      await refreshComments();
    }
    return result;
  };

  // Media methods
  const refreshMedia = async () => {
    try {
      setLoading(prev => ({ ...prev, media: true }));
      const data = await api.media.getMedia();
      setMedia(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(prev => ({ ...prev, media: false }));
    }
  };
  
  const getMediaItem = (id: string) => media.find(item => item.id === id);
  
  const createMedia = async (mediaData: Omit<Media, 'id' | 'date'>) => {
    const newMedia = await api.media.createMedia(mediaData);
    await refreshMedia();
    return newMedia;
  };
  
  const updateMedia = async (id: string, updates: Partial<Media>) => {
    const updatedMedia = await api.media.updateMedia(id, updates);
    if (updatedMedia) {
      await refreshMedia();
    }
    return updatedMedia;
  };
  
  const deleteMedia = async (id: string) => {
    const result = await api.media.deleteMedia(id);
    if (result) {
      await refreshMedia();
    }
    return result;
  };

  // Pages methods
  const refreshPages = async () => {
    try {
      setLoading(prev => ({ ...prev, pages: true }));
      const data = await api.pages.getPages();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(prev => ({ ...prev, pages: false }));
    }
  };
  
  const getPage = (id: string) => pages.find(page => page.id === id);
  
  const createPage = async (pageData: Omit<Page, 'id' | 'date' | 'modified' | 'author'>) => {
    const newPage = await api.pages.createPage(pageData);
    await refreshPages();
    return newPage;
  };
  
  const updatePage = async (id: string, updates: Partial<Page>) => {
    const updatedPage = await api.pages.updatePage(id, updates);
    if (updatedPage) {
      await refreshPages();
    }
    return updatedPage;
  };
  
  const deletePage = async (id: string) => {
    const result = await api.pages.deletePage(id);
    if (result) {
      await refreshPages();
    }
    return result;
  };

  const contextValue: ApiContextType = {
    // Posts
    posts,
    loading,
    refreshPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    
    // Categories
    categories,
    refreshCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Tags
    tags,
    refreshTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
    
    // Comments
    comments,
    refreshComments,
    getComment,
    createComment,
    updateComment,
    deleteComment,
    
    // Media
    media,
    refreshMedia,
    getMedia: getMediaItem,
    createMedia,
    updateMedia,
    deleteMedia,
    
    // Pages
    pages,
    refreshPages,
    getPage,
    createPage,
    updatePage,
    deletePage,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};