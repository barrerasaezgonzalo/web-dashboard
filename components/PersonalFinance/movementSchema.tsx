import { z } from "zod";

export const movementSchema = z.object({
  category: z.string().min(1, "Debes seleccionar una categoría"),
  value: z
    .string()
    .min(1, "El valor es requerido")
    .refine((val) => !isNaN(Number(val)), "Debe ser un número válido")
    .transform((val) => Number(val))
    .refine((val) => val >= 0, "El valor no puede ser negativo"),
});

export const financeHistoryItemSchema = z.object({
  date: z.string(),
  ingresos: z.number().nonnegative(),
  gastos: z.number().nonnegative(),
  ahorros: z.number().nonnegative(),
  saldo: z.number(),
});

export const financeHistorySchema = z.array(financeHistoryItemSchema);

export const financeResumeSchema = z.object({
  ingresos: z.number().nonnegative(),
  gastos: z.number().nonnegative(),
  ahorros: z.number().nonnegative(),
  saldo: z.number(),
});

export const resumeTypeSchema = z.enum(["ingresos", "gastos", "ahorros"]);

export type ResumeType = z.infer<typeof resumeTypeSchema>;

export const personalFinanceMovementSchema = z.object({
  id: z.string(),
  type: resumeTypeSchema,
  category: z.string(),
  value: z.number().min(0),
  date: z.string(),
});

export const personalFinanceMovementsSchema = z.array(
  personalFinanceMovementSchema,
);

export const movementDomainSchema = z.object({
  id: z.string(),
  date: z.string(), // YYYY-MM
  type: z.enum(["income", "expense", "saving"]),
  category: z.string(),
  value: z.number().nonnegative(),
  currency: z.enum(["CLP", "USD", "UF", "BTC"]),
});
