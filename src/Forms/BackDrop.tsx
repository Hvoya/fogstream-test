import * as React from "react";

interface IBackDropProps {
  children: React.ReactNode;
  toggle: () => void;
}

export const BackDrop = ({ children, toggle }: IBackDropProps) => (
  <div onDrag={e => e.stopPropagation()} onClick={toggle} className="backdrop">
    {children}
  </div>
);
