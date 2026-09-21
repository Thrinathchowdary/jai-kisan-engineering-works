import { products as localProducts } from "./data/products";

export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || "Network request failed");
  }

  return body;
}

export const productApi = {
  list: () => request("/api/products"),

  login: (email, password) =>
    request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  create: (product, token) =>
    request("/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    }),

  update: (id, product, token) =>
    request(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    }),

  remove: (id, token) =>
    request(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export async function loadProducts() {
  if (!API_URL) return localProducts;

  try {
    return await productApi.list();
  } catch (error) {
    console.warn(
      "Using bundled catalogue because the API is unavailable.",
      error.message,
    );

    return localProducts;
  }
}
