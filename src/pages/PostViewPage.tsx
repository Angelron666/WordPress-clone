import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit, Calendar, User, Tag, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import { posts } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const PostViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-wp text-center">
          <h1 className="text-wp-2xl font-medium text-wordpress-darkgray mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate(-1)}
            className="text-wordpress-blue hover:underline"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header for public view */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="text-wordpress-blue hover:underline text-wp-base"
          >
            ← Back
          </button>
          {user && (
            <Link to={`/posts/edit/${post.id}`}>
              <Button variant="secondary" size="small" leftIcon={<Edit size={16} />}>
                Edit Post
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Post Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-wordpress-darkgray mb-4">{post.title}</h1>

          <div className="flex items-center text-wp-base text-gray-600 space-x-4 mb-6">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            {new Date(post.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <User size={16} className="mr-1" />
            By {post.author.name}
          </div>
          {post.categories.length > 0 && (
            <div className="flex items-center">
              <Tag size={16} className="mr-1" />
              {post.categories.map((category, index) => (
                <span key={category.id}>
                  <Link 
                    to={`/categories/${category.slug}`}
                    className="text-wordpress-blue hover:underline"
                  >
                    {category.name}
                  </Link>
                  {index < post.categories.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
          {post.comments.length > 0 && (
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              {post.comments.length} Comments
            </div>
          )}
        </div>

          {post.featuredImage && (
          <div className="mb-6">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto rounded"
            />
          </div>
          )}
        </div>

      {/* Post Content */}
        <div className="mb-8">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-wordpress-border">
              <div className="flex items-center flex-wrap gap-2">
              <span className="text-wp-base text-gray-600">Tags:</span>
              {post.tags.map(tag => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.slug}`}
                  className="bg-wordpress-gray text-wordpress-blue rounded-full px-3 py-1 text-wp-small hover:bg-gray-200"
                >
                  {tag.name}
                </Link>
              ))}
              </div>
          </div>
        )}
        </div>

      {/* Comments Section */}
      {post.comments.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-wp-xl font-medium text-wordpress-darkgray mb-6">
            Comments ({post.comments.length})
          </h2>
          <div className="space-y-6">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-grow">
                  <div className="bg-wordpress-lightgray rounded p-4">
                      <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-wordpress-darkgray">
                        {comment.author.name}
                      </span>
                      <span className="text-wp-small text-gray-500">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                      <p className="text-wp-base text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
      )}
      </div>
    </div>
  );
};

export default PostViewPage;