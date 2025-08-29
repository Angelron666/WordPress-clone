export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'author' | 'contributor' | 'subscriber';
};

export type Post = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  author: User;
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'pending' | 'private' | 'trash';
  categories: Category[];
  tags: Tag[];
  comments: Comment[];
};

export type Page = {
  id: string;
  title: string;
  content: string;
  slug: string;
  author: User;
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'pending' | 'private' | 'trash';
  parent?: string;
  order: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  parent?: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
};

export type Comment = {
  id: string;
  author: {
    name: string;
    email: string;
    url?: string;
    avatar?: string;
  };
  content: string;
  date: string;
  status: 'approved' | 'pending' | 'spam' | 'trash';
  parent?: string;
};

export type Media = {
  id: string;
  title: string;
  url: string;
  alt?: string;
  description?: string;
  date: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
};

export type Theme = {
  id: string;
  name: string;
  screenshot: string;
  description: string;
  active: boolean;
};