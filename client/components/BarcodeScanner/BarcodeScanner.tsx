import Quagga from "@ericblade/quagga2";
import cx from "classnames";
import React from "react";

import { ButtonSpinnerIcon } from "../Loading/ButtonSpinner";
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
      console.log("New barcode detected: ", code);
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
          className={cx(
            "aspect-video w-full rounded-lg overflow-hidden relative"
          )}
        >
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-slate-900 flex text-slate-50 justify-center items-center">
            <ButtonSpinnerIcon />
          </div>
          <div
            id={scannerVideoId}
            className="absolute top-0 right-0 bottom-0 left-0"
          />
        </div>
        <div className="absolute top-2 right-2 bottom-2 left-2 overflow-x-hidden overflow-y-auto p-2">
          <div className="flex flex-col justify-end gap-2">
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
          singleChannel: true,
          target: document.querySelector(`#${scannerVideoId}`),
          locate: false,
          constraints: {
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 },
            width: { min: 640, ideal: 1920, max: 4096 },
            height: { min: 480, ideal: 1080, max: 2400 },
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
