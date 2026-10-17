import React, { useEffect } from 'react';
import { Button } from './Button';
import { X, AlertTriangle, Info } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Modal({
  isOpen,
  title,
  message,
  children,
  confirmText = '确定',
  cancelText = '取消',
  confirmVariant = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
}: ModalProps) {
  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩背景 */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />

      {/* 弹窗主体 */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 transition-all transform scale-100">
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            {confirmVariant === 'danger' ? (
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Info className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 text-sm text-gray-600">
          {message && <p>{message}</p>}
          {children}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
