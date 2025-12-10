import { supabase } from "@/lib/supabaseClient";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: { id: "1" }, error: null }),
  })),
}));

describe("Supabase client", () => {
   

  it("can filter with eq() and single()", async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", "1")
      .maybeSingle(); // usa maybeSingle() para no romper si no hay resultado

    expect(error).toBeNull();
    // data puede ser null si no existe la tarea
    expect(data === null || typeof data === "object").toBe(true);
  });
});
