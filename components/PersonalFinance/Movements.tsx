import React, { useContext, useEffect, useRef } from "react";
import { CirclePlus, Logs, SquarePen, Trash } from "lucide-react";
import { modalTitles, typeLabels } from "@/constants";
import {
  formatCLP,
  formatDateToDMY,
  generateMonthOptions,
  getCategoryLabel,
  getCategoryLabels,
} from "@/utils";
import {
  AhorrosCategory,
  GastosCategory,
  IngresosCategory,
  MovementTypes,
  PersonalFinance,
} from "@/types";
import { useToast } from "@/hooks/useToast";
import { Toast } from "../ui/Toast";
import { movementSchema } from "./movementSchema";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { usePersonalFinance } from "@/hooks/usePersonalFinance";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";

export default function Movements() {
  const [modalType, setModalType] = React.useState<MovementTypes | null>(null);
  const [category, setCategory] = React.useState("");
  const [value, setValue] = React.useState<string>("");
  const [editingItem, setEditingItem] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const today = new Date();
    return `${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
  });
  const [selectedType, setSelectedType] =
    React.useState<PersonalFinance["type"]>("gastos");
  const [errors, setErrors] = React.useState<{
    category?: string;
    value?: string;
  }>({});

  const { toast, openToast, closeToast } = useToast();
  const { isPrivate } = usePrivacyMode();
  const { movements } = useContext(PersonalFinanceContext)!;
  const { addMovement, updateMovement, deleteMovement } = usePersonalFinance();

  const filtrados: PersonalFinance[] = movements.filter(
    (item: PersonalFinance) => {
      const [year, month] = item.date.split("-");
      return item.type === selectedType && `${month}-${year}` === selectedMonth;
    },
  );

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (modalType && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalType]);

  const total = filtrados.reduce((acc, curr) => acc + curr.value, 0);

  const validateForm = (): boolean => {
    const result = movementSchema.safeParse({
      category,
      value,
    });

    if (!result.success) {
      const formattedErrors: { category?: string; value?: string } = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "category" | "value";
        formattedErrors[field] = issue.message;
      });

      setErrors(formattedErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleAddMovement = () => {
    if (!validateForm() || !modalType) {
      return;
    }

    let newMovement: PersonalFinance;
    switch (modalType) {
      case "ingresos":
        newMovement = {
          id: Date.now().toString(),
          type: "ingresos",
          category: category as IngresosCategory,
          value: Number(value),
          date: new Date().toISOString().split("T")[0],
        };
        break;
      case "gastos":
        newMovement = {
          id: Date.now().toString(),
          type: "gastos",
          category: category as GastosCategory,
          value: Number(value),
          date: new Date().toISOString().split("T")[0],
        };
        break;
      case "ahorros":
        newMovement = {
          id: Date.now().toString(),
          type: "ahorros",
          category: category as AhorrosCategory,
          value: Number(value),
          date: new Date().toISOString().split("T")[0],
        };
        break;
      default:
        return;
    }

    addMovement(newMovement);
    resetModal();
  };

  const handleUpdateMovement = () => {
    if (!validateForm() || !editingItem || !modalType) return;

    const updatedMovement = {
      id: editingItem,
      type: modalType,
      category,
      value: Number(value),
      date: new Date().toISOString().split("T")[0],
    };

    updateMovement(updatedMovement);
    resetModal();
  };

  const handleDeleteMovement = (id: string) => {
    openToast({
      message: "¿Estás seguro que deseas eliminar el movimiento?",
      onConfirm: () => {
        deleteMovement(id);
        closeToast();
      },
      onCancel: closeToast,
    });
  };

  const handleOpenAddModal = () => {
    setModalType(selectedType);
    setEditingItem("");
    setValue("");
    const firstCategory = Object.keys(getCategoryLabels(selectedType))[0];
    setCategory(firstCategory);
    setErrors({});
  };

  const resetModal = () => {
    setModalType(null);
    setEditingItem("");
    setCategory("");
    setValue("");
    setErrors({});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim())
      editingItem ? handleUpdateMovement() : handleAddMovement();
  };

  return (
    <div className=" bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white text-black p-6 rounded-xl shadow-lg">
          <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4 gap-3">
            <h2 className="text-xl font-bold mb-2 border-b pb-1 w-full flex gap-2">
              <Logs size={25} />
              Movimientos
            </h2>

            <div className="flex gap-3 w-full justify-between">
              <div className="relative">
                <select
                  className="appearance-none border border-gray-300 rounded-lg p-2 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {generateMonthOptions()}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  className="appearance-none border border-gray-300 rounded-lg p-2 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(e.target.value as PersonalFinance["type"])
                  }
                >
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
              {filtrados.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No hay movimientos en este período
                </div>
              ) : (
                filtrados.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-1/3 flex flex-col">
                      <span className="font-medium text-gray-800">
                        {getCategoryLabel(item.type, item.category)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDateToDMY(item.date)}
                      </span>
                    </div>
                    <div
                      className={`w-1/3 text-center font-bold text-gray-900 ${isPrivate ? "privacy-blur" : ""}`}
                    >
                      {formatCLP(item.value)}
                    </div>
                    <div className="w-1/3 flex justify-end gap-2">
                      <button
                        className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                        onClick={() => {
                          setEditingItem(item.id);
                          setCategory(item.category);
                          setValue(item.value.toString());
                          setModalType(item.type);
                          setErrors({});
                        }}
                      >
                        <SquarePen size={22} />
                      </button>
                      <button
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleDeleteMovement(item.id)}
                      >
                        <Trash size={22} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t">
              <div
                className={`text-xl font-bold text-gray-800  ${isPrivate ? "privacy-blur" : ""}`}
              >
                Total: ${total.toLocaleString()}
              </div>
              <button
                onClick={handleOpenAddModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <CirclePlus size={24} />
              </button>
            </div>

            {modalType && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                  <button
                    className="absolute top-3 right-4 cursor-pointer text-3xl text-gray-400 hover:text-gray-700 font-bold transition-colors"
                    onClick={resetModal}
                  >
                    ×
                  </button>

                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                    {editingItem ? "Editar movimiento" : modalTitles[modalType]}
                  </h2>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                      </label>
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (errors.category) {
                            setErrors((prev) => ({
                              ...prev,
                              category: undefined,
                            }));
                          }
                        }}
                        className={`w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 transition-all ${
                          errors.category
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      >
                        {Object.entries(getCategoryLabels(selectedType)).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label as string}
                            </option>
                          ),
                        )}
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">
                          ⚠️ {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor
                      </label>
                      <input
                        type="text"
                        ref={inputRef}
                        placeholder="Ingresa el monto"
                        value={value}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                          setValue(e.target.value);
                          if (errors.value) {
                            setErrors((prev) => ({
                              ...prev,
                              value: undefined,
                            }));
                          }
                        }}
                        className={`w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 transition-all ${
                          errors.value
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      {errors.value && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">
                          ⚠️ {errors.value}
                        </p>
                      )}
                    </div>

                    <button
                      className="bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium cursor-pointer mt-2"
                      onClick={
                        editingItem ? handleUpdateMovement : handleAddMovement
                      }
                    >
                      {editingItem ? "Actualizar" : "Guardar"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      )}
    </div>
  );
}
