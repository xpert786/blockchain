import React, { useRef, useState, useEffect } from "react";

export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      // highlight selected item when opening
      setHighlighted(Math.max(0, options.findIndex((o) => o.value === value)));
    } else {
      setHighlighted(-1);
    }
  }, [open, value, options]);

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      setHighlighted((prev) => Math.min(options.length - 1, (prev < 0 ? 0 : prev + 1)));
    } else if (e.key === "ArrowUp") {
      setHighlighted((prev) => Math.max(0, prev === -1 ? 0 : prev - 1));
    } else if (e.key === "Enter" && open && highlighted !== -1) {
      onChange(options[highlighted].value);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectedObj = options.find((o) => o.value === value);

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`} tabIndex={-1}>
      <button
        type="button"
        className={`w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins-custom shadow-sm transition focus:outline-none select-none ${open ? "shadow-lg border-[#14C179]" : ""}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${!selectedObj ? "text-gray-400" : "text-[#01373D]"}`}>
          {selectedObj ? selectedObj.label : placeholder}
        </span>
        <svg
          className={`ml-2 w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path d="M6 8l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          tabIndex={-1}
          className="absolute left-0 mt-1 w-full rounded-lg bg-white border border-gray-200 shadow-lg z-30 py-1"
          role="listbox"
          aria-activedescendant={highlighted}
        >
          {options.map((option, idx) => {
            const isSelected = value === option.value;
            const isHighlighted = highlighted === idx;
            return (
              <li
                key={option.value}
                className={`w-full flex items-center px-4 py-2 text-sm truncate cursor-pointer
                  ${isSelected ? "text-[#14C179] font-semibold" : "text-[#01373D]"}
                  ${isHighlighted ? "bg-[#F0FFFA]" : ""}
                `}
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(idx)}
                onClick={() => { onChange(option.value); setOpen(false); }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
