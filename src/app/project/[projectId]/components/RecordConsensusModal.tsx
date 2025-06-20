'use client';

import React, { useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface RecordConsensusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveConsensus: (consensusText: string) => void;
  taskTitle: string;
}

const RecordConsensusModal: React.FC<RecordConsensusModalProps> = ({
  isOpen,
  onClose,
  onSaveConsensus,
  taskTitle,
}) => {
  const [consensusText, setConsensusText] = useState('');

  const handleSave = () => {
    if (consensusText.trim()) {
      onSaveConsensus(consensusText.trim());
      setConsensusText(''); // Reset for next time
      onClose();
    } else {
      alert('請輸入共識內容！'); // Basic validation
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`記錄任務 "${taskTitle}" 的共識`}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          請在此記錄您與團隊成員就此任務達成的口頭或非正式共識。這將被添加到任務的活動日誌中。
        </p>
        <textarea
          value={consensusText}
          onChange={(e) => setConsensusText(e.target.value)}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="例如：與 @小希 確認，動效簡化為淡入淡出。"
        />
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSave}>
            儲存共識
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RecordConsensusModal;
