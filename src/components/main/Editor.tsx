import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorComponentProps {
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorComponentProps> = ({ onChange }) => {
  const [value, setValue] = useState("");
  const handleModelChange = (newContent: string) => {
    setValue(newContent);
    onChange(newContent);
  };

  return (
    <div className="">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleModelChange}
        className="h-full min-h-[300px]"
      />
    </div>
  );
};

export default Editor;
