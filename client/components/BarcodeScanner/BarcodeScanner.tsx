import Quagga from "@ericblade/quagga2";
import cx from "classnames";
import React from "react";

import { CloseIcon } from "../Icons/Close";
import { ButtonSpinnerIcon } from "../Loading/ButtonSpinner";
import { PrimaryLoader } from "../Loading/Primary";
import { ScannerResults } from "./ScannerResults";
import { scanSound, notFoundSound } from "./sound";

const scannerVideoId = "reader";
type BarCodeScanner = {
  pause: () => void;
  resume: () => void;
};

export function BarcodeScanner({
  day,
  close,
}: {
  day: string;
  close: () => void;
}) {
  // Good test code: "850009682307"
  const [codes, setCodes] = React.useState<string[]>([]);
  const [showShutter, setShowShutter] = React.useState(false);
  const [searchingBarcode, setSearchingBarcode] = React.useState(false);
  const [notFoundShown, setNotFoundShown] = React.useState(false);
  const barcodeScannerRef = React.useRef<BarCodeScanner>();

  const showNotFound = React.useCallback(() => {
    setNotFoundShown(true);
    notFoundSound.play();
  }, []);

  React.useEffect(() => {
    if (notFoundShown === false) {
      return;
    }
    const timeout = setTimeout(() => setNotFoundShown(false), 3000);
    return () => clearTimeout(timeout);
  }, [notFoundShown]);

  const scan = React.useCallback(() => {
    setShowShutter(true);
    scanSound.play();
    setSearchingBarcode(true);
    setNotFoundShown(false);
  }, []);

  const onScanSuccess = React.useCallback((code: string) => {
    setCodes((codes) => {
      if (codes.includes(code)) {
        return codes;
      }
      console.log("New barcode detected: ", code);
      scan();
      return [...codes, code];
    });
  }, []);

  const getHandleClose = React.useCallback(
    (code: string) => () => {
      setSearchingBarcode(false);
      setCodes((codes) => codes.filter((stateCode) => stateCode !== code));
    },
    []
  );

  const cancelItAll = React.useCallback(() => {
    if (searchingBarcode) {
      setSearchingBarcode(false);
      setShowShutter(false);
    }
    setNotFoundShown(false);
  }, []);

  React.useEffect(
    () =>
      initializeBarcodeScanner({
        onScanSuccess,
        onBarcodeScannerCreated: (barcodeScanner) =>
          (barcodeScannerRef.current = barcodeScanner),
      }),
    []
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => setShowShutter(false), 2000);
    return () => clearTimeout(timeout);
  }, [showShutter]);

  React.useEffect(() => {
    if (searchingBarcode) {
      barcodeScannerRef.current?.pause();
    } else {
      barcodeScannerRef.current?.resume();
    }
  }, [searchingBarcode]);

  return (
    <div
      className="rounded-lg overflow-hidden border border-slate-200 p-2 relative"
      onClick={cancelItAll}
    >
      <div
        className={cx(
          "aspect-square w-full rounded-lg overflow-hidden relative items-center select-none pointer-events-none"
        )}
      >
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-slate-900 flex text-slate-50 justify-center items-center">
          <ButtonSpinnerIcon />
        </div>
        <div
          id={scannerVideoId}
          className={cx("absolute top-0 right-0 bottom-0 left-0", {
            "opacity-50": searchingBarcode,
          })}
        />
        {showShutter && (
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-slate-50 shutter" />
        )}
        <div
          className={cx(
            "absolute right-0 top-0 bottom-0 left-0 50 justify-center items-center flex",
            {
              "opacity-0": !searchingBarcode,
              "opacity-100": searchingBarcode,
            }
          )}
        >
          <PrimaryLoader />
        </div>
        <div
          className={cx(
            "absolute right-0 top-0 bottom-0 left-0 50 justify-center items-center flex",
            {
              "opacity-0": !notFoundShown,
              fadeOut: notFoundShown,
            }
          )}
        >
          <div className="bg-slate-800 rounded-lg p-2 md:p-4 text-slate-50 flex gap-4">
            <span className="text-rose-500">
              <CloseIcon />
            </span>
            <span className="font-bold">Not Found. Try again</span>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2 bottom-2 left-2 overflow-x-hidden overflow-y-auto p-2">
        <div className="flex flex-col justify-end gap-2">
          {codes.map((code, i) => (
            <ScannerResults
              code={code}
              key={code}
              day={day}
              close={getHandleClose(code)}
              setLoadingFinished={() => setSearchingBarcode(false)}
              notFound={showNotFound}
              onAdded={close}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function initializeBarcodeScanner({
  onScanSuccess,
  onBarcodeScannerCreated = () => {},
}: {
  onScanSuccess: (code: string) => void;
  onBarcodeScannerCreated?: (barcodeScanner: BarCodeScanner) => void;
}) {
  function start() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          singleChannel: true,
          target: document.querySelector(`#${scannerVideoId}`),
          locate: false,
          constraints: {
            facingMode: "environment",
            aspectRatio: { min: 1, max: 1 },
            width: { min: 640, ideal: 1920, max: 4096 },
            height: { min: 640, ideal: 1920, max: 4096 },
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          multiple: true,
          frequency: 10,
        },
        decoder: {
          readers: ["upc_reader", "upc_e_reader"],
        },
      },
      (error?: Error) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.onDetected((code: { codeResult: { code: string } }) => {
          onScanSuccess(code.codeResult.code);
        });
        Quagga.start();
        onBarcodeScannerCreated({
          pause: () => {
            const cameraFeed = document.getElementById("reader");
            cameraFeed?.getElementsByTagName("video")[0]?.pause?.();
            Quagga.stop();
          },
          resume: start,
        });
      }
    );
  }
  start();

  return () => {
    Quagga.stop();
  };
}
