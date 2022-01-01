import React from "react";

import { SecondaryIconButton } from "../Button/SecondaryIcon";
import { BarcodeIcon } from "../Icons/Barcode";
import { Modal } from "../Modal";
import { BarcodeScanner } from "./BarcodeScanner";

export function BarcodeScannerButton({ day }: { day: string }) {
  const [open, setOpen] = React.useState(false);

  const closeFunction = React.useCallback(() => setOpen(false), []);
  const openFunction = React.useCallback(() => setOpen(true), []);

  return (
    <>
      <SecondaryIconButton onClick={openFunction}>
        <BarcodeIcon />
      </SecondaryIconButton>
      <Modal
        closeFunction={closeFunction}
        open={open}
        heading={
          <div className="flex gap-4 items-center">
            <div className="opacity-50">
              <BarcodeIcon />
            </div>
            <span>Scan Barcode</span>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <span>Scan a barcode to search for it in our database!</span>
          {!open ? null : <BarcodeScanner day={day} />}
        </div>
      </Modal>
    </>
  );
}
