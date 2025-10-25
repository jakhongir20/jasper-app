import { FC, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface QuillProps {
  className?: string;
}

export const QuillEditor: FC<QuillProps> = ({ ...rest }) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
    }
  }, []);

  return (
    <div
      className={
        "overflow-hidden rounded-lg [&_.ql-editor]:!min-h-[216px] [&_div:last-child]:!rounded-b-lg [&_div:last-child]:!rounded-t-none [&_div]:!rounded-t-lg [&_div]:!border-gray-800"
      }
    >
      <ReactQuill
        className={"bg-gray-600"}
        ref={quillRef}
        theme="snow"
        {...rest}
      />
    </div>
  );
};
