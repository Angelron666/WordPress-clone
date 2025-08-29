import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  Image, 
  Users, 
  Edit, 
  Plus, 
  ExternalLink, 
  LineChart 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { posts, pages, media, comments } from '../data/mockData';

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  count: number;
  linkTo: string;
  linkText: string;
}> = ({ icon, title, count, linkTo, linkText }) => {
  return (
    <div className="bg-white rounded shadow-wp p-4 flex flex-col h-full">
      <div className="flex items-center mb-3">
        <div className="text-wordpress-blue mr-2">{icon}</div>
        <h3 className="text-wp-medium font-medium text-wordpress-darkgray">{title}</h3>
      </div>
      <div className="text-wp-3xl font-bold text-wordpress-darkgray mb-3">{count}</div>
      <div className="mt-auto">
        <Link to={linkTo} className="text-wordpress-blue hover:underline text-wp-base">
          {linkText}
        </Link>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  date: string;
}> = ({ icon, title, subtitle, date }) => {
  return (
    <div className="flex items-start mb-4 last:mb-0">
      <div className="text-wordpress-blue mr-3 mt-1">{icon}</div>
      <div className="flex-grow">
        <div className="font-medium text-wp-base text-wordpress-darkgray">{title}</div>
        <div className="text-wp-small text-gray-600">{subtitle}</div>
      </div>
      <div className="text-wp-tiny text-gray-500">{date}</div>
    </div>
  );
};

const QuickDraftForm: React.FC = () => {
  return (
    <div className="bg-white rounded shadow-wp p-4">
      <h3 className="text-wp-medium font-medium text-wordpress-darkgray mb-3">Quick Draft</h3>
      <form>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-white border border-wordpress-border rounded px-3 py-2 text-wp-base focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue"
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="What's on your mind?"
            rows={4}
            className="w-full bg-white border border-wordpress-border rounded px-3 py-2 text-wp-base focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue"
          ></textarea>
        </div>
        <Button variant="primary" size="medium">
          Save Draft
        </Button>
      </form>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const publishedPosts = posts.filter(post => post.status === 'publish');
  const draftPosts = posts.filter(post => post.status === 'draft');
  const publishedPages = pages.filter(page => page.status === 'publish');
  const approvedComments = comments.filter(comment => comment.status === 'approved');
  const pendingComments = comments.filter(comment => comment.status === 'pending');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-wp-2xl font-medium text-wordpress-darkgray">Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="small"
            leftIcon={<Edit size={16} />}
          >
            Edit Homepage
          </Button>
          <Button
            variant="primary"
            size="small"
            leftIcon={<ExternalLink size={16} />}
          >
            View Site
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FileText size={18} />}
          title="Posts"
          count={publishedPosts.length}
          linkTo="/posts"
          linkText="View all posts"
        />
        <StatCard
          icon={<FileText size={18} />}
          title="Pages"
          count={publishedPages.length}
          linkTo="/pages"
          linkText="View all pages"
        />
        <StatCard
          icon={<MessageSquare size={18} />}
          title="Comments"
          count={approvedComments.length}
          linkTo="/comments"
          linkText="View all comments"
        />
        <StatCard
          icon={<Image size={18} />}
          title="Media"
          count={media.length}
          linkTo="/media"
          linkText="View media library"
        />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded shadow-wp p-4 mb-6">
        <h3 className="text-wp-medium font-medium text-wordpress-darkgray mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <Link to="/posts/new" className="flex flex-col items-center p-3 hover:bg-wordpress-gray rounded transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-wordpress-blue text-white flex items-center justify-center mb-2">
              <Plus size={18} />
            </div>
            <span className="text-wp-base text-wordpress-darkgray">New Post</span>
          </Link>
          <Link to="/pages/new" className="flex flex-col items-center p-3 hover:bg-wordpress-gray rounded transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-wordpress-blue text-white flex items-center justify-center mb-2">
              <FileText size={18} />
            </div>
            <span className="text-wp-base text-wordpress-darkgray">New Page</span>
          </Link>
          <Link to="/media/new" className="flex flex-col items-center p-3 hover:bg-wordpress-gray rounded transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-wordpress-blue text-white flex items-center justify-center mb-2">
              <Image size={18} />
            </div>
            <span className="text-wp-base text-wordpress-darkgray">Upload Media</span>
          </Link>
          <Link to="/users/new" className="flex flex-col items-center p-3 hover:bg-wordpress-gray rounded transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-wordpress-blue text-white flex items-center justify-center mb-2">
              <Users size={18} />
            </div>
            <span className="text-wp-base text-wordpress-darkgray">Add User</span>
          </Link>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2">
          {/* Site activity */}
          <div className="bg-white rounded shadow-wp p-4 mb-6">
            <h3 className="text-wp-medium font-medium text-wordpress-darkgray mb-3">Site Activity</h3>
            <div className="divide-y divide-wordpress-border">
              <ActivityItem
                icon={<FileText size={18} />}
                title="Post published: Getting Started with WordPress Clone"
                subtitle="Published by Administrator"
                date="Today, 10:30 AM"
              />
              <ActivityItem
                icon={<MessageSquare size={18} />}
                title="New comment on: Welcome to WordPress Clone"
                subtitle="Comment by John Doe"
                date="Yesterday, 3:45 PM"
              />
              <ActivityItem
                icon={<Image size={18} />}
                title="New media uploaded"
                subtitle="3 items added to Media Library"
                date="2 days ago"
              />
              <ActivityItem
                icon={<Users size={18} />}
                title="User 'editor' last logged in"
                subtitle="Session from 192.168.1.1"
                date="3 days ago"
              />
            </div>
          </div>

          {/* Site stats */}
          <div className="bg-white rounded shadow-wp p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-wp-medium font-medium text-wordpress-darkgray">Traffic Overview</h3>
              <select className="bg-white border border-wordpress-border rounded text-wp-small px-2 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded p-4">
              <div className="text-center">
                <LineChart size={48} className="mx-auto mb-2" />
                <p className="text-wp-base">Traffic statistics will appear here</p>
                <p className="text-wp-small text-gray-500">Connect to an analytics service to see real data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Quick draft */}
          <QuickDraftForm />

          {/* At a glance */}
          <div className="bg-white rounded shadow-wp p-4 mt-6">
            <h3 className="text-wp-medium font-medium text-wordpress-darkgray mb-3">At a Glance</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-wp-base">
                <FileText size={16} className="mr-2 text-wordpress-blue" />
                <span>{publishedPosts.length} Posts</span>
              </li>
              <li className="flex items-center text-wp-base">
                <FileText size={16} className="mr-2 text-wordpress-blue" />
                <span>{publishedPages.length} Pages</span>
              </li>
              <li className="flex items-center text-wp-base">
                <MessageSquare size={16} className="mr-2 text-wordpress-blue" />
                <span>{approvedComments.length} Comments</span>
                {pendingComments.length > 0 && (
                  <span className="ml-2 bg-wordpress-warning text-white text-wp-tiny px-1.5 rounded-full">
                    {pendingComments.length} Pending
                  </span>
                )}
              </li>
              <li className="flex items-center text-wp-base">
                <FileText size={16} className="mr-2 text-wordpress-blue" />
                <span>{draftPosts.length} Drafts</span>
              </li>
            </ul>
          </div>

          {/* WordPress news */}
          <div className="bg-white rounded shadow-wp p-4 mt-6">
            <h3 className="text-wp-medium font-medium text-wordpress-darkgray mb-3">WordPress News</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-wordpress-blue hover:underline text-wp-base">WordPress 6.2 Released: "Dolphy"</a>
                <p className="text-wp-small text-gray-600">March 28, 2023</p>
              </li>
              <li>
                <a href="#" className="text-wordpress-blue hover:underline text-wp-base">What's New in Gutenberg 15.5</a>
                <p className="text-wp-small text-gray-600">April 12, 2023</p>
              </li>
              <li>
                <a href="#" className="text-wordpress-blue hover:underline text-wp-base">The Month in WordPress: April 2023</a>
                <p className="text-wp-small text-gray-600">May 2, 2023</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;