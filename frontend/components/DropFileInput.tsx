import React, { useRef, useState } from "react";
import "./drop-file-input.css";

interface DropFileInputProps {
  onFileChange: (file: File) => void;
}

const DropFileInput: React.FC<DropFileInputProps> = ({ onFileChange }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDragEnter = () => wrapperRef.current?.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current?.classList.remove("dragover");
  const onDrop = () => wrapperRef.current?.classList.remove("dragover");

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      setFile(newFile);
      onFileChange(newFile);
    }
  };

  const fileRemove = () => {
    setFile(null);
  };

  return (
    <>
      {file == null && (<div
        ref={wrapperRef}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="
        drop-file-input
        w-full
        flex flex-col items-center justify-center
        rounded-2xl
        border-2 border-dashed border-zinc-400 dark:border-zinc-600
        bg-white dark:bg-zinc-900
        p-10
        text-center
        cursor-pointer
        transition
        hover:border-red-400 dark:hover:border-red-400
        hover:bg-zinc-50 dark:hover:bg-zinc-800
        shadow-sm hover:shadow-md
      "
      >
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <img
            className="w-10 opacity-70 dark:opacity-80"
            src="/magnifying_glass.png"
            alt=""
          />
          <p className="text-zinc-700 dark:text-zinc-300 text-lg">
            Drag & Drop your HAR file here
          </p>
        </div>
        <input type="file" onChange={onFileDrop} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
      )}

      {file != null && (
        <div className="drop-file-preview">

          <div className="drop-file-preview__item__info">
            <p>{file.name}</p>
            <p>{file.size}B</p>
            <br></br>
            <span
              onClick={fileRemove}
            >
              Click to remove
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default DropFileInput;
