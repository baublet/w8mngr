import React from "react";
import cx from "classnames";

import { DeleteIconButton } from "../Button/DeleteIconButton";
import { uploadFiles } from "../../helpers/uploadFiles";
import { ButtonSpinner } from "../Loading/ButtonSpinner";

import { filterFalsyKeys } from "../../../shared";

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
  uploadedFileUrl?: string;
  uploadedPublicId?: string;
  file: File;
};

export function Upload({
  limit = 1,
  bodyDrop = true,
  image = true,
  placeholder = (
    <>
      <strong>Choose a file</strong>
      <span> or drag it here</span>
    </>
  ),
}: {
  limit?: number;
  bodyDrop?: boolean;
  image?: boolean;
  placeholder?: JSX.Element;
} = {}) {
  const dragAndDropSupported = React.useMemo(supportsDragAndDrop, []);
  const dropWatchElementRef = React.useRef<HTMLFormElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [droppedFiles, setDroppedFiles] = React.useState<DroppedFile[]>([]);
  const [selectedUploadIds, setSelectedUploadIds] = React.useState<string[]>(
    []
  );

  const selectHandlers = React.useMemo(
    () => new Map<string, (e: React.ChangeEvent<HTMLInputElement>) => void>(),
    []
  );
  const getSelectHandler = React.useCallback((fileId: string) => {
    const handler = selectHandlers.get(fileId);
    if (handler) {
      return handler;
    }

    const createdHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDroppedFiles((droppedFiles) => {
        const file = droppedFiles.find((file) => file.id === fileId);
        const uploadId = file?.uploadedPublicId;
        if (!file || !uploadId) {
          return droppedFiles;
        }
        setSelectedUploadIds((ids) => {
          if (event.target.checked) {
            if (ids.includes(uploadId)) {
              return ids;
            }
            return [...ids, uploadId];
          }
          if (!ids.includes(uploadId)) {
            return ids;
          }
          return ids.filter((id) => id !== uploadId);
        });
        return droppedFiles;
      });
    };
    selectHandlers.set(fileId, createdHandler);

    return createdHandler;
  }, []);

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
        setSelectedUploadIds,
      });
    } else {
      console.log(e.originalEvent.dataTransfer.files);
    }
  }, []);

  const success = false;
  const uploading = false;
  const error = false;

  const deleteUpload = React.useCallback((id: string) => {
    setSelectedUploadIds((ids) => ids.filter((id) => id !== id));
    setDroppedFiles((files) => {
      const newFiles: DroppedFile[] = [];
      for (const file of files) {
        if (file.id !== id) {
          newFiles.push(file);
        }
      }
      return newFiles;
    });
  }, []);

  React.useEffect(() => {
    if (droppedFiles.length === 0) {
      return;
    }

    const unUploadedFile = droppedFiles.filter(
      (file) => file.uploadedFileUrl === undefined
    );

    if (unUploadedFile.length === 0) {
      return;
    }

    const interval = setTimeout(async () => {
      const results = await uploadFiles({
        files: droppedFiles,
      });
      setDroppedFiles((files) => {
        const copiedFiles: typeof files = [];
        const newIdsToSelect: string[] = [];
        for (const file of files) {
          const upload = results.find((result) => file.id === result.id);
          if (upload) {
            file.uploadedFileUrl = upload.publicUrl;
            file.uploadedPublicId = upload.publicId;
            newIdsToSelect.push(upload?.publicId);
          }
          copiedFiles.push(file);
        }
        setSelectedUploadIds((ids) => {
          console.log([...ids, ...newIdsToSelect]);
          return [...ids, ...newIdsToSelect].slice(0, limit);
        });
        return copiedFiles;
      });
    }, 500);
    return () => clearTimeout(interval);
  }, [droppedFiles]);

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
                  setSelectedUploadIds,
                });
              }}
            />
            <label htmlFor="file" className="text-sm text-center block">
              <div>{placeholder}</div>
              <div className="mt-2 text-xs text-green-700 text-opacity-50">
                Click or drag to upload
              </div>
            </label>
          </div>
        </form>
        <div className={cx({ hidden: !uploading })}>Uploading…</div>
        <div className={cx({ hidden: !success })}>Done!</div>
        <div className={cx({ hidden: !error })}>Error!</div>
      </div>
      <div className="flex flex-col gap-2">
        {droppedFiles.map((file) => {
          const isSelected = selectedUploadIds.includes(
            file.uploadedPublicId as string
          );
          return (
            <div
              className={cx(
                "flex gap-2 items-center hover:opacity-100 mt-2 border border-transparent rounded pl-2",
                {
                  "opacity-25 pointer-events-none": !file.uploadedFileUrl,
                  "opacity-75": file.uploadedFileUrl,
                  "border-purple-500 border-opacity-50 bg-purple-50 bg-opacity-50":
                    isSelected,
                }
              )}
              key={file.id}
            >
              <input
                type="checkbox"
                name={file.id}
                id={file.id}
                className="hidden"
                checked={isSelected}
                onChange={getSelectHandler(file.id)}
              />
              <label
                htmlFor={file.id}
                className="w-full flex gap-2 items-center pointer-cursor"
              >
                {file.uploadedFileUrl ? (
                  <UploadPreview url={file.uploadedFileUrl} />
                ) : (
                  <ButtonSpinner />
                )}
                <div className="text-xs truncate flex-grow">{file.name}</div>
              </label>
              <DeleteIconButton onClick={() => deleteUpload(file.id)} className="hover:bg-purple-600 focus:bg-purple-600 rounded-r-none" />
            </div>
          );
        })}
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
  setSelectedUploadIds,
}: {
  limit: number;
  filesDropped: FileList | null;
  setDroppedFiles: React.Dispatch<React.SetStateAction<DroppedFile[]>>;
  setSelectedUploadIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  if (!filesDropped) {
    setDroppedFiles([]);
    return;
  }

  if (limit === 1) {
    setSelectedUploadIds([]);
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
      file,
    });
  }
  setDroppedFiles((files) => {
    const filesCopy = limit === 1 && files.length > 0 ? [] : files.slice(0);
    const allFileIds = filesCopy.map((file) => file.id).join(" - ");
    for (const file of filesToSet) {
      if (limit === filesCopy.length) {
        break;
      }
      if (allFileIds.includes(file.id)) {
        continue;
      }
      filesCopy.push(file);
    }
    return filesCopy;
  });
  setSelectedUploadIds((ids) => {
    return filterFalsyKeys(
      [...ids, ...filesToSet.map((file) => file.uploadedPublicId)].slice(
        0,
        limit
      )
    );
  });
}

function idFromFile(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function UploadPreview({ url }: { url: string }) {
  return (
    <div className="inline-block w-6 h-full">
      <img src={url} title="Upload preview" className="w-full h-full" />
    </div>
  );
}
