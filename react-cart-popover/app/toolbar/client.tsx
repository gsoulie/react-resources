import { PopoverButton } from "@/components/ui/popover-button/PopoverButton";
import React from "react";

export const ToolbarClient = () => {
  return (
    <div className="flex flex-row p-4 gap-6">
      <form className="flex flex-row gap-5 grow">
        <input
          type="text"
          id="reference"
          name="reference"
          placeholder="Reference"
          className="p-2 w-full"
        />

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded"
        >
          Search
        </button>
      </form>
      <PopoverButton />
    </div>
  );
};
