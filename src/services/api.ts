import { Post, Category, Tag, Comment, Media, Page } from '../types';
import { format } from 'date-fns';
import { posts as initialPosts, categories as initialCategories, 
         tags as initialTags, comments as initialComments,
         media as initialMedia, themes as initialThemes, 
         pages as initialPages, currentUser } from '../data/mockData';

// LocalStorage keys
const STORAGE_KEYS = {
  POSTS: 'wordpress_clone_posts',
  CATEGORIES: 'wordpress_clone_categories',
  TAGS: 'wordpress_clone_tags',
  COMMENTS: 'wordpress_clone_comments',
  MEDIA: 'wordpress_clone_media',
  THEMES: 'wordpress_clone_themes',
  PAGES: 'wordpress_clone_pages',
};

// Initialize localStorage with mock data if it doesn't exist
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialPosts));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TAGS)) {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(initialTags));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialComments));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(initialMedia));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.THEMES)) {
    localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(initialThemes));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PAGES)) {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(initialPages));
  }
};

// Helper functions to work with localStorage
const getItem = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItem = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Format date to consistent string
const formatDate = (date: Date = new Date()): string => {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};

// API methods for Posts
export const postsApi = {
  getPosts: async (): Promise<Post[]> => {
    initializeStorage();
    return getItem<Post>(STORAGE_KEYS.POSTS);
  },

  getPostById: async (id: string): Promise<Post | undefined> => {
    initializeStorage();
    const posts = getItem<Post>(STORAGE_KEYS.POSTS);
    return posts.find(post => post.id === id);
  },

  createPost: async (post: Omit<Post, 'id' | 'date' | 'modified' | 'author'>): Promise<Post> => {
    initializeStorage();
    const posts = getItem<Post>(STORAGE_KEYS.POSTS);
    const now = formatDate();
    
    const newPost: Post = {
      ...post,
      id: generateId(),
      date: now,
      modified: now,
      author: currentUser, // Using the current user as author
    };
    
    const updatedPosts = [...posts, newPost];
    setItem(STORAGE_KEYS.POSTS, updatedPosts);
    
    return newPost;
  },

  updatePost: async (id: string, updates: Partial<Post>): Promise<Post | undefined> => {
    initializeStorage();
    const posts = getItem<Post>(STORAGE_KEYS.POSTS);
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) return undefined;
    
    const updatedPost = {
      ...posts[postIndex],
      ...updates,
      modified: formatDate(), // Update modified date
    };
    
    posts[postIndex] = updatedPost;
    setItem(STORAGE_KEYS.POSTS, posts);
    
    return updatedPost;
  },

  deletePost: async (id: string): Promise<boolean> => {
    initializeStorage();
    const posts = getItem<Post>(STORAGE_KEYS.POSTS);
    const updatedPosts = posts.filter(post => post.id !== id);
    
    if (updatedPosts.length === posts.length) return false;
    
    setItem(STORAGE_KEYS.POSTS, updatedPosts);
    return true;
  }
};

// API methods for Categories
export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    initializeStorage();
    return getItem<Category>(STORAGE_KEYS.CATEGORIES);
  },

  getCategoryById: async (id: string): Promise<Category | undefined> => {
    initializeStorage();
    const categories = getItem<Category>(STORAGE_KEYS.CATEGORIES);
    return categories.find(category => category.id === id);
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    initializeStorage();
    const categories = getItem<Category>(STORAGE_KEYS.CATEGORIES);
    
    const newCategory: Category = {
      ...category,
      id: generateId(),
    };
    
    const updatedCategories = [...categories, newCategory];
    setItem(STORAGE_KEYS.CATEGORIES, updatedCategories);
    
    return newCategory;
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category | undefined> => {
    initializeStorage();
    const categories = getItem<Category>(STORAGE_KEYS.CATEGORIES);
    const categoryIndex = categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) return undefined;
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...updates,
    };
    
    categories[categoryIndex] = updatedCategory;
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    
    return updatedCategory;
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    initializeStorage();
    const categories = getItem<Category>(STORAGE_KEYS.CATEGORIES);
    const updatedCategories = categories.filter(category => category.id !== id);
    
    if (updatedCategories.length === categories.length) return false;
    
    setItem(STORAGE_KEYS.CATEGORIES, updatedCategories);
    return true;
  }
};

// API methods for Tags
export const tagsApi = {
  getTags: async (): Promise<Tag[]> => {
    initializeStorage();
    return getItem<Tag>(STORAGE_KEYS.TAGS);
  },

  getTagById: async (id: string): Promise<Tag | undefined> => {
    initializeStorage();
    const tags = getItem<Tag>(STORAGE_KEYS.TAGS);
    return tags.find(tag => tag.id === id);
  },

  createTag: async (tag: Omit<Tag, 'id'>): Promise<Tag> => {
    initializeStorage();
    const tags = getItem<Tag>(STORAGE_KEYS.TAGS);
    
    const newTag: Tag = {
      ...tag,
      id: generateId(),
    };
    
    const updatedTags = [...tags, newTag];
    setItem(STORAGE_KEYS.TAGS, updatedTags);
    
    return newTag;
  },

  updateTag: async (id: string, updates: Partial<Tag>): Promise<Tag | undefined> => {
    initializeStorage();
    const tags = getItem<Tag>(STORAGE_KEYS.TAGS);
    const tagIndex = tags.findIndex(tag => tag.id === id);
    
    if (tagIndex === -1) return undefined;
    
    const updatedTag = {
      ...tags[tagIndex],
      ...updates,
    };
    
    tags[tagIndex] = updatedTag;
    setItem(STORAGE_KEYS.TAGS, tags);
    
    return updatedTag;
  },

  deleteTag: async (id: string): Promise<boolean> => {
    initializeStorage();
    const tags = getItem<Tag>(STORAGE_KEYS.TAGS);
    const updatedTags = tags.filter(tag => tag.id !== id);
    
    if (updatedTags.length === tags.length) return false;
    
    setItem(STORAGE_KEYS.TAGS, updatedTags);
    return true;
  }
};

// API methods for Comments
export const commentsApi = {
  getComments: async (): Promise<Comment[]> => {
    initializeStorage();
    return getItem<Comment>(STORAGE_KEYS.COMMENTS);
  },

  getCommentById: async (id: string): Promise<Comment | undefined> => {
    initializeStorage();
    const comments = getItem<Comment>(STORAGE_KEYS.COMMENTS);
    return comments.find(comment => comment.id === id);
  },

  createComment: async (comment: Omit<Comment, 'id' | 'date'>): Promise<Comment> => {
    initializeStorage();
    const comments = getItem<Comment>(STORAGE_KEYS.COMMENTS);
    
    const newComment: Comment = {
      ...comment,
      id: generateId(),
      date: formatDate(),
    };
    
    const updatedComments = [...comments, newComment];
    setItem(STORAGE_KEYS.COMMENTS, updatedComments);
    
    return newComment;
  },

  updateComment: async (id: string, updates: Partial<Comment>): Promise<Comment | undefined> => {
    initializeStorage();
    const comments = getItem<Comment>(STORAGE_KEYS.COMMENTS);
    const commentIndex = comments.findIndex(comment => comment.id === id);
    
    if (commentIndex === -1) return undefined;
    
    const updatedComment = {
      ...comments[commentIndex],
      ...updates,
    };
    
    comments[commentIndex] = updatedComment;
    setItem(STORAGE_KEYS.COMMENTS, comments);
    
    return updatedComment;
  },

  deleteComment: async (id: string): Promise<boolean> => {
    initializeStorage();
    const comments = getItem<Comment>(STORAGE_KEYS.COMMENTS);
    const updatedComments = comments.filter(comment => comment.id !== id);
    
    if (updatedComments.length === comments.length) return false;
    
    setItem(STORAGE_KEYS.COMMENTS, updatedComments);
    return true;
  }
};

// API methods for Media
export const mediaApi = {
  getMedia: async (): Promise<Media[]> => {
    initializeStorage();
    return getItem<Media>(STORAGE_KEYS.MEDIA);
  },

  getMediaById: async (id: string): Promise<Media | undefined> => {
    initializeStorage();
    const media = getItem<Media>(STORAGE_KEYS.MEDIA);
    return media.find(item => item.id === id);
  },

  createMedia: async (media: Omit<Media, 'id' | 'date'>): Promise<Media> => {
    initializeStorage();
    const mediaItems = getItem<Media>(STORAGE_KEYS.MEDIA);
    
    const newMedia: Media = {
      ...media,
      id: generateId(),
      date: formatDate(),
    };
    
    const updatedMedia = [...mediaItems, newMedia];
    setItem(STORAGE_KEYS.MEDIA, updatedMedia);
    
    return newMedia;
  },

  updateMedia: async (id: string, updates: Partial<Media>): Promise<Media | undefined> => {
    initializeStorage();
    const mediaItems = getItem<Media>(STORAGE_KEYS.MEDIA);
    const mediaIndex = mediaItems.findIndex(item => item.id === id);
    
    if (mediaIndex === -1) return undefined;
    
    const updatedMedia = {
      ...mediaItems[mediaIndex],
      ...updates,
    };
    
    mediaItems[mediaIndex] = updatedMedia;
    setItem(STORAGE_KEYS.MEDIA, mediaItems);
    
    return updatedMedia;
  },

  deleteMedia: async (id: string): Promise<boolean> => {
    initializeStorage();
    const mediaItems = getItem<Media>(STORAGE_KEYS.MEDIA);
    const updatedMedia = mediaItems.filter(item => item.id !== id);
    
    if (updatedMedia.length === mediaItems.length) return false;
    
    setItem(STORAGE_KEYS.MEDIA, updatedMedia);
    return true;
  }
};

// API methods for Pages
export const pagesApi = {
  getPages: async (): Promise<Page[]> => {
    initializeStorage();
    return getItem<Page>(STORAGE_KEYS.PAGES);
  },

  getPageById: async (id: string): Promise<Page | undefined> => {
    initializeStorage();
    const pages = getItem<Page>(STORAGE_KEYS.PAGES);
    return pages.find(page => page.id === id);
  },

  createPage: async (page: Omit<Page, 'id' | 'date' | 'modified' | 'author'>): Promise<Page> => {
    initializeStorage();
    const pages = getItem<Page>(STORAGE_KEYS.PAGES);
    const now = formatDate();
    
    const newPage: Page = {
      ...page,
      id: generateId(),
      date: now,
      modified: now,
      author: currentUser, // Using the current user as author
    };
    
    const updatedPages = [...pages, newPage];
    setItem(STORAGE_KEYS.PAGES, updatedPages);
    
    return newPage;
  },

  updatePage: async (id: string, updates: Partial<Page>): Promise<Page | undefined> => {
    initializeStorage();
    const pages = getItem<Page>(STORAGE_KEYS.PAGES);
    const pageIndex = pages.findIndex(page => page.id === id);
    
    if (pageIndex === -1) return undefined;
    
    const updatedPage = {
      ...pages[pageIndex],
      ...updates,
      modified: formatDate(), // Update modified date
    };
    
    pages[pageIndex] = updatedPage;
    setItem(STORAGE_KEYS.PAGES, pages);
    
    return updatedPage;
  },

  deletePage: async (id: string): Promise<boolean> => {
    initializeStorage();
    const pages = getItem<Page>(STORAGE_KEYS.PAGES);
    const updatedPages = pages.filter(page => page.id !== id);
    
    if (updatedPages.length === pages.length) return false;
    
    setItem(STORAGE_KEYS.PAGES, updatedPages);
    return true;
  }
};

// Export all API services
export const api = {
  posts: postsApi,
  categories: categoriesApi,
  tags: tagsApi,
  comments: commentsApi,
  media: mediaApi,
  pages: pagesApi,
  
  // Initialize all data
  initialize: initializeStorage
};

export default api;