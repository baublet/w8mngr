import React from "react";
import cx from "classnames";

import { DeleteIconButton } from "../Button/DeleteIconButton";

const allWatchEvents = [
  "drag",
  "dragstart",
  "dragend",
  "dragover",
  "dragenter",
  "dragleave",
  "drop",
];
const overWatchEvents = ["dragover", "dragenter"];
const outWatchEvents = ["dragleave", "dragend", "drop"];

type DroppedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
};

export function Upload({
  limit = 1,
  bodyDrop = true,
}: { limit?: number; bodyDrop?: boolean } = {}) {
  const dragAndDropSupported = React.useMemo(supportsDragAndDrop, []);
  const dropWatchElementRef = React.useRef<HTMLFormElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [droppedFiles, setDroppedFiles] = React.useState<DroppedFile[]>([]);

  const onAllDragEventsFunction = React.useCallback(
    (event: Pick<Event, "stopPropagation" | "preventDefault">) => {
      event.stopPropagation();
      event.preventDefault();
    },
    []
  );
  const onDragOver = React.useCallback(() => {
    setIsDragging(true);
  }, []);
  const onDragOut = React.useCallback(() => {
    setIsDragging(false);
  }, []);
  const onDrop = React.useCallback((e: any) => {
    if (e.dataTransfer) {
      setFiles({
        filesDropped: e.dataTransfer.files,
        limit,
        setDroppedFiles,
      });
    } else {
      console.log(e.originalEvent.dataTransfer.files);
    }
  }, []);

  const success = false;
  const uploading = false;
  const error = false;

  const deleteUpload = React.useCallback(
    (id: string) =>
      setDroppedFiles((files) => {
        const newFiles: DroppedFile[] = [];
        for (const file of files) {
          if (file.id !== id) {
            newFiles.push(file);
          }
        }
        return newFiles;
      }),
    []
  );

  React.useEffect(() => {
    const element = bodyDrop ? document.body : dropWatchElementRef.current;
    if (element) {
      element.addEventListener("drop", onDrop);
      for (const event of allWatchEvents) {
        element.addEventListener(event, onAllDragEventsFunction);
      }
      for (const event of overWatchEvents) {
        element.addEventListener(event, onDragOver);
      }
      for (const event of outWatchEvents) {
        element.addEventListener(event, onDragOut);
      }
    }
    return () => {
      if (element) {
        element.removeEventListener("drop", onDrop);
        for (const event of allWatchEvents) {
          element.removeEventListener(event, onAllDragEventsFunction);
        }
        for (const event of overWatchEvents) {
          element.removeEventListener(event, onDragOver);
        }
        for (const event of outWatchEvents) {
          element.removeEventListener(event, onDragOut);
        }
      }
    };
  }, [bodyDrop]);

  return (
    <>
      <div
        className={cx("p-2 bg-green-50 bg-opacity-25 hover:bg-opacity-50", {
          "bg-green-100": isDragging,
        })}
      >
        <form
          className={cx({
            "border-4 border-dashed border-purple-900 p-2":
              dragAndDropSupported,
            "border-opacity-5 ": !isDragging,
            "border-opacity-10": isDragging,
          })}
          method="post"
          action=""
          encType="multipart/form-data"
          ref={dropWatchElementRef}
        >
          <div className="h-32 flex justify-center items-center relative">
            <input
              className={cx("opacity-0 absolute inset-0 w-full cursor-pointer")}
              type="file"
              name="files[]"
              id="file"
              data-multiple-caption="{count} files selected"
              multiple={limit > 1}
              onChange={(e) => {
                setFiles({
                  filesDropped: e.target.files,
                  limit,
                  setDroppedFiles,
                });
              }}
            />
            <label htmlFor="file" className="text-sm">
              <strong>Choose a file</strong>
              <span className={cx(dragAndDropSupported)}> or drag it here</span>
            </label>
          </div>
        </form>
        <div className={cx({ hidden: !uploading })}>Uploading…</div>
        <div className={cx({ hidden: !success })}>Done!</div>
        <div className={cx({ hidden: !error })}>Error!</div>
      </div>
      <div className="flex flex-col gap-2">
        {droppedFiles.map((file) => (
          <div className="flex gap-2 items-center opacity-75 hover:opacity-100" key={file.id}>
            <DeleteIconButton onClick={() => deleteUpload(file.id)} />
            <div className="text-xs">{file.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function supportsDragAndDrop() {
  const div = document.createElement("div");
  return (
    ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
    "FormData" in window &&
    "FileReader" in window
  );
}

function setFiles({
  filesDropped,
  limit,
  setDroppedFiles,
}: {
  limit: number;
  filesDropped: FileList | null;
  setDroppedFiles: React.Dispatch<React.SetStateAction<DroppedFile[]>>;
}) {
  if (!filesDropped) {
    setDroppedFiles([]);
    return;
  }

  const filesToSet: DroppedFile[] = [];
  const filesArray = Array.from(filesDropped);
  for (const file of filesArray) {
    const id = idFromFile(file);
    filesToSet.push({
      id,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  }
  setDroppedFiles((files) => {
    const filesCopy = limit === 1 && files.length > 0 ? [] : files.slice(0);
    const allFileIds = filesCopy.map((file) => file.id).join(" - ");
    for (const file of filesToSet) {
      if (limit === filesCopy.length) {
        return filesCopy;
      }
      if (allFileIds.includes(file.id)) {
        continue;
      }
      filesCopy.push(file);
    }
    return filesCopy;
  });
}

function idFromFile(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}
