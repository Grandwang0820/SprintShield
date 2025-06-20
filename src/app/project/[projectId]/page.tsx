'use client';

import React, { useState, useEffect } from 'react';
import TaskCard from '@/components/TaskCard';
import TaskDetailModal, { TaskData, TaskActivity } from './components/TaskDetailModal';

const mockProjectDetails = {
  id: 'proj-001',
  name: 'Q3 手機App改版',
};

const initialColumnsData = [
  { id: 'col-1', title: '待規劃 (To Plan)', task_ids: ['T-05'] }, // Using Task IDs directly
  { id: 'col-2', title: '待辦 (To Do)', task_ids: ['T-01', 'T-02', 'T-03'] },
  { id: 'col-3', title: '進行中 (In Progress)', task_ids: ['T-04'] },
  { id: 'col-4', title: '待測試 (To Test)', task_ids: [] },
  { id: 'col-5', title: '已完成 (Done)', task_ids: ['T-06'] },
];

// Using Task IDs as keys directly
const allMockTasksData: Record<string, TaskData> = {
  'T-01': {
    id: 'T-01',
    title: '優化登入頁面',
    description: '根據最新的使用者回饋，重新設計登入頁面，提升使用者體驗。主要目標是簡化流程並強化品牌識別。',
    figmaLink: 'https://www.figma.com/file/example1/version1',
    figmaPreviewUrl: 'https://via.placeholder.com/600x400.png?text=Login+V1+Preview',
    currentFigmaVersion: '登入頁面 v1.0 - 初稿',
    figmaVersionHistory: [ { version: '登入頁面 v1.0 - 初稿', link: '#v1.0', date: '2023-12-01' } ],
    assignee: { id: 'user-2', name: '小希', avatarUrl: 'https://i.pravatar.cc/150?u=xiaoxi' },
    status: '待辦', dueDate: '2023-12-15', tags: ['UI', 'Auth', '優化'],
    activities: [
      { id: 'act-T01-1', userName: '小張 (PM)', userAvatar: 'https://i.pravatar.cc/150?u=xiaozhang', action: '建立了任務', details: '請小希設計新的登入頁面', timestamp: '2023-12-01 10:00:00'},
    ]
  },
  'T-02': {
    id: 'T-02', title: '實作註冊流程', description: '開發完整的用戶註冊功能，包括表單驗證、密碼加密及帳戶激活郵件發送。',
    assignee: { id: 'user-3', name: '小李', avatarUrl: 'https://i.pravatar.cc/150?u=xiaoli' },
    status: '待辦', dueDate: '2023-12-20', tags: ['Backend', 'Auth'], activities: []
  },
  'T-03': {
    id: 'T-03', title: '設計使用者個人資料頁面', figmaLink: 'https://www.figma.com/file/example2',
    figmaPreviewUrl: 'https://via.placeholder.com/600x400.png?text=Profile+V1+Preview', currentFigmaVersion: '個人資料頁 v1.0',
    assignee: { id: 'user-2', name: '小希', avatarUrl: 'https://i.pravatar.cc/150?u=xiaoxi' },
    status: '待辦', tags: ['UI', 'Feature'], activities: []
  },
  'T-04': {
    id: 'T-04', title: '開發個人資料編輯功能', description: '允許使用者更新其個人資訊，如姓名、頭像、聯絡方式等。需包含前端界面及後端API。',
    assignee: { id: 'user-3', name: '小李', avatarUrl: 'https://i.pravatar.cc/150?u=xiaoli' },
    status: '進行中', dueDate: '2023-12-28', tags: ['Backend', 'Feature', 'API'], activities: []
  },
  'T-05': {
    id: 'T-05', title: '規劃忘記密碼流程', description: '設計並文件化用戶忘記密碼時的重設流程，確保安全性與易用性。',
    assignee: { id: 'user-1', name: '小張 (PM)', avatarUrl: 'https://i.pravatar.cc/150?u=xiaozhang' },
    status: '待規劃', tags: ['Planning', 'Auth', 'Security'], activities: []
  },
  'T-06': {
    id: 'T-06', title: '完成專案初始化設定', description: '設定開發環境、版本控制、以及基本的專案結構。',
    assignee: { id: 'user-3', name: '小李', avatarUrl: 'https://i.pravatar.cc/150?u=xiaoli' },
    status: '已完成', tags: ['Setup', 'DevOps'], activities: []
  }
};

interface Column { id: string; title: string; task_ids: string[]; }
interface KanbanBoardPageProps { params: { projectId: string }; }

const KanbanBoardPage: React.FC<KanbanBoardPageProps> = ({ params }) => {
  const [project, setProject] = useState(mockProjectDetails);
  const [columns, setColumns] = useState<Column[]>(initialColumnsData);
  const [tasks, setTasks] = useState<Record<string, TaskData>>(allMockTasksData);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const currentMockUser = { id: 'user-currentUser', name: '我 (Current User)', avatarUrl: 'https://i.pravatar.cc/150?u=currentUser' };

  useEffect(() => {
    setProject({ id: params.projectId, name: `專案 ${params.projectId} 看板` });
  }, [params.projectId]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => setDraggedTask(taskId);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTask) return;
    const sourceColumn = columns.find(col => col.task_ids.includes(draggedTask));
    if (!sourceColumn || sourceColumn.id === targetColumnId) {
      setDraggedTask(null); return;
    }
    const newColumns = columns.map(col => {
      if (col.id === sourceColumn.id) return { ...col, task_ids: col.task_ids.filter(id => id !== draggedTask) };
      if (col.id === targetColumnId) return { ...col, task_ids: [...col.task_ids, draggedTask] };
      return col;
    });
    setColumns(newColumns);
    setDraggedTask(null);
    const taskToUpdate = tasks[draggedTask];
    const targetColumnTitle = columns.find(c => c.id === targetColumnId)?.title;
    if (taskToUpdate && targetColumnTitle) {
        const updatedTask = { ...taskToUpdate, status: targetColumnTitle };
        setTasks(prevTasks => ({ ...prevTasks, [draggedTask]: updatedTask }));
        if (selectedTask && selectedTask.id === draggedTask) setSelectedTask(updatedTask);
    }
  };

  const handleTaskCardClick = (taskId: string) => {
    const task = tasks[taskId];
    if (task) { setSelectedTask(task); setIsModalOpen(true); }
  };

  const handleCloseModal = () => { setIsModalOpen(false); setSelectedTask(null); };

  const addActivityToTask = (taskId: string, activity: Omit<TaskActivity, 'id' | 'timestamp'>): TaskData | undefined => {
    const taskToUpdate = tasks[taskId];
    if (!taskToUpdate) return undefined;

    const newActivityEntry: TaskActivity = {
      ...activity,
      id: `act-${taskId}-${(taskToUpdate.activities?.length || 0) + Date.now()}`, // More unique ID
      timestamp: new Date().toLocaleString('zh-TW', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}),
    };
    const updatedActivities = [...(taskToUpdate.activities || []), newActivityEntry];
    return { ...taskToUpdate, activities: updatedActivities };
  };

  const handleSaveConsensusText = (taskId: string, consensusText: string) => {
    const updatedTask = addActivityToTask(taskId, {
        userName: currentMockUser.name,
        userAvatar: currentMockUser.avatarUrl,
        action: '記錄了共識',
        details: consensusText,
    });

    if (updatedTask) {
      setTasks(prevTasks => ({ ...prevTasks, [taskId]: updatedTask }));
      if (selectedTask && selectedTask.id === taskId) setSelectedTask(updatedTask);
    }
  };

  const handleSubmitDesignProposal = (taskId: string, newFigmaLink: string, reason: string) => {
    // Step 1: Add "Proposal" activity
    const taskAfterProposal = addActivityToTask(taskId, {
        userName: currentMockUser.name,
        userAvatar: currentMockUser.avatarUrl,
        action: '提案了設計變更',
        details: `新 Figma 連結: ${newFigmaLink}\n理由: ${reason}`,
    });

    if (!taskAfterProposal) return;

    // Step 2: Simulate PM Approval & Add "Approval" activity
    // In a real app, this would be an async process, likely involving backend calls and user interaction.
    // For MVP, we auto-approve from a mock "PM" after a short delay.

    // Update state with proposal activity first
    setTasks(prevTasks => ({ ...prevTasks, [taskId]: taskAfterProposal! }));
    if (selectedTask && selectedTask.id === taskId) setSelectedTask(taskAfterProposal);


    // Simulate delay for PM approval
    setTimeout(() => {
        // const currentTaskState = tasks[taskId] // Get potentially updated task state if other actions happened
        //                           || taskAfterProposal!; // Fallback to task state after proposal

        const mockPM = { name: "PM 小張", avatarUrl: 'https://i.pravatar.cc/150?u=pmXiaozhang' };
        const approvalDetails = `批准了由 ${currentMockUser.name} 提出的設計變更。\n新的設計稿: ${newFigmaLink}`;

        // Ensuring this is const as per the prefer-const lint rule
        const taskAfterApproval = addActivityToTask(taskId, {
            userName: mockPM.name,
            userAvatar: mockPM.avatarUrl,
            action: '批准了設計變更',
            details: approvalDetails,
        });

        if (taskAfterApproval) {
            const finalUpdatedTask = {
                ...taskAfterApproval,
                figmaLink: newFigmaLink,
                figmaPreviewUrl: `https://via.placeholder.com/600x400.png?text=${encodeURIComponent('Approved: ' + newFigmaLink.slice(-10))}`,
                currentFigmaVersion: `新設計稿 (已核准) - ${new Date().toLocaleDateString('zh-TW')}`,
                figmaVersionHistory: [
                    { version: `新設計稿 - ${new Date().toLocaleDateString('zh-TW')}`, link: newFigmaLink, date: new Date().toLocaleDateString() },
                    ...(taskAfterApproval.figmaVersionHistory || [])
                ]
            };
            setTasks(prevTasks => ({ ...prevTasks, [taskId]: finalUpdatedTask }));
            if (selectedTask && selectedTask.id === taskId) setSelectedTask(finalUpdatedTask);
        }
    }, 1000); // Simulate 1 second delay for approval
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
        <header className="mb-8"><h1 className="text-3xl font-bold text-gray-800">{project.name}</h1></header>
        <div className="flex-grow flex space-x-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 h-full"
              onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, column.id)}>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 px-2">{column.title}</h2>
              <div className="space-y-3 min-h-[200px]">
                {column.task_ids.map((taskId) => {
                  const task = tasks[taskId];
                  if (!task) return null;
                  let latestActivityText = "";
                  if (task.activities && task.activities.length > 0) {
                      // Sort activities: most recent first for display on card
                      const sortedActivities = [...task.activities].sort((a,b) => {
                          // Assuming timestamp format is 'YYYY-MM-DD HH:MM:SS' or can be parsed by Date
                          return new Date(b.timestamp.replace(/-/g,'/')).getTime() - new Date(a.timestamp.replace(/-/g,'/')).getTime();
                      });
                      const mostRecentActivity = sortedActivities[0];
                      if (mostRecentActivity) {
                          const timePart = mostRecentActivity.timestamp.split(' ')[1] || mostRecentActivity.timestamp;
                          latestActivityText = `${mostRecentActivity.userName} ${mostRecentActivity.action} (${timePart})`;
                      }
                  } else if (task.figmaLink && task.currentFigmaVersion) {
                      latestActivityText = `設計稿: ${task.currentFigmaVersion}`;
                  }


                  return (
                    <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} className="cursor-move">
                      <TaskCard
                        taskId={task.id} title={task.title} figmaPreviewUrl={task.figmaPreviewUrl}
                        latestActivity={latestActivityText} assignee={task.assignee} dueDate={task.dueDate}
                        tags={task.tags} onClick={() => handleTaskCardClick(task.id)}
                      />
                    </div>
                  );
                })}
                {column.task_ids.length === 0 && <div className="text-center text-sm text-gray-400 py-4">此欄無任務</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedTask && (
        <TaskDetailModal
          isOpen={isModalOpen} onClose={handleCloseModal} task={selectedTask}
          onSaveConsensusText={handleSaveConsensusText}
          onSubmitDesignProposal={handleSubmitDesignProposal} // Pass the new handler
        />
      )}
    </>
  );
};
export default KanbanBoardPage;
