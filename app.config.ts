export default defineAppConfig({
    ui: {
        // Emerald accent (was 'green' which rendered purple due to a config bug).
        primary: 'emerald',
        // Use our single warm-gray family as Nuxt UI's neutral.
        gray: 'sand',
        // Consistent interactive feedback across all Nuxt UI components.
        button: {
            default: {
                // Subtle press feedback; hover handled per-variant by tokens.
                loadingIcon: 'i-tabler-loader-2',
            },
        },
        input: {
            default: {
                size: 'md',
            },
        },
        card: {
            // Hairline ring + soft tinted shadow instead of generic border+shadow.
            ring: 'ring-1 ring-sand-200 dark:ring-sand-800',
            rounded: 'rounded-2xl',
            shadow: 'shadow-soft',
            background: 'bg-white dark:bg-sand-900',
            divide: 'divide-y divide-sand-100 dark:divide-sand-800',
        },
        modal: {
            rounded: 'rounded-2xl',
        },
    },
});
