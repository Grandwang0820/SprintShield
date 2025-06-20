import React from 'react';
import Button from '@/components/Button'; // Using alias @/
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';

// Mock data for projects
const mockProjects = [
  {
    projectId: 'proj-001',
    projectName: 'Q3 手機App改版',
    participants: [
      { id: 'user-1', name: '小張 (PM)', avatarUrl: null },
      { id: 'user-2', name: '小希 (Designer)', avatarUrl: 'https://i.pravatar.cc/150?u=xiaoxi' },
      { id: 'user-3', name: '小李 (Engineer)', avatarUrl: 'https://i.pravatar.cc/150?u=xiaoli' },
      { id: 'user-4', name: '路人甲', avatarUrl: null },
    ],
    progress: 65,
  },
  {
    projectId: 'proj-002',
    projectName: 'SprintShield v3.0 開發',
    participants: [
      { id: 'user-1', name: '小張 (PM)' },
      { id: 'user-5', name: '開發者A', avatarUrl: 'https://i.pravatar.cc/150?u=devA' },
      { id: 'user-6', name: '開發者B', avatarUrl: 'https://i.pravatar.cc/150?u=devB' },
    ],
    progress: 30,
  },
  {
    projectId: 'proj-003',
    projectName: '新年行銷活動網站',
    participants: [
      { id: 'user-2', name: '小希 (Designer)', avatarUrl: 'https://i.pravatar.cc/150?u=xiaoxi' },
      { id: 'user-7', name: '行銷小王', avatarUrl: 'https://i.pravatar.cc/150?u=xiaowang' },
    ],
    progress: 90,
  },
];

const DashboardPage: React.FC = () => {
  const handleNewProjectClick = () => {
    // For MVP, this will be a placeholder.
    // In a full app, this would open a modal or navigate to a new project page.
    alert('「新增專案」功能將在未來版本實現！');
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          專案儀表板 (Project Dashboard)
        </h1>
        <Button
          variant="primary"
          size="lg"
          onClick={handleNewProjectClick}
        >
          + 新增專案
        </Button>
      </header>

      {mockProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Link key={project.projectId} href={`/project/${project.projectId}`} passHref>
              <ProjectCard
                projectId={project.projectId}
                projectName={project.projectName}
                participants={project.participants}
                progress={project.progress}
                // The Link component handles navigation, so onClick here can be omitted
                // or used for other purposes if needed.
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600">尚無專案</h2>
          <p className="text-gray-500 mt-2">開始建立你的第一個專案吧！</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
