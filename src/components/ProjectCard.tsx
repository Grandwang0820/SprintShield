import React from 'react';
import Avatar from './Avatar'; // Assuming Avatar is in the same directory

interface ProjectCardProps {
  projectId: string;
  projectName: string;
  participants?: Array<{ id: string; name?: string; avatarUrl?: string | null }>;
  progress?: number; // 0 to 100
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  // projectId is passed as a prop but not used directly in this component's rendering logic,
  // so it's removed from destructuring to avoid unused variable lint error.
  // It's still part of ProjectCardProps for type safety when using the component.
  projectName,
  participants = [],
  progress = 0,
  onClick,
}) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{projectName}</h3>

      {/* Participants */}
      {participants.length > 0 && (
        <div className="flex items-center space-x-2 my-3">
          <span className="text-sm text-gray-500">Participants:</span>
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map(p => (
              <Avatar key={p.id} src={p.avatarUrl} name={p.name} size="sm" />
            ))}
            {participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                +{participants.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
