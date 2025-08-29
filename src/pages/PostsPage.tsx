import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MoreHorizontal, Trash2, Edit, Eye, Copy } from 'lucide-react';
import Button from '../components/ui/Button';
import { useApi } from '../context/ApiContext';

const PostsPage: React.FC = () => {
  const { posts, loading, refreshPosts, updatePost } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  // Load posts when component mounts
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const filteredPosts = posts.filter(post => {
    // Filter by search term
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to move this post to trash?')) {
      // Instead of deleting, update the post status to trash
      await updatePost(id, { status: 'trash' });
      await refreshPosts();
      setShowActionMenu(null);
    }
  };

  const handleBulkAction = async (action: string) => {
    // Implementation for bulk actions would go here
    if (action === 'trash') {
      if (window.confirm('Are you sure you want to move selected posts to trash?')) {
        // In a real implementation, we would track selected posts and update each one
        console.log('Moving selected posts to trash');
      }
    } else {
      console.log(`Bulk action: ${action}`);
    }
  };

  const statusCounts = {
    all: posts.length,
    publish: posts.filter(post => post.status === 'publish').length,
    draft: posts.filter(post => post.status === 'draft').length,
    trash: posts.filter(post => post.status === 'trash').length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-wp-2xl font-medium text-wordpress-darkgray">Posts</h1>
        <Link to="/posts/new">
          <Button
            variant="primary"
            size="medium"
            leftIcon={<Plus size={16} />}
          >
            Add New
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="bg-white p-8 rounded shadow-wp mb-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wordpress-blue"></div>
          <span className="ml-3 text-gray-600">Loading posts...</span>
        </div>
      )}

      {!loading && (
      <>
      {/* Filter tabs */}
      <div className="border-b border-wordpress-border mb-4">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`mr-4 py-2 px-1 text-wp-base font-medium border-b-2 ${
              statusFilter === 'all'
                ? 'border-wordpress-blue text-wordpress-blue'
                : 'border-transparent text-gray-500 hover:text-wordpress-darkgray'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            All <span className="text-gray-500">({statusCounts.all})</span>
          </button>
          <button
            className={`mr-4 py-2 px-1 text-wp-base font-medium border-b-2 ${
              statusFilter === 'publish'
                ? 'border-wordpress-blue text-wordpress-blue'
                : 'border-transparent text-gray-500 hover:text-wordpress-darkgray'
            }`}
            onClick={() => setStatusFilter('publish')}
          >
            Published <span className="text-gray-500">({statusCounts.publish})</span>
          </button>
          <button
            className={`mr-4 py-2 px-1 text-wp-base font-medium border-b-2 ${
              statusFilter === 'draft'
                ? 'border-wordpress-blue text-wordpress-blue'
                : 'border-transparent text-gray-500 hover:text-wordpress-darkgray'
            }`}
            onClick={() => setStatusFilter('draft')}
          >
            Drafts <span className="text-gray-500">({statusCounts.draft})</span>
          </button>
          <button
            className={`mr-4 py-2 px-1 text-wp-base font-medium border-b-2 ${
              statusFilter === 'trash'
                ? 'border-wordpress-blue text-wordpress-blue'
                : 'border-transparent text-gray-500 hover:text-wordpress-darkgray'
            }`}
            onClick={() => setStatusFilter('trash')}
          >
            Trash <span className="text-gray-500">({statusCounts.trash})</span>
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded shadow-wp mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <select
              className="bg-white border border-wordpress-border rounded text-wp-base px-3 py-2 mr-2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Bulk Actions</option>
              <option value="edit">Edit</option>
              <option value="trash">Move to Trash</option>
            </select>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => handleBulkAction(selectedStatus)}
            >
              Apply
            </Button>
          </div>

          <div className="flex items-center ml-auto">
            <select className="bg-white border border-wordpress-border rounded text-wp-base px-3 py-2 mr-2">
              <option value="date">Sort by date</option>
              <option value="title">Sort by title</option>
              <option value="author">Sort by author</option>
            </select>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search posts"
                className="bg-white border border-wordpress-border rounded pl-10 px-3 py-2 text-wp-base focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-white rounded shadow-wp overflow-hidden">
        <table className="w-full text-left text-wp-base">
          <thead className="bg-wordpress-lightgray border-b border-wordpress-border">
            <tr>
              <th className="p-3 pl-4 w-10">
                <input
                  type="checkbox"
                  className="rounded text-wordpress-blue focus:ring-wordpress-blue"
                />
              </th>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Author</th>
              <th className="p-3 font-medium">Categories</th>
              <th className="p-3 font-medium">Tags</th>
              <th className="p-3 font-medium">Comments</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wordpress-border">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No posts found. {searchTerm && <span>Try different search terms.</span>}
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-wordpress-lightgray">
                  <td className="p-3 pl-4">
                    <input
                      type="checkbox"
                      className="rounded text-wordpress-blue focus:ring-wordpress-blue"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      {post.featuredImage && (
                        <div className="w-10 h-10 mr-3 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={post.featuredImage} 
                            alt={post.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div>
                        <Link 
                          to={`/posts/${post.id}`} 
                          className="font-medium text-wordpress-blue hover:underline"
                        >
                          {post.title}
                        </Link>
                        {post.status !== 'publish' && (
                          <span className="ml-2 text-wp-small text-gray-500">
                            ({post.status})
                          </span>
                        )}
                        <div className="flex text-wp-small mt-1">
                          <button 
                            className="text-gray-600 hover:text-wordpress-blue mr-2"
                            onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                          >
                            View
                          </button>
                          <Link 
                            to={`/posts/edit/${post.id}`} 
                            className="text-gray-600 hover:text-wordpress-blue mr-2"
                          >
                            Edit
                          </Link>
                          <div className="relative">
                            <button 
                              className="text-gray-600 hover:text-wordpress-blue"
                              onClick={() => setShowActionMenu(showActionMenu === post.id ? null : post.id)}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {showActionMenu === post.id && (
                              <div className="absolute z-10 left-0 mt-1 bg-white shadow-lg rounded w-40 py-1 text-wp-base animate-fade-in">
                                <Link 
                                  to={`/posts/edit/${post.id}`}
                                  className="flex items-center px-3 py-1.5 hover:bg-gray-100 w-full text-left"
                                  onClick={() => setShowActionMenu(null)}
                                >
                                  <Edit size={16} className="mr-2" />
                                  Edit
                                </Link>
                                <Link 
                                  to={`/posts/${post.id}`}
                                  className="flex items-center px-3 py-1.5 hover:bg-gray-100 w-full text-left"
                                  onClick={() => setShowActionMenu(null)}
                                >
                                  <Eye size={16} className="mr-2" />
                                  View
                                </Link>
                                <button 
                                  className="flex items-center px-3 py-1.5 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    // Implementation for "Quick Edit" would go here
                                    setShowActionMenu(null);
                                  }}
                                >
                                  <Edit size={16} className="mr-2" />
                                  Quick Edit
                                </button>
                                <button 
                                  className="flex items-center px-3 py-1.5 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    // Implementation for "Duplicate" would go here
                                    setShowActionMenu(null);
                                  }}
                                >
                                  <Copy size={16} className="mr-2" />
                                  Duplicate
                                </button>
                                <button 
                                  className="flex items-center px-3 py-1.5 hover:bg-gray-100 w-full text-left text-wordpress-error"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Trash
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-gray-700">{post.author.name}</span>
                  </td>
                  <td className="p-3">
                    {post.categories && post.categories.length > 0 ? (
                      <div className="space-x-1">
                        {post.categories.map((category, index) => (
                          <Link
                            key={category.id}
                            to={`/categories/${category.id}`}
                            className="text-wordpress-blue hover:underline"
                          >
                            {category.name}
                            {index < post.categories.length - 1 ? ',' : ''}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {post.tags && post.tags.length > 0 ? (
                      <div className="space-x-1">
                        {post.tags.map((tag, index) => (
                          <Link
                            key={tag.id}
                            to={`/tags/${tag.id}`}
                            className="text-wordpress-blue hover:underline"
                          >
                            {tag.name}
                            {index < post.tags.length - 1 ? ',' : ''}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {post.comments && post.comments.length > 0 ? (
                      <div className="text-wordpress-blue hover:underline cursor-pointer">
                        {post.comments.length}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="text-gray-700">
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="text-wp-tiny text-gray-500">
                      {post.status === 'publish' ? 'Published' : 'Last Modified'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="border-t border-wordpress-border p-4 flex items-center justify-between">
          <div className="text-wp-small text-gray-500">
            Showing 1-{filteredPosts.length} of {filteredPosts.length} items
          </div>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 bg-wordpress-gray border border-wordpress-border rounded text-wp-small text-gray-700 hover:bg-gray-200">
              &laquo; Previous
            </button>
            <button className="px-3 py-1 bg-wordpress-blue border border-wordpress-darkblue rounded text-wp-small text-white">
              1
            </button>
            <button className="px-3 py-1 bg-wordpress-gray border border-wordpress-border rounded text-wp-small text-gray-700 hover:bg-gray-200">
              2
            </button>
            <button className="px-3 py-1 bg-wordpress-gray border border-wordpress-border rounded text-wp-small text-gray-700 hover:bg-gray-200">
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default PostsPage;