import { FC } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css"; // Import Froala Editor CSS
import "froala-editor/js/plugins.pkgd.min.js"; // Import Froala Editor JS plugins

interface FroalaEditorComponentProps {
  data: string;
  onChange: (content: string) => void;
}

const FroalaEditorComponent: FC<FroalaEditorComponentProps> = ({
  data,
  onChange,
}) => {
  const handleModelChange = (newContent: string) => {
    onChange(newContent);
  };

  return (
    <FroalaEditor
      tag="textarea"
      model={data}
      onModelChange={handleModelChange}
    />
  );
};

export default FroalaEditorComponent;
