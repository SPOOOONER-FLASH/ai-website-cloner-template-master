"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  consumeCatalogueReturn,
  readCatalogueReturn,
  rearmCatalogueReturn,
  rememberCatalogueReturn,
} from "@/lib/catalogue-return";

export function CatalogueProductLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      data-catalogue-product={href}
      onNavigate={() => {
        rememberCatalogueReturn(window.sessionStorage, {
          listingUrl: `${window.location.pathname}${window.location.search}`,
          productHref: href,
          scrollY: window.scrollY,
        });
      }}
    >
      {children}
    </Link>
  );
}

export function CatalogueReturnLink({
  productHref,
  fallbackHref,
  children,
  className,
}: {
  productHref: string;
  fallbackHref: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Link
      href={fallbackHref}
      className={className}
      onNavigate={(event) => {
        const remembered = readCatalogueReturn(window.sessionStorage, productHref);
        if (!remembered) return;
        event.preventDefault();
        rearmCatalogueReturn(window.sessionStorage, productHref);
        router.push(remembered.listingUrl, { scroll: false });
      }}
    >
      {children}
    </Link>
  );
}

export function CatalogueReturnRestorer({ readyKey }: { readyKey: string }) {
  useEffect(() => {
    const listingUrl = `${window.location.pathname}${window.location.search}`;
    const remembered = consumeCatalogueReturn(window.sessionStorage, listingUrl);
    if (!remembered) return;

    const card = [...document.querySelectorAll<HTMLElement>("[data-catalogue-product]")].find(
      (element) => element.dataset.catalogueProduct === remembered.productHref,
    );

    if (!card) {
      rearmCatalogueReturn(window.sessionStorage, remembered.productHref);
      return;
    }

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: remembered.scrollY, behavior: "auto" });
        const bounds = card.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) {
          card.scrollIntoView({ block: "center", behavior: "auto" });
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [readyKey]);

  return null;
}
