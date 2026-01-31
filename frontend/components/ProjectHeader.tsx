import React from 'react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

export const ProjectHeader: React.FC = () => {
  const tabs = ['Overview', 'List', 'Board', 'Calendar', 'Files'];
  const activeTab = 'Board';

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Title Section */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          {/* Left: Title and Team Members */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">Design Project</h1>
              <button
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Edit project name"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            {/* Team Member Avatars */}
            <div className="flex items-center -space-x-2">
              <Avatar name="Alice Johnson" size="sm" />
              <Avatar name="Bob Smith" size="sm" />
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </Button>
            <Button variant="secondary" size="sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Automation
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`relative py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[#8B5CF6]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Filter Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Due Date Filter */}
            <select className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <option>Due Date</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Overdue</option>
            </select>

            {/* Assignee Filter */}
            <select className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <option>Assignee</option>
              <option>Alice Johnson</option>
              <option>Bob Smith</option>
              <option>Unassigned</option>
            </select>

            {/* Priority Filter */}
            <select className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <option>Priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            {/* Advanced Filters Button */}
            <Button variant="ghost" size="sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Advanced Filters
            </Button>
          </div>

          {/* Right: Add New Button */}
          <Button variant="primary" size="sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New
          </Button>
        </div>
      </div>
    </div>
  );
};
