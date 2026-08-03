/**
 * Composable for JSON-LD structured data
 * Separated from app.vue to reduce hydration payload
 */
export const useJsonLd = () => {
    const siteUrl = "https://ababil.is-not-a.dev";
    const seoDescription =
        "Ababil Mustaqim is a professional backend developer from Bandung, experienced in building scalable, secure, and efficient backend systems. Explore projects, skills, and experience here.";

    useHead({
        script: [
            {
                type: "application/ld+json",
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Person",
                            "@id": `${siteUrl}/#person`,
                            name: "Ababil Mustaqim",
                            jobTitle: "Backend Developer",
                            description: seoDescription,
                            url: siteUrl,
                            image: `${siteUrl}/photo.jpeg`,
                            sameAs: [
                                "https://github.com/birdfromhell",
                                "https://www.linkedin.com/in/ababil-mustaqim/",
                                "https://id.quora.com/profile/Ababil-Mustaqim-1",
                            ],
                            alumniOf: [
                                {
                                    "@type": "EducationalOrganization",
                                    name: "SMKN 13 Bandung",
                                },
                                {
                                    "@type": "EducationalOrganization",
                                    name: "State Polytechnic of Batam",
                                },
                            ],
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
                        },
                        {
                            "@type": "WebSite",
                            name: "Ababil Mustaqim",
                            url: siteUrl,
                        },
                        {
                            "@type": "ProfilePage",
                            mainEntity: { "@id": `${siteUrl}/#person` },
                        },
                    ],
                }),
            },
        ],
    });
};
