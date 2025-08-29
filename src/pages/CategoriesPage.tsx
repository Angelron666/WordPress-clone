import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { categories as initialCategories } from '../data/mockData';
import { Category } from '../types';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(category => category.id !== id));
      setShowActionMenu(null);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    setCategories([
      ...categories,
      {
        id,
        name: newCategory.name,
        slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        description: newCategory.description,
        count: 0,
        parent: newCategory.parent || undefined,
      },
    ]);
    setNewCategory({ name: '', slug: '', description: '', parent: '' });
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setCategories(categories.map(category =>
      category.id === editingCategory.id ? editingCategory : category
    ));
    setEditingCategory(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-wp-2xl font-medium text-wordpress-darkgray">Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add/Edit Category Form */}
        <div>
          <div className="bg-white rounded shadow-wp p-4">
            <h2 className="text-wp-medium font-medium text-wordpress-darkgray mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
              <Input
                label="Name"
                value={editingCategory ? editingCategory.name : newCategory.name}
                onChange={(e) => editingCategory
                  ? setEditingCategory({ ...editingCategory, name: e.target.value })
                  : setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Category name"
                required
                className="mb-4"
              />

              <Input
                label="Slug"
                value={editingCategory ? editingCategory.slug : newCategory.slug}
                onChange={(e) => editingCategory
                  ? setEditingCategory({ ...editingCategory, slug: e.target.value })
                  : setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder="category-slug"
                helperText='The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.'
                className="mb-4"
              />

              <div className="mb-4">
                <label className="block text-wp-base font-medium mb-1 text-wordpress-darkgray">
                  Parent Category
                </label>
                <select
                  value={editingCategory ? editingCategory.parent : newCategory.parent}
                  onChange={(e) => editingCategory
                    ? setEditingCategory({ ...editingCategory, parent: e.target.value })
                    : setNewCategory({ ...newCategory, parent: e.target.value })
                  }
                  className="bg-white border border-wordpress-border rounded px-3 py-2 w-full text-wp-base focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue"
                >
                  <option value="">None</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-wp-base font-medium mb-1 text-wordpress-darkgray">
                  Description
                </label>
                <textarea
                  value={editingCategory ? editingCategory.description : newCategory.description}
                  onChange={(e) => editingCategory
                    ? setEditingCategory({ ...editingCategory, description: e.target.value })
                    : setNewCategory({ ...newCategory, description: e.target.value })
                  }
                  placeholder="Category description"
                  rows={4}
                  className="bg-white border border-wordpress-border rounded px-3 py-2 w-full text-wp-base focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="medium"
                leftIcon={editingCategory ? <Edit size={16} /> : <Plus size={16} />}
              >
                {editingCategory ? 'Update Category' : 'Add New Category'}
              </Button>

              {editingCategory && (
                <Button
                  type="button"
                  variant="secondary"
                  size="medium"
                  className="ml-2"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </Button>
              )}
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded shadow-wp overflow-hidden">
            <div className="p-4 border-b border-wordpress-border">
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search categories"
                    className="bg-white border border-wordpress-border rounded pl-10 px-3 py-2 text-wp-base w-full focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <table className="w-full text-left text-wp-base">
              <thead className="bg-wordpress-lightgray border-b border-wordpress-border">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium">Slug</th>
                  <th className="p-3 font-medium">Count</th>
                  <th className="p-3 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wordpress-border">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No categories found. {searchTerm && <span>Try different search terms.</span>}
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-wordpress-lightgray">
                      <td className="p-3">
                        <div className="font-medium text-wordpress-blue">
                          {category.name}
                        </div>
                      </td>
                      <td className="p-3">
                        {category.description || <span className="text-gray-500">—</span>}
                      </td>
                      <td className="p-3 text-gray-600">
                        {category.slug}
                      </td>
                      <td className="p-3">
                        {category.count}
                      </td>
                      <td className="p-3">
                        <div className="relative">
                          <button 
                            className="text-gray-600 hover:text-wordpress-blue p-1"
                            onClick={() => setShowActionMenu(showActionMenu === category.id ? null : category.id)}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {showActionMenu === category.id && (
                            <div className="absolute z-10 right-0 mt-1 bg-white shadow-lg rounded w-40 py-1 text-wp-base animate-fade-in">
                              <button 
                                className="flex items-center px-3 py-1.5 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setShowActionMenu(null);
                                }}
                              >
                                <Edit size={16} className="mr-2" />
                                Edit
                              </button>
                              <button 
                                className="flex items-center px-3 py-1.5 hover:bg-gray-100 w-full text-left text-wordpress-error"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;