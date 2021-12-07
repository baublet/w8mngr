import React from "react";
import cx from "classnames";

import { DeleteIconButton } from "../Button/DeleteIconButton";
import { uploadFiles } from "../../helpers/uploadFiles";
import { ButtonSpinner } from "../Loading/ButtonSpinner";
import { PrimaryLoader } from "../Loading/Primary";

import { filterFalsyKeys } from "../../../shared";
import { apolloClientService } from "../../helpers/apolloClientService";

import {
  GetUploadDataDocument,
  GetUploadDataQueryResult,
  GetUploadDataQueryVariables,
} from "../../generated";

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
const imageAcceptsTypes = {
  IMAGE: "image/*",
  ANY: undefined,
} as const;

type DroppedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  smallUrl?: string;
  uploadedPublicId?: string;
  file: File;
  uploadId?: string;
};

export function Upload({
  limit = 1,
  bodyDrop = true,
  type = "IMAGE",
  aspectRatio = "1/1",
  onChange,
  placeholder = (
    <>
      <strong>Choose a file</strong>
      <span> or drag it here</span>
    </>
  ),
  defaultSelectedUploadIds = [],
}: {
  limit?: number;
  bodyDrop?: boolean;
  type?: "IMAGE" | "ANY";
  placeholder?: JSX.Element;
  aspectRatio?: string;
  onChange: (selectedUploadIds: string[]) => void;
  defaultSelectedUploadIds?: string[];
}) {
  const dragAndDropSupported = React.useMemo(supportsDragAndDrop, []);
  const dropWatchElementRef = React.useRef<HTMLFormElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [droppedFiles, setDroppedFiles] = React.useState<DroppedFile[]>([]);
  const [selectedUploadIds, setSelectedUploadIds] = React.useState<string[]>(
    defaultSelectedUploadIds
  );
  const [loading, setLoading] = React.useState(
    defaultSelectedUploadIds.length > 0
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
        const uploadId = file?.uploadId;
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
    if (e?.dataTransfer?.files) {
      setFiles({
        filesDropped: e.dataTransfer.files,
        limit,
        setDroppedFiles,
        setSelectedUploadIds,
      });
    }
  }, []);

  const uploadAreaBackgroundImage = React.useMemo(() => {
    if (type !== "IMAGE") {
      return undefined;
    }
    if (limit > 1) {
      return undefined;
    }
    if (droppedFiles.length === 0) {
      return undefined;
    }
    if (selectedUploadIds.length === 0) {
      return undefined;
    }
    const selectedId = selectedUploadIds[0];
    if (!selectedId) {
      return undefined;
    }
    const selectedFile = droppedFiles.find(
      (file) => file.uploadId === selectedId
    );
    if (!selectedFile) {
      return undefined;
    }
    return selectedFile.smallUrl;
  }, [droppedFiles, selectedUploadIds, limit, type]);

  const deleteUpload = React.useCallback((id: string, uploadId?: string) => {
    setSelectedUploadIds((uploadIds) =>
      uploadIds.filter((id) => id !== id && id !== uploadId)
    );
    setDroppedFiles((files) => files.filter((file) => file.id !== id));
  }, []);

  useLoadInitialData({
    initialSelectedUploadIds: defaultSelectedUploadIds,
    setDroppedFiles,
    setSelectedUploadIds,
    setLoading,
  });

  React.useEffect(() => {
    onChange(selectedUploadIds);
  }, [selectedUploadIds]);

  React.useEffect(() => {
    if (droppedFiles.length === 0) {
      return;
    }

    const unUploadedFile = droppedFiles.filter(
      (file) => file.uploadId === undefined
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
            file.previewUrl = upload.previewUrl;
            file.smallUrl = upload.smallUrl;
            file.uploadedPublicId = upload.publicId;
            file.uploadId = upload.uploadId;
            newIdsToSelect.push(upload.uploadId);
          }
          copiedFiles.push(file);
        }
        setSelectedUploadIds((ids) =>
          [...ids, ...newIdsToSelect].slice(0, limit)
        );
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

  if (loading) {
    return (
      <div className="text-purple-700">
        <PrimaryLoader />
      </div>
    );
  }

  return (
    <>
      <div
        className={cx(
          "p-2 bg-green-50 bg-opacity-25 hover:bg-opacity-50 rounded",
          {
            "bg-green-100": isDragging,
          }
        )}
        style={{
          backgroundImage: "url(" + uploadAreaBackgroundImage + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          aspectRatio,
        }}
      >
        <form
          className={cx({
            "border-4 border-dashed border-purple-900 p-2 w-full h-full":
              dragAndDropSupported,
            "border-opacity-10": !isDragging,
            "border-opacity-20": isDragging,
            "border-purple-50": uploadAreaBackgroundImage,
            "border-purple-900": !uploadAreaBackgroundImage,
          })}
          method="post"
          action=""
          encType="multipart/form-data"
          ref={dropWatchElementRef}
        >
          <div className="h-full w-full flex relative justify-center items-center">
            <input
              className={cx("opacity-0 absolute inset-0 w-full cursor-pointer")}
              type="file"
              name="files[]"
              id="file"
              data-multiple-caption="{count} files selected"
              multiple={limit > 1}
              accept={imageAcceptsTypes[type]}
              onChange={(e) => {
                setFiles({
                  filesDropped: e.target.files,
                  limit,
                  setDroppedFiles,
                  setSelectedUploadIds,
                });
              }}
            />
            <label
              htmlFor="file"
              className={cx("text-sm text-center block", {
                "z-0 opacity-0": uploadAreaBackgroundImage,
              })}
            >
              <div>{placeholder}</div>
              <div className="text-xs text-opacity-50 text-green-700 mt-2">
                Click or drag to upload
              </div>
            </label>
          </div>
        </form>
      </div>
      <div className="flex flex-col gap-2">
        {droppedFiles.map((file) => {
          const isSelected = selectedUploadIds.includes(
            file.uploadId as string
          );
          return (
            <div
              className={cx(
                "py-1 flex justify-between gap-2 items-center hover:opacity-100 mt-2 border border-transparent rounded cursor-pointer overflow-hidden",
                {
                  "opacity-25 pointer-events-none": !file.previewUrl,
                  "opacity-75": file.previewUrl,
                  "border-purple-500 border-opacity-50 bg-purple-50 bg-opacity-50":
                    isSelected,
                }
              )}
              key={file.id}
            >
              <div style={{ maxWidth: "75%" }}>
                <label
                  htmlFor={file.id}
                  className="flex gap-2 items-center pointer-cursor pl-2"
                >
                  <input
                    type="checkbox"
                    name={file.id}
                    id={file.id}
                    className="hidden"
                    checked={isSelected}
                    onChange={getSelectHandler(file.id)}
                  />
                  {file.previewUrl ? (
                    <UploadPreview url={file.previewUrl} />
                  ) : (
                    <ButtonSpinner />
                  )}
                  <div className="text-xs flex-grow truncate break-words max-w-full">
                    {file.name}
                  </div>
                </label>
              </div>
              <div style={{ maxWidth: "25%" }}>
                <DeleteIconButton
                  onClick={() => deleteUpload(file.id, file.uploadedPublicId)}
                  className="hover:bg-purple-600 focus:bg-purple-600 rounded-r-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function useLoadInitialData({
  initialSelectedUploadIds,
  setDroppedFiles,
  setSelectedUploadIds,
  setLoading,
}: {
  initialSelectedUploadIds: string[];
  setDroppedFiles: React.Dispatch<React.SetStateAction<DroppedFile[]>>;
  setSelectedUploadIds: React.Dispatch<React.SetStateAction<string[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  React.useEffect(() => {
    const getClient = window.w8mngrServiceContainer.get(apolloClientService);
    const client = getClient();

    if (initialSelectedUploadIds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all(
      initialSelectedUploadIds.map(async (id) => {
        const result = await client.mutate<
          GetUploadDataQueryResult["data"],
          GetUploadDataQueryVariables
        >({
          mutation: GetUploadDataDocument,
          variables: {
            input: {
              id,
            },
          },
        });

        const uploadData = result.data?.upload;

        if (!uploadData) {
          console.error("Upload not found...", { id });
          setSelectedUploadIds((uploadIds) =>
            uploadIds.filter((id) => id !== id)
          );
          return;
        }

        setDroppedFiles((droppedFiles) => [
          ...droppedFiles,
          {
            file: {} as any,
            id: uploadData.id,
            name: uploadData.id,
            size: 0,
            type: "ANY",
            previewUrl: uploadData.preview,
            uploadId: uploadData.id,
            smallUrl: uploadData.small,
            uploadedPublicId: uploadData.publicId,
          },
        ]);
      })
    )
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [initialSelectedUploadIds.join("/")]);
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
      [...ids, ...filesToSet.map((file) => file.uploadId)].slice(0, limit)
    );
  });
}

function idFromFile(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function UploadPreview({ url }: { url: string }) {
  return (
    <div className="inline-block w-8 h-8" style={{ aspectRatio: "1" }}>
      <img src={url} title="Upload preview" className="w-full h-full" />
    </div>
  );
}
