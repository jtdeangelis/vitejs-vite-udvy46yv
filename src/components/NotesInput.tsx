import React from 'react';

interface NotesInputProps {
  notes: string;
  onUpdateNotes: (notes: string) => void;
  placeholder?: string;
  label?: string;
}

const NotesInput: React.FC<NotesInputProps> = ({ 
  notes, 
  onUpdateNotes,
  placeholder = "Add notes about this room...",
  label = "Notes"
}) => {
  return (
    <div className="space-y-2 mt-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        value={notes || ""}
        onChange={(e) => onUpdateNotes(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        rows={3}
      />
    </div>
  );
};

export default NotesInput;