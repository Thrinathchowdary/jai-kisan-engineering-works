const fields = [
  "category",
  "name",
  "description",
  "manufacturer",
  "model",
  "approvedPrice",
  "subsidy50",
  "farmerShare50",
  "subsidy40",
  "farmerShare40",
  "image",
];

export function validateProduct(input) {
  const errors = {};
  for (const field of fields) {
    if (
      ["category", "name", "manufacturer", "model"].includes(field) &&
      !String(input[field] ?? "").trim()
    )
      errors[field] = "This field is required";
    if (
      [
        "approvedPrice",
        "subsidy50",
        "farmerShare50",
        "subsidy40",
        "farmerShare40",
      ].includes(field) &&
      (!Number.isFinite(Number(input[field])) || Number(input[field]) < 0)
    )
      errors[field] = "Enter a valid non-negative number";
  }
  if (
    input.image &&
    !/^https?:\/\//i.test(input.image) &&
    !input.image.startsWith("/")
  )
    errors.image = "Use an http(s) image URL or a public path";
  return errors;
}

export function normalizeProduct(input) {
  return {
    category: String(input.category ?? "").trim(),
    name: String(input.name ?? "").trim(),
    description: String(input.description ?? "").trim(),
    manufacturer: String(input.manufacturer ?? "").trim(),
    model: String(input.model ?? "").trim(),
    approvedPrice: Number(input.approvedPrice),
    subsidy50: Number(input.subsidy50),
    farmerShare50: Number(input.farmerShare50),
    subsidy40: Number(input.subsidy40),
    farmerShare40: Number(input.farmerShare40),
    image: String(input.image ?? "").trim(),
  };
}
