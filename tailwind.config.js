/** @type {import('tailwindcss').Config} */
export default {
    theme: {
        extend: {
            colors: {
                // Single warm-gray neutral family (replaces neutral/stone/gray mix).
                // Warm off-white base → near-black. Never pure black.
                sand: {
                    50: '#fafaf8',
                    100: '#f4f3ef',
                    200: '#e7e5df',
                    300: '#d5d2c9',
                    400: '#a8a49a',
                    500: '#7c786f',
                    600: '#5d5a53',
                    700: '#45433e',
                    800: '#2a2926',
                    900: '#1a1917',
                    950: '#131211',
                },
                // Desaturated emerald accent (saturation kept in check).
                // Fixes the old bug where `green` was actually purple (#a855f7).
                emerald: {
                    50: '#eff7f2',
                    100: '#d7ecdf',
                    200: '#b2d9c4',
                    300: '#83bfa2',
                    400: '#54a180',
                    500: '#338565',
                    600: '#266a51',
                    700: '#1f5643',
                    800: '#1b4537',
                    900: '#173a2f',
                    950: '#0c211a',
                },
            },
            fontFamily: {
                display: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
                sans: ['Outfit', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
            },
            letterSpacing: {
                tightest: '-0.03em',
            },
            boxShadow: {
                // Tinted shadows carrying the surface hue (not pure black).
                'soft': '0 1px 2px rgb(19 18 17 / 0.04), 0 2px 8px rgb(19 18 17 / 0.05)',
                'lift': '0 2px 4px rgb(19 18 17 / 0.05), 0 10px 24px -6px rgb(19 18 17 / 0.10)',
                'lift-dark': '0 2px 4px rgb(0 0 0 / 0.4), 0 12px 28px -6px rgb(0 0 0 / 0.5)',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            transitionTimingFunction: {
                // Spring-ish ease for interactive elements.
                'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            maxWidth: {
                prose: '65ch',
            },
        },
    },
};
