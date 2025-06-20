'use client';

import React, { useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import RecordConsensusModal from './RecordConsensusModal';
import ProposeChangeModal from './ProposeChangeModal'; // Import the new ProposeChangeModal

interface User {
  id: string;
  name?: string;
  avatarUrl?: string | null;
}

export interface TaskActivity {
  id: string;
  userName: string;
  userAvatar?: string | null;
  action: string;
  details?: string;
  timestamp: string;
}

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  figmaLink?: string;
  figmaPreviewUrl?: string | null;
  currentFigmaVersion?: string;
  figmaVersionHistory?: Array<{ version: string; link: string; date: string }>;
  assignee?: User;
  status?: string;
  dueDate?: string;
  tags?: string[];
  activities?: TaskActivity[];
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskData | null;
  onSaveConsensusText: (taskId: string, consensusText: string) => void;
  // onProposeChange is now for submitting the proposal details
  onSubmitDesignProposal: (taskId: string, newFigmaLink: string, reason: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onSaveConsensusText,
  onSubmitDesignProposal, // Renamed from onProposeChange
}) => {
  const [isRecordConsensusModalOpen, setIsRecordConsensusModalOpen] = useState(false);
  const [isProposeChangeModalOpen, setIsProposeChangeModalOpen] = useState(false); // State for ProposeChangeModal

  if (!isOpen || !task) {
    return null;
  }

  // Simplified mock data directly in currentTask initialization
  const mockAssignee: User = { id: 'user-mock', name: 'Mock User', avatarUrl: 'https://i.pravatar.cc/150?u=mock' };
  const mockActivities: TaskActivity[] = [
    { id: 'act-1', userName: '小希', action: '提案了一項設計變更', details: '新的登入頁面設計，採用更簡潔的風格。', timestamp: '2 小時前' },
    { id: 'act-2', userName: '小李', action: '記錄了共識', details: '與 @小希 確認，動效簡化為淡入淡出。', timestamp: '5 小時前' },
    { id: 'act-3', userName: '小張', action: '建立了任務', timestamp: '1 天前' },
  ];

  const currentTask: Required<TaskData> = {
    id: task.id,
    title: task.title,
    description: task.description || '此任務沒有詳細描述。',
    figmaLink: task.figmaLink || '#',
    figmaPreviewUrl: task.figmaPreviewUrl || 'https://via.placeholder.com/600x400.png?text=Figma+Preview',
    currentFigmaVersion: task.currentFigmaVersion || '主要設計稿 v1.0',
    figmaVersionHistory: task.figmaVersionHistory || [
      { version: '主要設計稿 v1.0', link: '#v1', date: '2023-12-01' },
      { version: '草稿 v0.5', link: '#v0.5', date: '2023-11-25' },
    ],
    assignee: task.assignee || mockAssignee,
    status: task.status || '待辦',
    dueDate: task.dueDate || '2023-12-31',
    tags: task.tags || ['UI', '重要'],
    activities: task.activities || mockActivities,
  };

  // Handlers for RecordConsensusModal
  const handleOpenRecordConsensusModal = () => setIsRecordConsensusModalOpen(true);
  const handleCloseRecordConsensusModal = () => setIsRecordConsensusModalOpen(false);
  const handleSaveConsensus = (consensusText: string) => {
    onSaveConsensusText(currentTask.id, consensusText);
    handleCloseRecordConsensusModal();
  };

  // Handlers for ProposeChangeModal
  const handleOpenProposeChangeModal = () => setIsProposeChangeModalOpen(true);
  const handleCloseProposeChangeModal = () => setIsProposeChangeModalOpen(false);
  const handleSubmitProposal = (newFigmaLink: string, reason: string) => {
    onSubmitDesignProposal(currentTask.id, newFigmaLink, reason);
    handleCloseProposeChangeModal();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`任務: ${currentTask.id} - ${currentTask.title}`} size="xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">{currentTask.title}</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{currentTask.description}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">設計基準線 (Design Baseline)</h3>
              {currentTask.figmaPreviewUrl && (
                <div className="mb-3 bg-gray-100 rounded flex items-center justify-center p-2">
                  <img
                    src={currentTask.figmaPreviewUrl}
                    alt={`Design preview for ${currentTask.title}`}
                    className="max-w-full h-auto max-h-96 object-contain rounded"
                  />
                </div>
              )}
              <div className="mb-3">
                <a
                  href={currentTask.figmaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {currentTask.currentFigmaVersion} (開啟 Figma)
                </a>
              </div>
              {currentTask.figmaVersionHistory.length > 0 && (
                <div className="mb-4">
                  <label htmlFor="figma-version" className="block text-sm font-medium text-gray-700 mb-1">歷史版本:</label>
                  <select
                    id="figma-version"
                    name="figma-version"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    defaultValue={currentTask.currentFigmaVersion}
                  >
                    {currentTask.figmaVersionHistory.map(v => (
                      <option key={v.version} value={v.link}>{v.version} ({v.date})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex space-x-3 mt-4">
                <Button variant="secondary" onClick={handleOpenRecordConsensusModal}>
                  🗣️ 記錄共識
                </Button>
                <Button variant="primary" onClick={handleOpenProposeChangeModal}> {/* Updated onClick */}
                  ✍️ 提案變更
                </Button>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">任務狀態</h3>
              <div className="space-y-2 text-sm">
                <p><strong>負責人:</strong> {currentTask.assignee.name}</p>
                <p><strong>狀態:</strong> <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{currentTask.status}</span></p>
                <p><strong>到期日:</strong> {currentTask.dueDate}</p>
                <div>
                  <strong>標籤:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentTask.tags.map(tag => (
                      <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">活動日誌 (Activity Log)</h3>
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {currentTask.activities.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((activity) => ( // Sort activities by time
                  <li key={activity.id} className="flex items-start space-x-3 text-sm">
                    <Avatar src={activity.userAvatar} name={activity.userName} size="sm" />
                    <div>
                      <p className="text-gray-800">
                        <span className="font-semibold">{activity.userName}</span> {activity.action}
                      </p>
                      {activity.details && <p className="text-gray-600 bg-gray-50 p-2 rounded mt-1">{activity.details}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">{activity.timestamp}</p>
                    </div>
                  </li>
                ))}
                {currentTask.activities.length === 0 && (
                    <p className="text-sm text-gray-500">此任務尚無活動紀錄。</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Modal>

      {task && (
        <RecordConsensusModal
          isOpen={isRecordConsensusModalOpen}
          onClose={handleCloseRecordConsensusModal}
          onSaveConsensus={handleSaveConsensus}
          taskTitle={task.title}
        />
      )}

      {task && ( /* Ensure task is not null before rendering ProposeChangeModal */
        <ProposeChangeModal
          isOpen={isProposeChangeModalOpen}
          onClose={handleCloseProposeChangeModal}
          onSubmitProposal={handleSubmitProposal}
          taskTitle={task.title}
          currentFigmaLink={task.figmaLink}
        />
      )}
    </>
  );
};

export default TaskDetailModal;
