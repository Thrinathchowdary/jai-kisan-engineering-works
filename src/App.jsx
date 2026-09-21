import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBars,
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
  FaTractor,
  FaSeedling,
  FaSprayCan,
  FaCogs,
  FaLeaf,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";
import { categories, products as localProducts } from "./data/products";
import { supportedLanguages } from "./i18n/translations";
import { useLanguage } from "./context/LanguageContext";
import { useProducts } from "./context/ProductContext";
import AdminApp from "./AdminApp";

const phone = "9160830444";
const secondPhone = "9912335353";
const address =
  "K.K Road, Inkollu (V&M), Bapatla District, Andhra Pradesh, India";
const whatsappBase = `https://wa.me/91${phone}`;

const formatPrice = (value) => `₹${value.toLocaleString("en-IN")}`;
const farmerScenes = [
  {
    src: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=85",
    alt: "Indian farmer working in a green agricultural field",
  },
  {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
    alt: "Sunrise over green agricultural farmland",
  },
  {
    src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=85",
    alt: "Farmer walking through a healthy crop field",
  },
  {
    src: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=1200&q=85",
    alt: "Farmer inspecting crops in a field",
  },
  {
    src: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=85",
    alt: "Farmer working in a broad agricultural field",
  },
  {
    src: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=85",
    alt: "Farmer working in a rural agricultural landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1200&q=85",
    alt: "Green crop rows in natural sunlight",
  },
  {
    src: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=85",
    alt: "Farmer standing proudly in a field",
  },
];
const iconMap = {
  tractor: FaTractor,
  seed: FaSeedling,
  spray: FaSprayCan,
  gear: FaCogs,
  harvest: FaSeedling,
  hay: FaLeaf,
};

function openWhatsApp(product, t) {
  const message = product
    ? t("whatsapp.product")
        .replace("{name}", product.name)
        .replace("{model}", product.model)
    : t("whatsapp.general");
  window.open(
    `${whatsappBase}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function ProductImage({ product, large = false }) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      className={`image-placeholder ${large ? "image-placeholder-large" : ""}`}
      role="img"
      aria-label={`${product.name} ${t("product.imageSoon")}`}
    >
      <FaTractor />
      <span>{t("product.imageSoon")}</span>
    </div>
  ) : (
    <img
      src={product.image}
      alt={`${product.name} - Jai Kisan Engineering Works`}
      onError={() => setFailed(true)}
    />
  );
}
/*
      const timer = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % farmerScenes.length);
      }, 4500);
      return () => window.clearInterval(timer);
    }, [isPaused]);

    const moveSlide = (direction) => {
      setActiveIndex((current) => (current + direction + farmerScenes.length) % farmerScenes.length);
    };

    const handleTouchStart = (event) => {
      touchStart.current = event.touches[0].clientX;
      setIsPaused(true);
    };

    const handleTouchEnd = (event) => {
      if (touchStart.current === null) return;
      const distance = event.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(distance) > 45) moveSlide(distance < 0 ? 1 : -1);
      touchStart.current = null;
      setIsPaused(false);
    };

    return (
      <section className="hero" id="home" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="hero-scene" key={activeScene.src}><img src={activeScene.src} alt={activeScene.alt} /></div>
        <div className="hero-overlay" />
        <div className="container hero-fullscreen-content">
          <div className="hero-copy-block">
            <p className="hero-eyebrow"><span /> {t(copy[0])}</p>
            <h1>{t(copy[1])}<br /><em>{t(copy[2])}</em></h1>
            <p className="hero-short-copy">{t(copy[3])}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#products">{t("nav.products")} <FaArrowRight /></a>
              <button className="button button-hero-whatsapp" onClick={() => openWhatsApp(null, t)}><FaWhatsapp /> {t("hero.enquiry")}</button>
            </div>
          </div>
        </div>
        <div className="hero-bottom-line"><span><FaMapMarkerAlt /> {t("hero.compactLocation")}</span><span><FaPhoneAlt /> {phone} | {secondPhone}</span></div>
        <button className="hero-carousel-arrow hero-carousel-prev" onClick={() => moveSlide(-1)} aria-label={t("hero.previousScene")}><span>‹</span></button>
        <button className="hero-carousel-arrow hero-carousel-next" onClick={() => moveSlide(1)} aria-label={t("hero.nextScene")}><span>›</span></button>
        <div className="hero-carousel-controls"><div className="hero-dots">{farmerScenes.map((scene, index) => <button className={index === activeIndex ? "is-active" : ""} key={scene.src} onClick={() => setActiveIndex(index)} aria-label={`${t("hero.slide")} ${index + 1}`} />)}</div><button className="hero-pause" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? t("hero.play") : t("hero.pause")}>{isPaused ? "▶" : "Ⅱ"}</button></div>
      </section>
    );
            </button>
          </div>
          <label className="language-selector">
            <span>🌐 {t("nav.language")}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label={t("nav.language")}
            >
              {supportedLanguages.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.flag} {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef(null);
  const activeScene = farmerScenes[activeIndex];
  const slideCopy = [
    ["hero.slideOne.label", "hero.slideOne.title", "hero.slideOne.titleEm", "hero.slideOne.description"],
    ["hero.slideTwo.label", "hero.slideTwo.title", "hero.slideTwo.titleEm", "hero.slideTwo.description"],
    ["hero.slideThree.label", "hero.slideThree.title", "hero.slideThree.titleEm", "hero.slideThree.description"],
    ["hero.slideFour.label", "hero.slideFour.title", "hero.slideFour.titleEm", "hero.slideFour.description"],
  ];
  const copy = slideCopy[activeIndex % slideCopy.length];

  useEffect(() => {
    if (isPaused) return undefined;
      <div className="hero-scene" key={activeScene.src}>
        <img src={activeScene.src} alt={activeScene.alt} />
      </div>
      <div className="hero-overlay" />
      <div className="container hero-fullscreen-content">
        <div className="hero-copy-block">
          <p className="hero-eyebrow"><span /> {t(copy[0])}</p>
          <h1>{t(copy[1])}<br /><em>{t(copy[2])}</em></h1>
          <p className="hero-short-copy">{t(copy[3])}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#products">{t("nav.products")} <FaArrowRight /></a>
            <button className="button button-hero-whatsapp" onClick={() => openWhatsApp(null, t)}><FaWhatsapp /> {t("hero.enquiry")}</button>
          </div>
            >
              <span>‹</span>
      <div className="hero-bottom-line"><span><FaMapMarkerAlt /> {t("hero.compactLocation")}</span><span><FaPhoneAlt /> {phone} | {secondPhone}</span></div>
          <div className="hero-scene" key={`${activeScene.src}-${activeIndex}`}><img src={activeScene.src} alt={activeScene.alt} /></div>
      <button className="hero-carousel-arrow hero-carousel-prev" onClick={() => moveSlide(-1)} aria-label={t("hero.previousScene")}><span>‹</span></button>
      <button className="hero-carousel-arrow hero-carousel-next" onClick={() => moveSlide(1)} aria-label={t("hero.nextScene")}><span>›</span></button>
      <div className="hero-carousel-controls"><div className="hero-dots">{farmerScenes.map((scene, index) => <button className={index === activeIndex ? "is-active" : ""} key={scene.src} onClick={() => setActiveIndex(index)} aria-label={`${t("hero.slide")} ${index + 1}`} />)}</div><button className="hero-pause" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? t("hero.play") : t("hero.pause")}>{isPaused ? "▶" : "Ⅱ"}</button></div>
      <div className="hero-touch-target" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} aria-hidden="true" />
            </button>
            <button
              className="hero-carousel-arrow hero-carousel-next"
              onClick={() => moveSlide(1)}
              aria-label={t("hero.nextScene")}
            >
              <span>›</span>
            </button>
          </div>
          <div className="hero-carousel-controls">
            <div className="hero-dots">
              {farmerScenes.map((scene, index) => (
                <button
                  className={index === activeIndex ? "is-active" : ""}
                  key={scene.src}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${t("hero.slide")} ${index + 1}`}
                />
              ))}
            </div>
            <span>
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(farmerScenes.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

*/

function Header({ menuOpen, setMenuOpen }) {
  const { t, language, setLanguage } = useLanguage();
  const links = [
    [t("nav.home"), "home"],
    [t("nav.products"), "products"],
    [t("nav.categories"), "categories"],
    [t("nav.subsidy"), "subsidy"],
    [t("nav.about"), "about"],
    [t("nav.contact"), "contact"],
  ];
  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">
            <FaLeaf />
          </span>
          <span>
            Jai Kisan <strong>Engineering Works</strong>
          </span>
        </a>
        <button
          className="menu-toggle"
          aria-label={t("accessibility.toggleMenu")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {links.map(([label, id]) => (
            <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <div className="nav-actions">
            <a
              className="button button-small button-outline"
              href={`tel:+91${phone}`}
            >
              <FaPhoneAlt /> {t("nav.call")}
            </a>
            <button
              className="button button-small button-whatsapp"
              onClick={() => openWhatsApp(null, t)}
            >
              <FaWhatsapp /> {t("nav.whatsapp")}
            </button>
          </div>
          <label className="language-selector">
            <span>🌐 {t("nav.language")}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label={t("nav.language")}
            >
              {supportedLanguages.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.flag} {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef(null);
  const activeScene = farmerScenes[activeIndex];
  const slideCopy = [
    [
      "hero.slideOne.label",
      "hero.slideOne.title",
      "hero.slideOne.titleEm",
      "hero.slideOne.description",
    ],
    [
      "hero.slideTwo.label",
      "hero.slideTwo.title",
      "hero.slideTwo.titleEm",
      "hero.slideTwo.description",
    ],
    [
      "hero.slideThree.label",
      "hero.slideThree.title",
      "hero.slideThree.titleEm",
      "hero.slideThree.description",
    ],
    [
      "hero.slideFour.label",
      "hero.slideFour.title",
      "hero.slideFour.titleEm",
      "hero.slideFour.description",
    ],
  ];
  const copy = slideCopy[activeIndex % slideCopy.length];
  useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % farmerScenes.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, [isPaused]);
  const moveSlide = (direction) =>
    setActiveIndex(
      (current) =>
        (current + direction + farmerScenes.length) % farmerScenes.length,
    );
  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX;
    setIsPaused(true);
  };
  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(distance) > 45) moveSlide(distance < 0 ? 1 : -1);
    touchStart.current = null;
    setIsPaused(false);
  };
  return (
    <section
      className="hero"
      id="home"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-scene" key={activeScene.src}>
        <img src={activeScene.src} alt={activeScene.alt} />
      </div>
      <div className="hero-overlay" />
      <div className="container hero-fullscreen-content">
        <div className="hero-copy-block">
          <p className="hero-eyebrow">
            <span /> {t(copy[0])}
          </p>
          <h1>
            {t(copy[1])}
            <br />
            <em>{t(copy[2])}</em>
          </h1>
          <p className="hero-short-copy">{t(copy[3])}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#products">
              {t("nav.products")} <FaArrowRight />
            </a>
            <button
              className="button button-hero-whatsapp"
              onClick={() => openWhatsApp(null, t)}
            >
              <FaWhatsapp /> {t("hero.enquiry")}
            </button>
          </div>
        </div>
      </div>
      <div className="hero-bottom-line">
        <span>
          <FaMapMarkerAlt /> {t("hero.compactLocation")}
        </span>
        <span>
          <FaPhoneAlt /> {phone} | {secondPhone}
        </span>
      </div>
      <button
        className="hero-carousel-arrow hero-carousel-prev"
        onClick={() => moveSlide(-1)}
        aria-label={t("hero.previousScene")}
      >
        <span>‹</span>
      </button>
      <button
        className="hero-carousel-arrow hero-carousel-next"
        onClick={() => moveSlide(1)}
        aria-label={t("hero.nextScene")}
      >
        <span>›</span>
      </button>
      <div className="hero-carousel-controls">
        <div className="hero-dots">
          {farmerScenes.map((scene, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              key={scene.src}
              onClick={() => setActiveIndex(index)}
              aria-label={`${t("hero.slide")} ${index + 1}`}
            />
          ))}
        </div>
        <button
          className="hero-pause"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={isPaused ? t("hero.play") : t("hero.pause")}
        >
          {isPaused ? "▶" : "Ⅱ"}
        </button>
      </div>
    </section>
  );
}

function About() {
  const { t } = useLanguage();
  return (
    <section className="about section" id="about">
      <div className="container about-grid">
        <div>
          <p className="eyebrow dark">
            <span /> {t("about.eyebrow")}
          </p>
          <h2>
            {t("about.title")}
            <br />
            <em>{t("about.titleEm")}</em>
          </h2>
        </div>
        <div className="about-copy">
          <p>{t("about.description")}</p>
          <div className="about-list">
            <span>
              <FaCheck /> {t("about.land")}
            </span>
            <span>
              <FaCheck /> {t("about.sowing")}
            </span>
            <span>
              <FaCheck /> {t("about.protection")}
            </span>
            <span>
              <FaCheck /> {t("about.selfPropelled")}
            </span>
            <span>
              <FaCheck /> {t("about.harvesting")}
            </span>
            <span>
              <FaCheck /> {t("about.hay")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories({ onSelect, products }) {
  const { t, getLocalizedCategory } = useLanguage();
  return (
    <section className="category-section section" id="categories">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">
              <span /> {t("categories.eyebrow")}
            </p>
            <h2>{t("categories.title")}</h2>
          </div>
          <a href="#products" className="text-link">
            {t("categories.viewAll")} <FaArrowRight />
          </a>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon];
            const count = products.filter(
              (product) => product.category === category.id,
            ).length;
            return (
              <button
                className={`category-card category-${index + 1}`}
                key={category.id}
                onClick={() => onSelect(category.id)}
              >
                <span className="category-icon">
                  <Icon />
                </span>
                <span className="category-number">0{index + 1}</span>
                <h3>{getLocalizedCategory(category.id)}</h3>
                <p>
                  {count}{" "}
                  {count === 1
                    ? t("categories.product")
                    : t("categories.products")}
                </p>
                <span className="category-arrow">
                  <FaArrowRight />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onDetails }) {
  const { t, getLocalizedShortCategory } = useLanguage();
  return (
    <article className="product-card">
      <div className="product-visual">
        <ProductImage product={product} />
        <span className="category-tag">
          {getLocalizedShortCategory(product.category)}
        </span>
      </div>
      <div className="product-card-body">
        <p className="product-maker">{product.manufacturer}</p>
        <h3>{product.name}</h3>
        <p className="product-model">
          {t("product.model")}: {product.model}
        </p>
        <div className="price-block">
          <span>{t("product.approved")}</span>
          <strong>{formatPrice(product.approvedPrice)}</strong>
        </div>
        <div className="subsidy-preview">
          <div>
            <span>{t("product.subsidy50")}</span>
            <strong>{formatPrice(product.subsidy50)}</strong>
          </div>
          <div>
            <span>{t("product.share")}</span>
            <strong>{formatPrice(product.farmerShare50)}</strong>
          </div>
        </div>
        <div className="card-actions">
          <button
            className="button button-dark"
            onClick={() => onDetails(product)}
          >
            {t("product.details")}
          </button>
          <button
            className="icon-button whatsapp-icon"
            aria-label={`${t("product.whatsapp")} for ${product.name}`}
            title={t("product.whatsapp")}
            onClick={() => openWhatsApp(product, t)}
          >
            <FaWhatsapp />
          </button>
        </div>
      </div>
    </article>
  );
}

function Catalogue({
  selectedCategory,
  setSelectedCategory,
  onDetails,
  products,
}) {
  const { t, getLocalizedCategory } = useLanguage();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const list = products.filter(
      (product) =>
        (!selectedCategory || product.category === selectedCategory) &&
        (!normalized ||
          [product.name, product.model, product.manufacturer].some((value) =>
            value.toLowerCase().includes(normalized),
          )),
    );
    return [...list].sort((a, b) =>
      sort === "low"
        ? a.approvedPrice - b.approvedPrice
        : sort === "high"
          ? b.approvedPrice - a.approvedPrice
          : a.id - b.id,
    );
  }, [products, query, selectedCategory, sort]);
  return (
    <section className="catalogue section" id="products">
      <div className="container">
        <div className="section-heading catalogue-heading">
          <div>
            <p className="eyebrow dark">
              <span /> {t("catalogue.eyebrow")}
            </p>
            <h2>{t("catalogue.title")}</h2>
            <p className="section-intro">{t("catalogue.intro")}</p>
          </div>
          <span className="catalogue-count">
            {filteredProducts.length} / {products.length}{" "}
            {t("catalogue.productCount")}
          </span>
        </div>
        <div className="filters">
          <label className="search-field">
            <FaSearch />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("catalogue.searchPlaceholder")}
              aria-label={t("catalogue.searchLabel")}
            />
          </label>
          <select
            value={selectedCategory || ""}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="">{t("catalogue.all")}</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {getLocalizedCategory(category.id)}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label={t("catalogue.title")}
          >
            <option value="default">{t("catalogue.default")}</option>
            <option value="low">{t("catalogue.low")}</option>
            <option value="high">{t("catalogue.high")}</option>
          </select>
        </div>
        {selectedCategory && (
          <div className="active-filter">
            {t("catalogue.showing")}: {getLocalizedCategory(selectedCategory)}
            <button
              onClick={() => setSelectedCategory("")}
              aria-label={t("accessibility.clearFilter")}
            >
              <FaTimes />
            </button>
          </div>
        )}
        {filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                product={product}
                onDetails={onDetails}
                key={product.id}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaSearch />
            <h3>{t("catalogue.noResults")}</h3>
            <p>{t("catalogue.noResultsHint")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SubsidyTable({ products }) {
  const { t } = useLanguage();
  return (
    <section className="subsidy section" id="subsidy">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">
              <span /> {t("subsidy.eyebrow")}
            </p>
            <h2>
              SMAM 2025–2026
              <br />
              <em>{t("subsidy.titleEm")}</em>
            </h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("subsidy.product")}</th>
                <th>{t("subsidy.manufacturer")}</th>
                <th>{t("subsidy.model")}</th>
                <th>{t("product.approved")}</th>
                <th>{t("product.subsidy50")}</th>
                <th>{t("product.share")}</th>
                <th>{t("product.subsidy40")}</th>
                <th>{t("product.share")}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{product.manufacturer}</td>
                  <td>{product.model}</td>
                  <td className="table-price">
                    {formatPrice(product.approvedPrice)}
                  </td>
                  <td>{formatPrice(product.subsidy50)}</td>
                  <td>{formatPrice(product.farmerShare50)}</td>
                  <td>{formatPrice(product.subsidy40)}</td>
                  <td>{formatPrice(product.farmerShare40)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="subsidy-note">{t("subsidy.note")}</p>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useLanguage();
  return (
    <section className="contact section" id="contact">
      <div className="container contact-panel">
        <div className="contact-copy">
          <p className="eyebrow">
            <span /> {t("contact.eyebrow")}
          </p>
          <h2>
            {t("contact.title")}
            <br />
            <em>{t("contact.titleEm")}</em>
          </h2>
          <p>
            Jai Kisan Engineering Works
            <br />
            {t("contact.business")}
          </p>
        </div>
        <div className="contact-details">
          <div className="detail">
            <FaMapMarkerAlt />
            <span>{address}</span>
          </div>
          <div className="detail">
            <FaPhoneAlt />
            <span>
              <a href={`tel:+91${phone}`}>{phone}</a>
              <a href={`tel:+91${secondPhone}`}>{secondPhone}</a>
            </span>
          </div>
          <div className="contact-actions">
            <a className="button button-light" href={`tel:+91${phone}`}>
              <FaPhoneAlt /> {t("contact.call")} {phone}
            </a>
            <button
              className="button button-contact-whatsapp"
              onClick={() => openWhatsApp(null, t)}
            >
              <FaWhatsapp /> {t("nav.whatsapp")}
            </button>
            <a
              className="directions"
              href="https://www.google.com/maps/search/?api=1&query=K.K+Road,+Inkollu,+Bapatla+District,+Andhra+Pradesh"
              target="_blank"
              rel="noreferrer"
            >
              <FaMapMarkerAlt /> {t("contact.directions")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Modal({ product, onClose }) {
  const { t, getLocalizedDescription } = useLanguage();
  if (!product) return null;
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label={t("accessibility.closeDetails")}
        >
          <FaTimes />
        </button>
        <div className="modal-image">
          <ProductImage product={product} large />
        </div>
        <div className="modal-content">
          <p className="eyebrow dark">
            <span /> {t("product.detailsEyebrow")}
          </p>
          <p className="product-maker">{product.manufacturer}</p>
          <h2 id="modal-title">{product.name}</h2>
          <p className="product-model">
            {t("product.model")}: {product.model}
          </p>
          {product.description && (
            <p className="modal-description">
              {getLocalizedDescription(product)}
            </p>
          )}
          <div className="modal-price">
            <span>{t("product.approved")}</span>
            <strong>{formatPrice(product.approvedPrice)}</strong>
          </div>
          <div className="modal-prices">
            <div>
              <span>{t("product.subsidy50")}</span>
              <strong>{formatPrice(product.subsidy50)}</strong>
              <small>
                {t("product.share")}: {formatPrice(product.farmerShare50)}
              </small>
            </div>
            <div>
              <span>{t("product.subsidy40")}</span>
              <strong>{formatPrice(product.subsidy40)}</strong>
              <small>
                {t("product.share")}: {formatPrice(product.farmerShare40)}
              </small>
            </div>
          </div>
          <div className="modal-actions">
            <a className="button button-dark" href={`tel:+91${phone}`}>
              <FaPhoneAlt /> {t("product.call")}
            </a>
            <button
              className="button button-contact-whatsapp"
              onClick={() => openWhatsApp(product, t)}
            >
              <FaWhatsapp /> {t("product.enquiry")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <a className="brand footer-brand" href="#home">
            <span className="brand-mark">
              <FaLeaf />
            </span>
            <span>
              Jai Kisan <strong>Engineering Works</strong>
            </span>
          </a>
          <p>{t("contact.business")}</p>
        </div>
        <div className="footer-address">
          <span>{address}</span>
          <a href={`tel:+91${phone}`}>{phone}</a>
          <a href={`tel:+91${secondPhone}`}>{secondPhone}</a>
        </div>
        <div className="footer-links">
          <a href="#home">{t("nav.home")}</a>
          <a href="#products">{t("nav.products")}</a>
          <a href="#categories">{t("nav.categories")}</a>
          <a href="#subsidy">{t("nav.subsidy")}</a>
          <a href="#about">{t("footer.about")}</a>
          <a href="#contact">{t("nav.contact")}</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{t("footer.copyright")}</span>
        <span>{t("footer.location")}</span>
      </div>
    </footer>
  );
}

export default function App() {
  const { t } = useLanguage();
  const productStore = useProducts();
  if (window.location.pathname.startsWith("/admin")) return <AdminApp />;
  const products = productStore.products.length
    ? productStore.products
    : localProducts;
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const selectCategory = (id) => {
    setSelectedCategory(id);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <About />
        <Categories onSelect={selectCategory} products={products} />
        <Catalogue
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onDetails={setSelectedProduct}
          products={products}
        />
        <SubsidyTable products={products} />
        <Contact />
      </main>
      <Footer />
      <button
        className="floating-whatsapp"
        onClick={() => openWhatsApp(null, t)}
        aria-label={t("accessibility.openWhatsapp")}
        title={t("product.whatsapp")}
      >
        <FaWhatsapp />
      </button>
      <Modal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
