import React from 'react';
import Avatar from './Avatar'; // Assuming Avatar is in the same directory

interface TaskCardProps {
  taskId: string;
  title: string;
  figmaPreviewUrl?: string | null;
  latestActivity?: string;
  assignee?: { id: string; name?: string; avatarUrl?: string | null };
  dueDate?: string; // Format as string for display
  tags?: string[];
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  taskId,
  title,
  figmaPreviewUrl,
  latestActivity,
  assignee,
  dueDate,
  tags = [],
  onClick,
}) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <h4 className="text-md font-semibold text-gray-800 mb-2 truncate" title={title}>
        {taskId}: {title}
      </h4>

      {/* Design Preview Area */}
      {figmaPreviewUrl ? (
        <div className="my-2 h-32 bg-gray-100 rounded flex items-center justify-center">
          <img src={figmaPreviewUrl} alt={`Design preview for ${title}`} className="max-h-full max-w-full object-contain rounded" />
        </div>
      ) : (
        <div className="my-2 h-32 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
          [🔗 Bind Design]
        </div>
      )}

      {/* Latest Activity */}
      {latestActivity && (
        <p className="text-xs text-gray-500 my-2 truncate" title={latestActivity}>
          {latestActivity}
        </p>
      )}

      {/* Bottom Info: Assignee, Due Date */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
        <div className="flex items-center">
          {assignee ? (
            <Avatar src={assignee.avatarUrl} name={assignee.name} size="sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">?</div>
          )}
          {dueDate && <span className="ml-2">Due: {dueDate}</span>}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-2">
          {tags.map(tag => (
            <span key={tag} className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
