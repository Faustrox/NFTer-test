const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Lato", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                "meta-blue": {
                    50: "#f2f5fc",
                    100: "#e2e8f7",
                    200: "#cbd6f2",
                    300: "#a8bce8",
                    400: "#7e9adc",
                    500: "#5f7ad2",
                    600: "#4a5ec4",
                    700: "#414eb4",
                    800: "#3a4293",
                    900: "#333a75",
                },
                "meta-black": {
                    50: "#fcfdfd",
                    100: "#f7fafb",
                    200: "#eef3f5",
                    300: "#dbdee5",
                    400: "#c4c8cf",
                    500: "#a5adb9",
                    600: "#7e8a9c",
                    700: "#637282",
                    800: "#3c4249",
                    900: "#212225",
                },
            },
        },
        screens: {
            xs: "320px",
            sm: "640px",
            md: "768px",
            lg: "960px",
            xl: "1024px",
            "2xl": "1280px",
        },
    },

    plugins: [require("@tailwindcss/forms")],
};
