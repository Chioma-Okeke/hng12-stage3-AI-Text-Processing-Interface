export function applyTheme(theme) {
    const root = document.documentElement;

    const themes = {
        light: {
            "--bg-color": "#ffffff",
            "--text-color": "#333",
            "--chat-bubble": "209, 232, 255",
            "--sidebar-bg-color": "#FFFFFF",
            "--sidebar-border-color": "#E0E0E0",
        },
        dark: {
            "--bg-color": "#121212",
            "--text-color": "#E5E7EB",
            "--chat-bubble": "55, 65, 81",
            "--sidebar-bg-color": "#1E1E1E",
            "--sidebar-border-color": "#333333",
        },
        cyberpunk: {
            "--bg-color": "#0D0D0D",
            "--text-color": "#FF00FF",
            "--chat-bubble": "0, 255, 255",
            "--sidebar-bg-color": "#111111",
            "--sidebar-border-color": "#FF00FF",
        },
        softPastel: {
            "--bg-color": "#FAF3E0",
            "--text-color": "#5C4033",
            "--chat-bubble": "255, 209, 220",
            "--sidebar-bg-color": "#FFD1DC",
            "--sidebar-border-color": "#F5CBA7",
        },
        sunsetGlow: {
            "--bg-color": "#FFEDD5",
            "--text-color": "#6B3E26",
            "--chat-bubble": "255, 160, 122",
            "--sidebar-bg-color": "#F4A261",
            "--sidebar-border-color": "#E76F51",
        },
        neuralNexus: {
            "--bg-color": "#0A0F1D",
            "--text-color": "#C3E8FF",
            "--chat-bubble": "26, 43, 76",
            "--sidebar-bg-color": "#0D1B2A",
            "--sidebar-border-color": "#5EEAD4",
        },
    };

    const selectedTheme = themes[theme] || themes.light;

    Object.keys(selectedTheme).forEach((key) => {
        root.style.setProperty(key, selectedTheme[key]);
    });

    localStorage.setItem("selectedTheme", theme);
}
