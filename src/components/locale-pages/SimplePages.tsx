import type { Metadata } from "next";
import { CompanyOverview } from "@/components/site/CompanyOverview";
import { ProductStudies } from "@/components/site/ProductStudies";
import { ServicesView } from "@/components/site/ServicesView";
import type { Locale } from "@/data/locales";
import { localeMetadata } from "./shared";

/** The routes whose whole page is already one shared component. */

export function companyMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/company",
    "Door Hardware Manufacturer in Xiaolan, China, Since 1998",
    "Door lock and architectural hardware made in Xiaolan since 1998. ISO 9001 certified since 2002, with OEM and private-label production for export.",
  );
}

export function CompanyPage({ locale }: { locale: Locale }) {
  return <CompanyOverview locale={locale} />;
}

export function servicesMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/services",
    "OEM & Private-Label Door Hardware Manufacturer in China",
    "OEM and private-label door hardware from Xiaolan, China: new tooling to your drawing, patent-conscious redesign, your brand and packaging.",
  );
}

export function ServicesPage({ locale }: { locale: Locale }) {
  return <ServicesView locale={locale} />;
}

export function productStudiesMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/product-studies",
    "Hardware in Focus — Product Photographs and Selections",
    "See Canton Hyland locks, cylinders and lever handles in original photographs and studio compositions. Check dimensions, finishes and specifications.",
    { image: "/images/product-studies/564-warm-stone-1440.webp" },
  );
}

export function ProductStudiesPage({ locale }: { locale: Locale }) {
  return <ProductStudies locale={locale} />;
}
