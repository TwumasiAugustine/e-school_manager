import { useState, useRef, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

type MultiSelectProps = {
  label?: string;
  options: string[];
  placeholder?: string;
  onChange?: (selected: string[]) => void;
  maxSelected?: number;
  required?: boolean;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  label = "Select Items",
  options,
  placeholder = "Search and select...",
  onChange = () => {},
  maxSelected = Infinity,
  required = false,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(
    (item) =>
      item.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(item)
  );

  const handleSelect = (item: string) => {
    if (selected.length >= maxSelected) return;
    const newSelected = [...selected, item];
    setSelected(newSelected);
    setSearch("");
    setIsOpen(false);
    onChange(newSelected);
  };

  const handleRemove = (item: string) => {
    const newSelected = selected.filter((s) => s !== item);
    setSelected(newSelected);
    onChange(newSelected);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full relative">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="border border-gray-300 rounded-md px-3 py-1 flex flex-wrap gap-1 min-h-[44px] bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all ">
        {selected.map((item) => (
          <div
            key={item}
            className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs flex items-center font-medium"
          >
            {item}
            <button
              title="Remove"
              type="button"
              onClick={() => handleRemove(item)}
              className="text-emerald-600 hover:text-gray-500 ml-2 border-l text-sm pl-1"
            >
              <AiOutlineClose size={14} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 min-w-[100px] outline-none  p-1 bg-transparent text-gray-700 placeholder-gray-400"
          placeholder={placeholder}
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-48 overflow-y-auto shadow-lg text-sm">
          {filtered.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-gray-700"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
