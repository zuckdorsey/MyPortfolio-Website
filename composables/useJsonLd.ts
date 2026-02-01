/**
 * Composable for JSON-LD structured data
 * Separated from app.vue to reduce hydration payload
 */
export const useJsonLd = () => {
    const siteUrl = "https://ababil.is-not-a.dev";
    const seoDescription =
        "Ababil Mustaqim adalah seorang backend developer profesional dari Bandung, berpengalaman dalam membangun sistem backend yang scalable, aman, dan efisien. Temukan portofolio, proyek, dan keahlian teknologi terbaru di sini.";

    useHead({
        script: [
            {
                type: "application/ld+json",
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    name: "Ababil Mustaqim",
                    jobTitle: "Backend Developer",
                    description: seoDescription,
                    url: siteUrl,
                    image: `${siteUrl}/photo.jpeg`,
                    address: {
                        "@type": "PostalAddress",
                        addressLocality: "Bandung",
                        addressCountry: "Indonesia",
                    },
                    knowsAbout: [
                        "Python",
                        "Django",
                        "Flask",
                        "Node.js",
                        "PostgreSQL",
                        "Vue.js",
                        "Nuxt.js",
                        "REST API",
                        "Backend Development",
                    ],
                }),
            },
        ],
    });
};
