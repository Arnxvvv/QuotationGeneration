"use client";

import { useEffect, useRef, useState } from "react";

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  displayKey = "label",
  valueKey = "value",
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Find selected option label
  const selected = options.find((o) => String(o[valueKey]) === String(value));

  // Filter options by query
  const filtered = query.trim()
    ? options.filter((o) =>
        o[displayKey].toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, options.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(opt) {
    if (!opt) return;
    onChange(String(opt[valueKey]));
    setIsOpen(false);
    setQuery("");
  }

  function handleInputFocus() {
    setIsOpen(true);
    setQuery("");
    setHighlightedIndex(0);
  }

  function handleClear(e) {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setIsOpen(false);
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(filtered.length - 1);
      } else {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
      }
    } else if (e.key === "Enter") {
      if (isOpen) {
        e.preventDefault();
        if (filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex]);
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setQuery("");
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full min-w-0"
      onKeyDown={handleKeyDown}
    >
      <div
        className="input flex items-center cursor-pointer gap-1 min-w-0"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-0 w-full outline-none bg-transparent text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400"
            placeholder={
              placeholder
                ? `Search ${placeholder.replace(/^Select\s+/i, "")}…`
                : "Search…"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
          />
        ) : (
          <span
            className={`flex-1 min-w-0 text-sm truncate ${
              selected
                ? "text-gray-900 dark:text-slate-100 font-medium"
                : "text-gray-400 dark:text-slate-400"
            }`}
          >
            {selected ? selected[displayKey] : placeholder || "Select…"}
          </span>
        )}
        {value && !isOpen && (
          <button
            onClick={handleClear}
            className="text-gray-300 dark:text-slate-400 hover:text-gray-500 dark:hover:text-slate-200 transition-colors duration-150 text-xs px-1"
            title="Clear"
            type="button"
          >
            ✕
          </button>
        )}
        <svg
          className="w-3.5 h-3.5 text-gray-400 dark:text-slate-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/90 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
        >

          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500">
              No results
            </div>
          )}
          {filtered.map((opt, idx) => {
            const isSelected = String(opt[valueKey]) === String(value);
            const isHighlighted = idx === highlightedIndex;

            let itemClass = "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60";
            if (isSelected) {
              itemClass = "bg-gray-900 text-white dark:bg-indigo-600 dark:text-white font-medium";
            } else if (isHighlighted) {
              itemClass = "bg-indigo-50 text-indigo-900 dark:bg-slate-800 dark:text-indigo-300 font-medium";
            }

            return (
              <div
                key={opt[valueKey]}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-100 ${itemClass}`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => handleSelect(opt)}
              >
                {opt[displayKey]}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

