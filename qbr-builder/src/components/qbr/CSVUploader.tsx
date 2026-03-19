"use client";

import { useCallback, useState } from "react";

interface Props {
  label: string;
  description: string;
  onUpload: (content: string) => void;
  uploaded: boolean;
  example?: string;
}

export default function CSVUploader({ label, description, onUpload, uploaded, example }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => onUpload(e.target?.result as string);
      reader.readAsText(file);
    },
    [onUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-5 transition-colors cursor-pointer ${
        uploaded
          ? "border-emerald-400 bg-emerald-50"
          : dragging
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-gray-400 bg-white"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => document.getElementById(`file-${label}`)?.click()}
    >
      <input
        id={`file-${label}`}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div className="flex items-center gap-3">
        <span className="text-2xl">{uploaded ? "✅" : "📂"}</span>
        <div>
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
          {example && <p className="text-xs text-gray-400 mt-1 font-mono">{example}</p>}
        </div>
      </div>
    </div>
  );
}
