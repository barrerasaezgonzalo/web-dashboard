export const formatCLP = (valor: number | string) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor.toString() as unknown as number);
};

export function abrirGpt(
  pregunta: string,
  setPregunta: (preguna: string) => void,
) {
  if (!pregunta.trim()) {
    return;
  }
  const url = ` https://chatgpt.com/?prompt=${encodeURIComponent(pregunta)}`;

  window.open(url, "_blank");
  setPregunta("");
}

export function abrirGoogle(
  pregunta: string,
  setPregunta: (preguna: string) => void,
) {
  if (!pregunta.trim()) {
    return;
  }
  const url = `https://www.google.com/search?q=${encodeURIComponent(pregunta)}`;
  window.open(url, "_blank");
  setPregunta("");
}
