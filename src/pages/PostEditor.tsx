import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Image, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  MoreHorizontal,
  Calendar,
  Tag,
  FileText,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useApi } from '../context/ApiContext';
import { Post } from '../types';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const StyleButton = ({ active, style, icon, label, onToggle }: { 
  active: boolean; 
  style: string; 
  icon?: React.ReactNode; 
  label?: string; 
  onToggle: (style: string) => void; 
}) => {
  return (
    <button
      className={`p-2 rounded hover:bg-wordpress-gray transition-colors ${
        active ? 'text-wordpress-blue' : 'text-gray-600'
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle(style);
      }}
    >
      {icon || label}
    </button>
  );
};

const SidebarPanel = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white rounded shadow-wp mb-4">
      <div 
        className="p-3 border-b border-wordpress-border flex items-center justify-between cursor-pointer hover:bg-wordpress-lightgray"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <span className="mr-2 text-wordpress-blue">{icon}</span>
          <h3 className="text-wp-medium font-medium text-wordpress-darkgray">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
};

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewPost = !id || id === 'new';
  
  const { 
    posts, 
    categories, 
    tags, 
    loading, 
    createPost, 
    updatePost, 
    refreshCategories, 
    refreshTags 
  } = useApi();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | undefined>();
  const [status, setStatus] = useState<Post['status']>('draft');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Sidebar panels visibility
  const [statusPanelOpen, setStatusPanelOpen] = useState(true);
  const [categoriesPanelOpen, setCategoriesPanelOpen] = useState(true);
  const [tagsPanelOpen, setTagsPanelOpen] = useState(true);
  const [featuredImagePanelOpen, setFeaturedImagePanelOpen] = useState(true);
  const [excerptPanelOpen, setExcerptPanelOpen] = useState(false);
  
  // Editor state
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  
  // Load categories and tags
  useEffect(() => {
    refreshCategories();
    refreshTags();
  }, [refreshCategories, refreshTags]);
  
  // Load existing post data
  useEffect(() => {
    if (!isNewPost && id) {
      const post = posts.find(p => p.id === id);
      if (post) {
        setTitle(post.title);
        setSlug(post.slug || '');
        setExcerpt(post.excerpt || '');
        setSelectedCategories(post.categories?.map(c => c.id) || []);
        setSelectedTags(post.tags?.map(t => t.id) || []);
        setFeaturedImage(post.featuredImage);
        setStatus(post.status);
        setPublishDate(new Date(post.date).toISOString().split('T')[0]);
        
        // Only convert content from HTML if it exists
        if (post.content) {
          const blocksFromHTML = convertFromHTML(post.content);
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      }
    }
  }, [id, isNewPost, posts]);
  
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const content = editorState.getCurrentContent();
      const contentString = JSON.stringify(convertToRaw(content));
      
      // Create new post or update existing
      if (isNewPost) {
        const newPost: Partial<Post> = {
          title,
          content: contentString,
          excerpt,
          status: 'draft',
          date: new Date().toISOString(),
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          categories: selectedCategories.map(id => categories.find(c => c.id === id)!),
          tags: selectedTags.map(id => tags.find(t => t.id === id)!),
          featuredImage,
        };
        
        await createPost(newPost);
        alert('Draft saved!');
        navigate('/posts');
      } else if (id) {
        const updatedPost: Partial<Post> = {
          title,
          content: contentString,
          excerpt,
          status: 'draft',
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          categories: selectedCategories.map(id => categories.find(c => c.id === id)!),
          tags: selectedTags.map(id => tags.find(t => t.id === id)!),
          featuredImage,
        };
        
        await updatePost(id, updatedPost);
        alert('Draft updated!');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const content = editorState.getCurrentContent();
      const contentString = JSON.stringify(convertToRaw(content));
      
      if (isNewPost) {
        const newPost: Partial<Post> = {
          title,
          content: contentString,
          excerpt,
          status: 'publish',
          date: publishDate ? new Date(publishDate).toISOString() : new Date().toISOString(),
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          categories: selectedCategories.map(id => categories.find(c => c.id === id)!),
          tags: selectedTags.map(id => tags.find(t => t.id === id)!),
          featuredImage,
        };
        
        await createPost(newPost);
        alert('Published successfully!');
        navigate('/posts');
      } else if (id) {
        const updatedPost: Partial<Post> = {
          title,
          content: contentString,
          excerpt,
          status: 'publish',
          date: publishDate ? new Date(publishDate).toISOString() : new Date().toISOString(),
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          categories: selectedCategories.map(id => categories.find(c => c.id === id)!),
          tags: selectedTags.map(id => tags.find(t => t.id === id)!),
          featuredImage,
        };
        
        await updatePost(id, updatedPost);
        setStatus('publish');
        alert('Published successfully!');
      }
    } catch (error) {
      console.error('Error publishing:', error);
      alert('Failed to publish');
    } finally {
      setIsSaving(false);
      setIsPublishPanelOpen(false);
    }
  };
  
  const handleToggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };
  
  const handleToggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };
  
  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top toolbar */}
      <div className="bg-white border-b border-wordpress-border p-2 flex items-center justify-between sticky top-12 z-20">
        <div className="flex items-center flex-grow">
          <Input
            type="text"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 text-wp-2xl font-medium p-0 focus:ring-0 w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="small"
            leftIcon={isSaving ? null : <Save size={16} />}
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-wordpress-blue mr-2"></div>
                Saving...
              </div>
            ) : 'Save Draft'}
          </Button>
          
          <Button
            variant="secondary"
            size="small"
            leftIcon={<Eye size={16} />}
            disabled={isSaving}
          >
            Preview
          </Button>
          
          <Button
            variant="primary"
            size="small"
            onClick={handlePublish}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {status === 'publish' ? 'Updating...' : 'Publishing...'}
              </div>
            ) : (
              status === 'publish' ? 'Update' : 'Publish'
            )}
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-grow">
        {/* Editor column */}
        <div className="flex-grow max-w-4xl">
          {/* Format toolbar */}
          <div className="border-b border-wordpress-border p-2 bg-white sticky top-24 z-10 flex items-center flex-wrap gap-1">
            <StyleButton
              active={currentInlineStyle.has('BOLD')}
              style="BOLD"
              icon={<Bold size={18} />}
              onToggle={handleToggleInlineStyle}
            />
            <StyleButton
              active={currentInlineStyle.has('ITALIC')}
              style="ITALIC"
              icon={<Italic size={18} />}
              onToggle={handleToggleInlineStyle}
            />
            <StyleButton
              active={currentInlineStyle.has('UNDERLINE')}
              style="UNDERLINE"
              icon={<Underline size={18} />}
              onToggle={handleToggleInlineStyle}
            />
            <StyleButton
              active={currentInlineStyle.has('CODE')}
              style="CODE"
              icon={<Code size={18} />}
              onToggle={handleToggleInlineStyle}
            />
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <StyleButton
              active={blockType === 'header-one'}
              style="header-one"
              label="H1"
              onToggle={handleToggleBlockType}
            />
            <StyleButton
              active={blockType === 'header-two'}
              style="header-two"
              label="H2"
              onToggle={handleToggleBlockType}
            />
            <StyleButton
              active={blockType === 'header-three'}
              style="header-three"
              label="H3"
              onToggle={handleToggleBlockType}
            />
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <StyleButton
              active={blockType === 'unordered-list-item'}
              style="unordered-list-item"
              icon={<List size={18} />}
              onToggle={handleToggleBlockType}
            />
            <StyleButton
              active={blockType === 'ordered-list-item'}
              style="ordered-list-item"
              icon={<ListOrdered size={18} />}
              onToggle={handleToggleBlockType}
            />
            <StyleButton
              active={blockType === 'blockquote'}
              style="blockquote"
              icon={<Quote size={18} />}
              onToggle={handleToggleBlockType}
            />
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <button className="p-2 rounded hover:bg-wordpress-gray transition-colors text-gray-600">
              <LinkIcon size={18} />
            </button>
            <button className="p-2 rounded hover:bg-wordpress-gray transition-colors text-gray-600">
              <Image size={18} />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <button className="p-2 rounded hover:bg-wordpress-gray transition-colors text-gray-600">
              <AlignLeft size={18} />
            </button>
            <button className="p-2 rounded hover:bg-wordpress-gray transition-colors text-gray-600">
              <AlignCenter size={18} />
            </button>
            <button className="p-2 rounded hover:bg-wordpress-gray transition-colors text-gray-600">
              <AlignRight size={18} />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <button className="p-2 rounded hover:bg-wordpress-gray transition-colors text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          
          {/* Content editor */}
          <div className="p-6">
            <div className="prose max-w-none min-h-[500px]">
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Start writing or type / to choose a block..."
              />
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 bg-wordpress-lightgray p-4 border-l border-wordpress-border overflow-y-auto">
          <SidebarPanel
            title="Status & Visibility"
            icon={<FileText size={18} />}
            isOpen={statusPanelOpen}
            onToggle={() => setStatusPanelOpen(!statusPanelOpen)}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-wp-base font-medium mb-1 text-wordpress-darkgray">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Post['status'])}
                  className="bg-white border border-wordpress-border rounded px-3 py-2 w-full text-wp-base"
                >
                  <option value="draft">Draft</option>
                  <option value="publish">Published</option>
                  <option value="private">Private</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>
              
              <div>
                <label className="block text-wp-base font-medium mb-1 text-wordpress-darkgray">
                  Publish Date
                </label>
                <div className="flex items-center">
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="bg-white border border-wordpress-border rounded px-3 py-2 w-full text-wp-base"
                  />
                  <button className="ml-2 text-wordpress-blue hover:text-wordpress-darkblue">
                    <Calendar size={18} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-wp-base font-medium mb-1 text-wordpress-darkgray">
                  Visibility
                </label>
                <select
                  className="bg-white border border-wordpress-border rounded px-3 py-2 w-full text-wp-base"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="password">Password Protected</option>
                </select>
              </div>
            </div>
          </SidebarPanel>
          
          <SidebarPanel
            title="Categories"
            icon={<Tag size={18} />}
            isOpen={categoriesPanelOpen}
            onToggle={() => setCategoriesPanelOpen(!categoriesPanelOpen)}
          >
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-wordpress-blue"></div>
                <span className="ml-2 text-gray-600 text-sm">Loading categories...</span>
              </div>
            ) : (
              <>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                        className="mr-2 rounded text-wordpress-blue focus:ring-wordpress-blue"
                      />
                      <label htmlFor={`category-${category.id}`} className="text-wp-base text-wordpress-darkgray">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
                <button 
                  className="mt-3 text-wordpress-blue hover:underline text-wp-base"
                  onClick={() => {
                    const name = prompt('Enter new category name:');
                    if (name) {
                      // In a real app, we would call an API to create a category
                      alert('Creating category is not implemented in this demo');
                    }
                  }}
                >
                  + Add New Category
                </button>
              </>
            )}
          </SidebarPanel>
          
          <SidebarPanel
            title="Tags"
            icon={<Tag size={18} />}
            isOpen={tagsPanelOpen}
            onToggle={() => setTagsPanelOpen(!tagsPanelOpen)}
          >
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-wordpress-blue"></div>
                <span className="ml-2 text-gray-600 text-sm">Loading tags...</span>
              </div>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Add tags separated by commas"
                  className="mb-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const inputValue = e.currentTarget.value.trim();
                      if (inputValue) {
                        // Find or create a tag
                        const existingTag = tags.find(t => t.name.toLowerCase() === inputValue.toLowerCase());
                        if (existingTag && !selectedTags.includes(existingTag.id)) {
                          setSelectedTags([...selectedTags, existingTag.id]);
                        } else if (!existingTag) {
                          // In a real app we would create a new tag
                          alert('Creating tag is not implemented in this demo');
                        }
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {selectedTags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <div key={tag.id} className="bg-wordpress-gray rounded-full px-2 py-0.5 text-wp-small flex items-center">
                          {tag.name}
                          <button 
                            className="ml-1 text-gray-500 hover:text-wordpress-error"
                            onClick={() => setSelectedTags(selectedTags.filter(id => id !== tag.id))}
                          >
                            ×
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                <p className="text-wp-small text-gray-500">
                  Separate tags with commas or press Enter
                </p>
              </>
            )}
          </SidebarPanel>
          
          <SidebarPanel
            title="Featured Image"
            icon={<Image size={18} />}
            isOpen={featuredImagePanelOpen}
            onToggle={() => setFeaturedImagePanelOpen(!featuredImagePanelOpen)}
          >
            {featuredImage ? (
              <div className="relative">
                <img 
                  src={featuredImage} 
                  alt="Featured" 
                  className="w-full h-32 object-cover rounded" 
                />
                <button 
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
                  onClick={() => setFeaturedImage(undefined)}
                >
                  ×
                </button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="small"
                className="w-full"
                leftIcon={<Image size={16} />}
              >
                Set Featured Image
              </Button>
            )}
          </SidebarPanel>
          
          <SidebarPanel
            title="Excerpt"
            icon={<FileText size={18} />}
            isOpen={excerptPanelOpen}
            onToggle={() => setExcerptPanelOpen(!excerptPanelOpen)}
          >
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write an excerpt (optional)"
              rows={4}
              className="bg-white border border-wordpress-border rounded px-3 py-2 text-wp-base w-full focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue"
            ></textarea>
            <p className="text-wp-small text-gray-500 mt-2">
              Excerpts are optional hand-crafted summaries of your content.
            </p>
          </SidebarPanel>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;