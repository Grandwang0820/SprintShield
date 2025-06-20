'use client';

import React, { useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface ProposeChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposal: (newFigmaLink: string, reason: string) => void;
  taskTitle: string;
  currentFigmaLink?: string;
}

const ProposeChangeModal: React.FC<ProposeChangeModalProps> = ({
  isOpen,
  onClose,
  onSubmitProposal,
  taskTitle,
  currentFigmaLink,
}) => {
  const [newFigmaLink, setNewFigmaLink] = useState(currentFigmaLink || '');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!newFigmaLink.trim()) {
      alert('請提供新的 Figma 分享連結！');
      return;
    }
    if (!reason.trim()) {
      alert('請填寫變更理由！');
      return;
    }
    onSubmitProposal(newFigmaLink.trim(), reason.trim());
    // Reset fields for next time, though the modal usually unmounts or props change.
    // setNewFigmaLink('');
    // setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`為任務 "${taskTitle}" 提案設計變更`}
      size="lg" // Slightly larger for more content
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="figmaLink" className="block text-sm font-medium text-gray-700 mb-1">
            新的 Figma 分享連結:
          </label>
          <input
            type="url"
            id="figmaLink"
            value={newFigmaLink}
            onChange={(e) => setNewFigmaLink(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.figma.com/file/..."
          />
          {currentFigmaLink && <p className="text-xs text-gray-500 mt-1">目前連結: {currentFigmaLink}</p>}
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            變更理由:
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="請詳細說明提案變更的原因、優勢等..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            提交提案
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProposeChangeModal;
