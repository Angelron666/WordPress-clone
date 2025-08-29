import { User, Post, Category, Tag, Comment, Media, Theme, Page } from '../types';
import { format } from 'date-fns';

export const currentUser: User = {
  id: '1', // Changed from number to string to match User type
  username: 'admin',
  name: 'Administrator',
  email: 'admin@wordpress-clone.com',
  avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
  role: 'admin',
};

export const categories: Category[] = [
  {
    id: '1',
    name: 'Uncategorized',
    slug: 'uncategorized',
    description: 'Default category',
    count: 3,
  },
  {
    id: '2',
    name: 'Technology',
    slug: 'technology',
    description: 'Tech related posts',
    count: 2,
  },
  {
    id: '3',
    name: 'Design',
    slug: 'design',
    description: 'Design related posts',
    count: 1,
  },
  {
    id: '4',
    name: 'Business',
    slug: 'business',
    description: 'Business related posts',
    count: 1,
  },
];

export const tags: Tag[] = [
  {
    id: '1',
    name: 'WordPress',
    slug: 'wordpress',
    description: 'WordPress related posts',
    count: 2,
  },
  {
    id: '2',
    name: 'React',
    slug: 'react',
    description: 'React related posts',
    count: 2,
  },
  {
    id: '3',
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript related posts',
    count: 3,
  },
  {
    id: '4',
    name: 'CSS',
    slug: 'css',
    description: 'CSS related posts',
    count: 1,
  },
];

export const comments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    },
    content: 'Great post! I really enjoyed reading it.',
    date: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    status: 'approved',
  },
  {
    id: '2',
    author: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://www.gravatar.com/avatar/11111111111111111111111111111111?d=mp&f=y',
    },
    content: 'Thanks for sharing this information. It was very helpful.',
    date: format(new Date(2023, 10, 16), 'yyyy-MM-dd HH:mm:ss'),
    status: 'approved',
  },
  {
    id: '3',
    author: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      avatar: 'https://www.gravatar.com/avatar/22222222222222222222222222222222?d=mp&f=y',
    },
    content: 'I have a question about this topic. Can you elaborate more?',
    date: format(new Date(2023, 10, 17), 'yyyy-MM-dd HH:mm:ss'),
    status: 'pending',
  },
];

export const media: Media[] = [
  {
    id: '1',
    title: 'Sample Image 1',
    url: 'https://images.pexels.com/photos/6827515/pexels-photo-6827515.jpeg',
    alt: 'Sample image 1',
    description: 'A sample image for testing',
    date: format(new Date(2023, 10, 10), 'yyyy-MM-dd HH:mm:ss'),
    type: 'image',
    size: 1024 * 100, // 100KB
    dimensions: {
      width: 1600,
      height: 900,
    },
  },
  {
    id: '2',
    title: 'Sample Image 2',
    url: 'https://images.pexels.com/photos/374631/pexels-photo-374631.jpeg',
    alt: 'Sample image 2',
    description: 'Another sample image for testing',
    date: format(new Date(2023, 10, 11), 'yyyy-MM-dd HH:mm:ss'),
    type: 'image',
    size: 1024 * 200, // 200KB
    dimensions: {
      width: 1600,
      height: 900,
    },
  },
  {
    id: '3',
    title: 'Sample Image 3',
    url: 'https://images.pexels.com/photos/693859/pexels-photo-693859.jpeg',
    alt: 'Sample image 3',
    description: 'Yet another sample image for testing',
    date: format(new Date(2023, 10, 12), 'yyyy-MM-dd HH:mm:ss'),
    type: 'image',
    size: 1024 * 300, // 300KB
    dimensions: {
      width: 1600,
      height: 900,
    },
  },
];

export const themes: Theme[] = [
  {
    id: '1',
    name: 'Twenty Twenty-Three',
    screenshot: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg',
    description: 'A beautiful, simple, and modern theme.',
    active: true,
  },
  {
    id: '2',
    name: 'Twenty Twenty-Two',
    screenshot: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
    description: 'A clean and minimal theme.',
    active: false,
  },
  {
    id: '3',
    name: 'Twenty Twenty-One',
    screenshot: 'https://images.pexels.com/photos/861125/pexels-photo-861125.jpeg',
    description: 'A versatile theme with a clean design.',
    active: false,
  },
];

export const posts: Post[] = [
  {
    id: '1',
    title: 'Welcome to WordPress Clone',
    content: `<p>Welcome to WordPress Clone! This is your first post. Edit or delete it, then start writing!</p>
    <p>This is a paragraph with some <strong>bold text</strong> and some <em>italic text</em>.</p>
    <h2>This is a heading</h2>
    <p>Here's a list of things:</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <p>And here's a numbered list:</p>
    <ol>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ol>
    <blockquote>
      <p>This is a blockquote. It's used to quote text from other sources.</p>
    </blockquote>`,
    excerpt: 'Welcome to WordPress Clone! This is your first post. Edit or delete it, then start writing!',
    slug: 'welcome-to-wordpress-clone',
    featuredImage: 'https://images.pexels.com/photos/6827515/pexels-photo-6827515.jpeg',
    author: currentUser,
    date: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    modified: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    status: 'publish',
    categories: [categories[0]],
    tags: [tags[0]],
    comments: [comments[0], comments[1]],
  },
  {
    id: '2',
    title: 'Getting Started with WordPress Clone',
    content: `<p>This is a guide to help you get started with WordPress Clone.</p>
    <p>WordPress Clone is a modern CMS built with React.</p>
    <h2>Features</h2>
    <ul>
      <li>Post Management</li>
      <li>Page Management</li>
      <li>Media Library</li>
      <li>Comments</li>
      <li>Categories and Tags</li>
    </ul>
    <h2>Conclusion</h2>
    <p>We hope you enjoy using WordPress Clone!</p>`,
    excerpt: 'This is a guide to help you get started with WordPress Clone.',
    slug: 'getting-started-with-wordpress-clone',
    featuredImage: 'https://images.pexels.com/photos/374631/pexels-photo-374631.jpeg',
    author: currentUser,
    date: format(new Date(2023, 10, 16), 'yyyy-MM-dd HH:mm:ss'),
    modified: format(new Date(2023, 10, 16), 'yyyy-MM-dd HH:mm:ss'),
    status: 'publish',
    categories: [categories[1]],
    tags: [tags[1], tags[2]],
    comments: [comments[2]],
  },
  {
    id: '3',
    title: 'Customizing Your Theme',
    content: `<p>Learn how to customize your theme in WordPress Clone.</p>
    <p>Themes control the appearance of your website.</p>
    <h2>Theme Settings</h2>
    <p>You can customize your theme using the theme settings panel.</p>
    <h2>Custom CSS</h2>
    <p>You can add custom CSS to further customize your theme.</p>
    <h2>Conclusion</h2>
    <p>With these tools, you can make your website look exactly how you want it to!</p>`,
    excerpt: 'Learn how to customize your theme in WordPress Clone.',
    slug: 'customizing-your-theme',
    featuredImage: 'https://images.pexels.com/photos/693859/pexels-photo-693859.jpeg',
    author: currentUser,
    date: format(new Date(2023, 10, 17), 'yyyy-MM-dd HH:mm:ss'),
    modified: format(new Date(2023, 10, 17), 'yyyy-MM-dd HH:mm:ss'),
    status: 'publish',
    categories: [categories[2]],
    tags: [tags[3]],
    comments: [],
  },
  {
    id: '4',
    title: 'Draft Post Example',
    content: '<p>This is a draft post. It will not be visible to visitors until it is published.</p>',
    excerpt: 'This is a draft post.',
    slug: 'draft-post-example',
    author: currentUser,
    date: format(new Date(2023, 10, 18), 'yyyy-MM-dd HH:mm:ss'),
    modified: format(new Date(2023, 10, 18), 'yyyy-MM-dd HH:mm:ss'),
    status: 'draft',
    categories: [categories[0]],
    tags: [],
    comments: [],
  },
];

export const pages: Page[] = [
  {
    id: '1',
    title: 'Home',
    content: '<p>Welcome to our home page!</p>',
    slug: 'home',
    author: currentUser,
    date: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    modified: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    status: 'publish',
    order: 1,
  },
  {
    id: '2',
    title: 'About',
    content: '<p>This is the about page.</p>',
    slug: 'about',
    author: currentUser,
    date: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    modified: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    status: 'publish',
    order: 2,
  },
  {
    id: '3',
    title: 'Contact',
    content: '<p>Contact us here.</p>',
    slug: 'contact',
    author: currentUser,
    date: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    modified: format(new Date(2023, 10, 15), 'yyyy-MM-dd HH:mm:ss'),
    status: 'publish',
    order: 3,
  },
];