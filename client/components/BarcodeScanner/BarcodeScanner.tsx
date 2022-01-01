import React from "react";
import cx from "classnames";
import Quagga from "quagga";

import { ButtonSpinner } from "../Loading/ButtonSpinner";
import { ScannerResults } from "./ScannerResults";

const scannerVideoId = "reader";
type BarCodeScanner = {
  pause: () => void;
  resume: () => void;
};

export function BarcodeScanner({ day }: { day: string }) {
  const [codes, setCodes] = React.useState<string[]>([]);
  const barcodeScannerRef = React.useRef<BarCodeScanner>();
  const onScanSuccess = React.useCallback((code: string) => {
    setCodes((codes) => {
      if (codes.includes(code)) {
        return codes;
      }
      console.log("New barcode detected...");
      return [...codes, code];
    });
  }, []);

  const getHandleClose = (code: string) => () =>
    setCodes((codes) => codes.filter((stateCode) => stateCode !== code));

  React.useEffect(
    () =>
      initializeBarcodeScanner({
        onScanSuccess,
        onBarcodeScannerCreated: (barcodeScanner) =>
          (barcodeScannerRef.current = barcodeScanner),
      }),
    []
  );

  return (
    <>
      <div className="rounded-lg overflow-hidden border border-slate-200 p-2 relative">
        <div
          id={scannerVideoId}
          className={cx(
            "aspect-video w-full rounded-lg overflow-hidden relative"
          )}
        >
          <div className="-z-10 absolute top-0 right-0 bottom-0 left-0 bg-slate-900 flex text-slate-50 justify-center items-center">
            <ButtonSpinner />
          </div>
        </div>
        <div
          className={cx(
            "absolute top-2 right-2 bottom-2 left-2 overflow-y-auto p-2 flex flex-col justify-end"
          )}
        >
          {codes.map((code, i) => (
            <ScannerResults
              code={code}
              key={code}
              day={day}
              close={getHandleClose(code)}
            />
          ))}
        </div>
      </div>
    </>
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
          target: document.querySelector(`#${scannerVideoId}`),
          constraints: {
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 },
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          multiple: true,
          numOfWorkers: 2,
          frequency: 10,
        },
        decoder: {
          readers: ["upc_e_reader"],
        },
      },
      (error?: Error) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.onDetected((code: { codeResult: { code: string } }) => {
          onScanSuccess(code.codeResult.code);
        });
        Quagga.start();
        onBarcodeScannerCreated({
          pause: () => Quagga.stop(),
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
