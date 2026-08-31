export interface CatalogueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface CatalogueReturnState {
  version: 1;
  listingUrl: string;
  productHref: string;
  scrollY: number;
  pending: boolean;
}

export interface CategoryView {
  active: string;
  page: number;
}

const STORAGE_KEY = "hyde.catalogue-return.v1";

function internalUrl(value: string): URL | null {
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  try {
    return new URL(value, "https://hyde.invalid");
  } catch {
    return null;
  }
}

function pathSegments(url: URL): string[] {
  return url.pathname.split("/").filter(Boolean);
}

function isCatalogueListingUrl(value: string): boolean {
  const url = internalUrl(value);
  if (!url) return false;
  const segments = pathSegments(url);
  return (
    (segments[0] === "product-finder" && segments.length === 1) ||
    (segments[0] === "products" && segments.length <= 2) ||
    (segments[0] === "es" && segments[1] === "products" && segments.length <= 3)
  );
}

function isProductDetailUrl(value: string): boolean {
  const url = internalUrl(value);
  if (!url) return false;
  const segments = pathSegments(url);
  return (
    (segments[0] === "products" && segments.length === 3) ||
    (segments[0] === "es" && segments[1] === "products" && segments.length === 4)
  );
}

function sameLocale(listingUrl: string, productHref: string): boolean {
  const listing = internalUrl(listingUrl);
  const product = internalUrl(productHref);
  if (!listing || !product) return false;
  const listingIsSpanish = pathSegments(listing)[0] === "es";
  const productIsSpanish = pathSegments(product)[0] === "es";
  return listingIsSpanish === productIsSpanish;
}

function parseState(raw: string | null): CatalogueReturnState | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const state = value as Partial<CatalogueReturnState>;
    if (
      state.version !== 1 ||
      typeof state.listingUrl !== "string" ||
      typeof state.productHref !== "string" ||
      typeof state.scrollY !== "number" ||
      !Number.isFinite(state.scrollY) ||
      state.scrollY < 0 ||
      typeof state.pending !== "boolean" ||
      !isCatalogueListingUrl(state.listingUrl) ||
      !isProductDetailUrl(state.productHref) ||
      !sameLocale(state.listingUrl, state.productHref)
    ) {
      return null;
    }
    return {
      version: 1,
      listingUrl: state.listingUrl,
      productHref: state.productHref,
      scrollY: Math.floor(state.scrollY),
      pending: state.pending,
    };
  } catch {
    return null;
  }
}

function storedState(storage: CatalogueStorage): CatalogueReturnState | null {
  try {
    return parseState(storage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function storeState(storage: CatalogueStorage, state: CatalogueReturnState) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private browsing. Navigation must still work.
  }
}

export function rememberCatalogueReturn(
  storage: CatalogueStorage,
  state: Omit<CatalogueReturnState, "version" | "pending">,
) {
  if (
    !isCatalogueListingUrl(state.listingUrl) ||
    !isProductDetailUrl(state.productHref) ||
    !sameLocale(state.listingUrl, state.productHref) ||
    !Number.isFinite(state.scrollY) ||
    state.scrollY < 0
  ) {
    return;
  }
  storeState(storage, {
    version: 1,
    listingUrl: state.listingUrl,
    productHref: state.productHref,
    scrollY: Math.floor(state.scrollY),
    pending: true,
  });
}

export function readCatalogueReturn(
  storage: CatalogueStorage,
  productHref: string,
): CatalogueReturnState | null {
  const state = storedState(storage);
  return state?.productHref === productHref ? state : null;
}

export function consumeCatalogueReturn(
  storage: CatalogueStorage,
  listingUrl: string,
): CatalogueReturnState | null {
  const state = storedState(storage);
  if (!state?.pending || state.listingUrl !== listingUrl) return null;
  storeState(storage, { ...state, pending: false });
  return state;
}

export function rearmCatalogueReturn(storage: CatalogueStorage, productHref: string) {
  const state = readCatalogueReturn(storage, productHref);
  if (state) storeState(storage, { ...state, pending: true });
}

export function categoryViewFromParams(
  params: URLSearchParams,
  validTypes: ReadonlySet<string>,
): CategoryView {
  const requestedType = params.get("type") ?? "all";
  const requestedPage = Number.parseInt(params.get("page") ?? "1", 10);
  return {
    active: validTypes.has(requestedType) ? requestedType : "all",
    page: Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  };
}

export function categoryViewToParams(
  params: URLSearchParams,
  view: CategoryView,
): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete("type");
  next.delete("page");
  if (view.active !== "all") next.set("type", view.active);
  if (view.page > 1) next.set("page", String(Math.floor(view.page)));
  return next;
}
