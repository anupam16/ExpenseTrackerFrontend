import React from "react";
import { DialogDefault } from "./DialogDefault";
import { YearDropdown } from "./DropDownMenu";

function Navbar() {
  return (
    <div className="bg-black text-white py-3 px-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold">Spend it</h2>
      <div className="flex items-center gap-4">
        <div className="py-2 px-4">
          <YearDropdown
            onSelect={(year) => console.log("Selected year:", year)}
          />
        </div>
        <DialogDefault />
      </div>
    </div>
  );
}

export default Navbar;
