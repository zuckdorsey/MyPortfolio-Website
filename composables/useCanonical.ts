/**
 * Injects a per-page canonical link derived from the current route.
 * The siteUrl host is intentionally hardcoded and shared with useSEO /
 * useJsonLd — update all three together when the canonical domain is decided.
 */
export const useCanonical = () => {
  const route = useRoute();
  const siteUrl = "https://ababil.is-not-a.dev";

  useHead({
    link: [
      {
        rel: "canonical",
        href: `${siteUrl}${route.path === "/" ? "" : route.path}`,
      },
    ],
  });
};
