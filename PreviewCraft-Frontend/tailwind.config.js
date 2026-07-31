/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#0B0B0D",      
                surface: "#141417",   
                surface2: "#1C1C21",  
                line: "#27272C",     
                pink: {
                    DEFAULT: "#FF4D94",
                    dim: "#7A2C4C",
                },
                green: {
                    DEFAULT: "#35D48C",
                    dim: "#1F5C41",
                },
                ink2: "#F4F4F6",       
                muted: "#97979F",     
            },
            fontFamily: {
                display: ["Space Grotesk", "sans-serif"],
                body: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            backgroundImage: {
                "grid-fade":
                    "linear-gradient(180deg, rgba(255,77,148,0.06) 0%, rgba(11,11,13,0) 60%)",
            },
        },
    },
    plugins: [],
};