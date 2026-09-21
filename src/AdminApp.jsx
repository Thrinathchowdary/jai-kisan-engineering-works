import { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaTrash,
  FaTractor,
} from "react-icons/fa";
import { categories } from "./data/products";
import { productApi } from "./api";
import "./admin.css";

const emptyProduct = {
  category: categories[0].id,
  name: "",
  manufacturer: "",
  model: "",
  description: "",
  approvedPrice: "",
  subsidy50: "",
  farmerShare50: "",
  subsidy40: "",
  farmerShare40: "",
  image: "",
};
const fields = [
  ["name", "Product name"],
  ["manufacturer", "Manufacturer"],
  ["model", "Model"],
  ["description", "Description"],
  ["approvedPrice", "Approved price"],
  ["subsidy50", "Subsidy up to 50%"],
  ["farmerShare50", "Farmer share after 50%"],
  ["subsidy40", "Subsidy up to 40%"],
  ["farmerShare40", "Farmer share after 40%"],
  ["image", "Product image URL"],
];
const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-logo">
          <FaTractor />
        </div>
        <p className="admin-kicker">Jai Kisan Engineering Works</p>
        <h1>Admin sign in</h1>
        <p>Manage the product catalogue securely.</p>
        {error && <div className="admin-error">{error}</div>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button className="admin-primary" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <a href="/" className="admin-back-link">
          Back to public website
        </a>
      </form>
    </main>
  );
}

function ProductForm({ product, onCancel, onSaved, token }) {
  const [form, setForm] = useState(product || emptyProduct);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setForm(product || emptyProduct), [product]);
  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const saved = product
        ? await productApi.update(product.id, form, token)
        : await productApi.create(form, token);
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-heading">
        <div>
          <p className="admin-kicker">Catalogue record</p>
          <h2>{product ? "Edit product" : "Add product"}</h2>
        </div>
        <button type="button" className="admin-secondary" onClick={onCancel}>
          <FaArrowLeft /> Back
        </button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-form-grid">
        <label>
          Category
          <select
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
          >
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        {fields.map(([field, label]) => (
          <label key={field}>
            {label}
            {field === "description" ? (
              <textarea
                value={form[field]}
                onChange={(event) => update(field, event.target.value)}
                rows="3"
              />
            ) : (
              <input
                type={
                  field.includes("Price") ||
                  field.includes("Share") ||
                  [
                    "approvedPrice",
                    "subsidy50",
                    "farmerShare50",
                    "subsidy40",
                    "farmerShare40",
                  ].includes(field)
                    ? "number"
                    : "text"
                }
                min={
                  field !== "name" &&
                  field !== "manufacturer" &&
                  field !== "model" &&
                  field !== "description" &&
                  field !== "image"
                    ? "0"
                    : undefined
                }
                value={form[field]}
                onChange={(event) => update(field, event.target.value)}
                required={!["description", "image"].includes(field)}
              />
            )}
          </label>
        ))}
      </div>
      <div className="admin-form-actions">
        <button type="button" className="admin-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="admin-primary" disabled={busy}>
          {busy ? "Saving..." : product ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}

function Dashboard({ token, onLogout }) {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("default");
  const [error, setError] = useState("");
  const refresh = () =>
    productApi
      .list()
      .then(setProducts)
      .catch((err) => setError(err.message));
  useEffect(() => {
    refresh();
  }, []);
  const filtered = useMemo(
    () =>
      [...products]
        .filter(
          (product) =>
            (!category || product.category === category) &&
            (!query ||
              [product.name, product.manufacturer, product.model].some(
                (value) => value.toLowerCase().includes(query.toLowerCase()),
              )),
        )
        .sort((a, b) =>
          sort === "low"
            ? a.approvedPrice - b.approvedPrice
            : sort === "high"
              ? b.approvedPrice - a.approvedPrice
              : a.id - b.id,
        ),
    [products, query, category, sort],
  );
  const saved = () => {
    setView("list");
    setEditing(null);
    refresh();
  };
  const remove = async (product) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await productApi.remove(product.id, token);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  };
  if (view === "form")
    return (
      <main className="admin-shell">
        <AdminHeader onLogout={onLogout} />
        <ProductForm
          product={editing}
          token={token}
          onCancel={() => {
            setView("list");
            setEditing(null);
          }}
          onSaved={saved}
        />
      </main>
    );
  return (
    <main className="admin-shell">
      <AdminHeader onLogout={onLogout} />
      <section className="admin-content">
        <div className="admin-title-row">
          <div>
            <p className="admin-kicker">Jai Kisan Engineering Works</p>
            <h1>Product management</h1>
            <p>Manage the catalogue stored in MongoDB.</p>
          </div>
          <button className="admin-primary" onClick={() => setView("form")}>
            <FaPlus /> Add product
          </button>
        </div>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-toolbar">
          <label>
            <FaSearch />
            <input
              placeholder="Search products..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="default">Default order</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Model</th>
                <th>Approved price</th>
                <th>50% subsidy / share</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      {product.image ? (
                        <img src={product.image} alt="" />
                      ) : (
                        <span>
                          <FaTractor />
                        </span>
                      )}
                      <strong>{product.name}</strong>
                    </div>
                    <small>{product.manufacturer}</small>
                  </td>
                  <td>
                    {categories.find((item) => item.id === product.category)
                      ?.name || product.category}
                  </td>
                  <td>{product.model}</td>
                  <td>{formatPrice(product.approvedPrice)}</td>
                  <td>
                    {formatPrice(product.subsidy50)} /{" "}
                    {formatPrice(product.farmerShare50)}
                  </td>
                  <td>
                    <button
                      className="admin-icon-button"
                      title="Edit"
                      onClick={() => {
                        setEditing(product);
                        setView("form");
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-icon-button admin-danger"
                      title="Delete"
                      onClick={() => remove(product)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="admin-record-count">
          Showing {filtered.length} of {products.length} products
        </p>
      </section>
    </main>
  );
}

function AdminHeader({ onLogout }) {
  return (
    <header className="admin-header">
      <a href="/" className="admin-brand">
        <span>
          <FaTractor />
        </span>{" "}
        Jai Kisan <strong>Admin</strong>
      </a>
      <button className="admin-logout" onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </header>
  );
}

export default function AdminApp() {
  const [token, setToken] = useState(() =>
    window.sessionStorage.getItem("adminToken"),
  );
  const login = async (email, password) => {
    const result = await productApi.login(email, password);
    window.sessionStorage.setItem("adminToken", result.token);
    setToken(result.token);
  };
  const logout = () => {
    window.sessionStorage.removeItem("adminToken");
    setToken(null);
  };
  return token ? (
    <Dashboard token={token} onLogout={logout} />
  ) : (
    <Login onLogin={login} />
  );
}
