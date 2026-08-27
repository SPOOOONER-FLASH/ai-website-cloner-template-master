import Link from "next/link";
import { socialLinks } from "@/data/site";
import { CloseIcon, Wordmark } from "./icons";

const links = {
  en: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products/" },
    { label: "Product Finder", href: "/product-finder/" },
    { label: "Projects", href: "/projects/" },
    { label: "Company", href: "/company/" },
    { label: "Downloads", href: "/downloads/" },
    { label: "Contact us", href: "/contact/" },
  ],
  es: [
    { label: "Inicio", href: "/es/" },
    { label: "Productos", href: "/products/" },
    { label: "Buscador de productos", href: "/product-finder/" },
    { label: "Proyectos", href: "/es/projects/" },
    { label: "Empresa", href: "/es/company/" },
    { label: "Descargas", href: "/downloads/" },
    { label: "Contacto", href: "/es/contact/" },
  ],
} as const;

interface SiteMenuDrawerProps {
  isSpanish: boolean;
  currentPath: string;
  onClose: () => void;
}

export function SiteMenuDrawer({ isSpanish, currentPath, onClose }: SiteMenuDrawerProps) {
  const locale = isSpanish ? "es" : "en";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Site menu">
      <button type="button" aria-label="Dismiss site menu" onClick={onClose} className="absolute inset-0 bg-ink/20" />
      <div className="hard-shadow-drawer absolute inset-y-0 right-0 w-[calc(100%-1.2rem)] overflow-y-auto bg-surface sm:w-[88vw] xl:w-[75vw]">
        <div className="layout min-h-full py-32 sm:py-48">
          <div className="col-content flex min-h-full flex-col">
            <div className="flex items-center justify-between border-b border-line pb-24">
              <Link href={isSpanish ? "/es/" : "/"} onClick={onClose}>
                <Wordmark />
              </Link>
              <button type="button" aria-label="Close menu" onClick={onClose} className="p-8 text-ink-tertiary hover:text-ink">
                <CloseIcon className="h-24 w-24" />
              </button>
            </div>

            <div className="grid flex-1 gap-48 py-48 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(28rem,.7fr)]">
              <div>
                <p className="mb-24 text-c2 text-ink-secondary">{isSpanish ? "Navegación" : "Navigation"}</p>
                <nav>
                  <ul className="divide-y divide-line">
                    {links[locale].map((link) => {
                      const targetPath = link.href.replace(/\/$/, "") || "/";
                      const current =
                        currentPath === targetPath ||
                        (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            aria-current={current ? "page" : undefined}
                            className={`nav-marker nav-marker-inset block py-18 text-h2 text-ink no-underline ${current ? "current-nav" : ""}`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <div className="border-t border-line pt-24 md:border-l md:border-t-0 md:pl-32 md:pt-0">
                <p className="mb-24 text-c2 text-ink-secondary">{isSpanish ? "Síganos" : "Follow us"}</p>
                <ul className="grid grid-cols-2 gap-x-24 gap-y-20">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-48 border-t border-line pt-24">
                  <p className="text-c1 text-ink">Canton Hyland Hardware &amp; Locks Co., Ltd.</p>
                  <p className="mt-8 text-c2 text-ink-secondary">Manufacturing door hardware since 1998.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
