export const Pending = () => {
  return (
    <div className="bg-blue-50 text-black p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">Pagos Pendientes</h2>
      <div className="text-black rounded-lg shadow-md mt-4">
        <ul className="flex flex-col gap-2">
          {["Arriendo", "Luz (3313497-5)", "Internet"].map(
            (categoria, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white p-2 rounded shadow"
              >
                <span>{categoria}</span>
                <span className="text-red-500 font-semibold">Pendiente</span>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
};
