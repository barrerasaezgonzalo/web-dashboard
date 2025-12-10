import { abrirGoogle } from "@/utils";
import { useEffect, useRef, useState } from "react";

export const Search: React.FC = () => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: { key: string }) => {
    if (e.key === "Enter" && search.trim()) {
      abrirGoogle(search, setSearch);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="bg-amber-600 p-4 rounded shadow ">
      <h2 className="text-xl font-bold mb-4 border-b">Búsqueda</h2>
      <input
        ref={inputRef}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        type="text"
        placeholder="Search on Google"
        className="w-full p-2 border bg-white border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={() => abrirGoogle(search, setSearch)}
        className="
                mt-2 w-full 
                bg-blue-500
                text-white 
                p-2 
                rounded 
                hover:bg-blue-600 
                transition-colors
            "
      >
        Enviar a Google
      </button>
    </div>
  );
};
