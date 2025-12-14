import { renderHook, act } from "@testing-library/react";
import { usePrompts } from "@/hooks/usePrompts";
import { useData } from "@/hooks/useData";

jest.mock("@/hooks/useData");

describe("usePrompts hook", () => {
  it("handleAdd llama a getPrompt y actualiza parsedData", async () => {
    const getPromptMock = jest.fn().mockResolvedValue("mi prompt");
    (useData as jest.Mock).mockReturnValue({ getPrompt: getPromptMock });

    const { result } = renderHook(() => usePrompts());

    // seteamos el input
    act(() => {
      result.current.setInput("mi prompt");
    });

    // llamamos handleAdd y esperamos que termine
    await act(async () => {
      await result.current.handleAdd();
    });

    // verificamos que getPrompt fue llamado y parsedData se actualizó
    expect(getPromptMock).toHaveBeenCalledWith("mi prompt");
  });
});
