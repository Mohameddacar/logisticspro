'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export default function DeleteConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  isLoading = false
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden" showCloseButton={false}>
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-2">
                {description}
              </DialogDescription>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 flex items-center gap-3 sm:justify-center border-t">
          <Button variant="ghost" onClick={onClose} className="font-bold text-gray-500 hover:text-gray-700 flex-1">
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
            className="font-bold gap-2 flex-1 h-11 rounded-lg shadow-lg shadow-red-100 bg-red-600 hover:bg-red-700 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
