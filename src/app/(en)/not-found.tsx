import { ArrowLink } from "@/components/site/ArrowLink";

export default function NotFound() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <div className="col-content grid w-full grid-cols gap-x gap-y-24">
          <div className="col-span-full xl:col-span-12">
            <h1 className="text-h1 text-ink">
              404
              <br />
              <span className="text-h1-light">This page does not exist</span>
            </h1>
          </div>
          <div className="col-span-full xl:col-span-12">
            <p className="text-c1 text-ink">
              The address may be mistyped, or the page may have moved. The product catalogue
              is the best place to start.
            </p>
            <div className="mt-48 flex flex-col gap-24 sm:flex-row sm:gap-64">
              <ArrowLink href="/">Back to the homepage</ArrowLink>
              <ArrowLink href="/products">Product catalogue</ArrowLink>
              <ArrowLink href="/contact">Contact us</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
