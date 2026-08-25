/**
 * Serialize structured data for an inline script element.
 *
 * JSON itself permits `<`, but HTML treats `</script>` as markup even inside a script
 * payload. Escaping every less-than sign keeps CMS-managed text from ending the script
 * early while preserving the exact value returned by JSON.parse().
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
