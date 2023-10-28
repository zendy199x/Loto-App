import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorComponentProps {
  data: string;
  onChange: (data: string) => void;
}

const CKEditorComponent: React.FC<CKEditorComponentProps> = ({ data, onChange }) => {
  const [editorData, setEditorData] = useState(data);

  useEffect(() => {
    setEditorData(data);
  }, [data]);

  const handleChange = (_event: any, editor: any) => {
    const newData = editor.getData();
    setEditorData(newData);
    onChange(newData);
  };

  return (
    <CKEditor editor={ClassicEditor} data={editorData} onChange={handleChange} />
  );
};

export default CKEditorComponent;
