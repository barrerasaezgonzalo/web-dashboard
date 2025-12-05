import { abrirGoogle } from "@/utils";
import { useState } from "react";

export const Search: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-amber-600 p-4 rounded shadow ">
      <h2 className="text-xl font-bold mb-4 border-b">Busqueda</h2>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
        Enviar a Googlle
      </button>
    </div>
  );
};
