// The 15 app themes: a palette each, plus fonts, corner radius and accent remaps.
// Generated from ezinputs (github.com/JamesMDominguez/chabotform) on 2026-11-12:
// the resolved MUI palettes, fonts and radii of its app themes, and its form
// themes' token bags. Edit here from now on; ezinputs re-exports this.

import type { AppTheme } from '../types.js';

export const APP_THEMES: AppTheme[] = [
    {
        "id": "light",
        "name": "Light",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#2563eb",
                "contrastText": "#fff",
                "ink": "#2057ce"
            },
            "secondary": {
                "main": "#FF746C",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "error": {
                "main": "#d32f2f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ed6c02",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2e7d32",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#0288d1",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#f8fafc",
                "paper": "#ffffff"
            },
            "text": {
                "primary": "#0f172a",
                "secondary": "#4b5563"
            },
            "divider": "rgba(0, 0, 0, 0.12)"
        },
        "font": {
            "body": "'Inter', sans-serif",
            "heading": "'Inter', sans-serif"
        },
        "radius": 4,
        "nextFont": {
            "body": "--font-inter",
            "heading": "--font-inter"
        }
    },
    {
        "id": "dark",
        "name": "Dark",
        "group": "app",
        "mode": "dark",
        "palette": {
            "mode": "dark",
            "primary": {
                "main": "#60a5fa",
                "contrastText": "rgba(0, 0, 0, 0.87)",
                "ink": "#60a5fa"
            },
            "secondary": {
                "main": "#FF746C",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "error": {
                "main": "#f44336",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ffa726",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "success": {
                "main": "#66bb6a",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "info": {
                "main": "#29b6f6",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "background": {
                "default": "#0b1220",
                "paper": "#0f172a"
            },
            "text": {
                "primary": "#e5e7eb",
                "secondary": "#9ca3af"
            },
            "divider": "rgba(255, 255, 255, 0.12)"
        },
        "font": {
            "body": "'Inter', sans-serif",
            "heading": "'Inter', sans-serif"
        },
        "radius": 4,
        "nextFont": {
            "body": "--font-inter",
            "heading": "--font-inter"
        }
    },
    {
        "id": "retro",
        "name": "Retro",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#1f2a24",
                "contrastText": "#fff",
                "ink": "#1f2a24"
            },
            "secondary": {
                "main": "#f2be3b",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "error": {
                "main": "#d32f2f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ed6c02",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2e7d32",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#0288d1",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#e6ca92",
                "paper": "#f7f2e6"
            },
            "text": {
                "primary": "#1f1f1f",
                "secondary": "#4a4a46"
            },
            "divider": "#2a2a2a"
        },
        "font": {
            "body": "'Trebuchet MS', 'Avenir Next', 'Segoe UI', sans-serif",
            "heading": "'Georgia', 'Times New Roman', serif"
        },
        "radius": 14,
        "accents": {
            "green": "#93a06b",
            "jade": "#5f8c3a",
            "teal": "#3d7a6e",
            "blue": "#2e6b74",
            "violet": "#7a6285",
            "pink": "#b06a72",
            "red": "#a83f2a",
            "orange": "#c1592e",
            "amber": "#e0a72c",
            "neutral": "#8a8178"
        }
    },
    {
        "id": "retro-game",
        "name": "Retro Game",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#d72d2d",
                "contrastText": "#fff",
                "ink": "#a62222"
            },
            "secondary": {
                "main": "#2b2b28",
                "contrastText": "#fff"
            },
            "error": {
                "main": "#d32f2f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ed6c02",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2e7d32",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#0288d1",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#ecebe6",
                "paper": "#f6f5f1"
            },
            "text": {
                "primary": "#171715",
                "secondary": "#4a4a45"
            },
            "divider": "#2b2b28"
        },
        "font": {
            "body": "'Pixelify Sans', 'VT323', monospace",
            "heading": "'Press Start 2P', 'VT323', monospace"
        },
        "radius": 2,
        "aliases": [
            "retro-nintendo"
        ],
        "nextFont": {
            "body": "--font-pixelify",
            "heading": "--font-press-start"
        },
        "accents": {
            "green": "#7a8a4a",
            "jade": "#2f8f4f",
            "teal": "#2f7a78",
            "blue": "#3f5a9a",
            "violet": "#6a4a8a",
            "pink": "#b04a6a",
            "red": "#d72d2d",
            "orange": "#c8602a",
            "amber": "#c8961e",
            "neutral": "#6b6a64"
        }
    },
    {
        "id": "neo-brutalism",
        "name": "Neo-Brutalism",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#111111",
                "contrastText": "#fff",
                "ink": "#111111"
            },
            "secondary": {
                "main": "#00e5ff",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "error": {
                "main": "#d32f2f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ed6c02",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2e7d32",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#0288d1",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#ffe66d",
                "paper": "#ffffff"
            },
            "text": {
                "primary": "#111111",
                "secondary": "#2c2c2c"
            },
            "divider": "#111111"
        },
        "font": {
            "body": "'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif",
            "heading": "'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif"
        },
        "radius": 10
    },
    {
        "id": "neo-brutalism-pop",
        "name": "Neo-Brutalism Pop",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#111111",
                "contrastText": "#fff",
                "ink": "#111111"
            },
            "secondary": {
                "main": "#00c2ff",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "error": {
                "main": "#d32f2f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ed6c02",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2e7d32",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#0288d1",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#ff9de1",
                "paper": "#ffffff"
            },
            "text": {
                "primary": "#111111",
                "secondary": "#252525"
            },
            "divider": "#111111"
        },
        "font": {
            "body": "'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif",
            "heading": "'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif"
        },
        "radius": 10
    },
    {
        "id": "retro-tech-90s",
        "name": "90s Retro-Tech",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#000080",
                "contrastText": "#fff",
                "ink": "#000080"
            },
            "secondary": {
                "main": "#008080",
                "contrastText": "#fff"
            },
            "error": {
                "main": "#d32f2f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ed6c02",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2e7d32",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#0288d1",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#c0c0c0",
                "paper": "#fefefe"
            },
            "text": {
                "primary": "#000000",
                "secondary": "#3c3c3c"
            },
            "divider": "#808080"
        },
        "font": {
            "body": "Tahoma, Verdana, Geneva, 'Segoe UI', sans-serif",
            "heading": "Tahoma, Verdana, Geneva, 'Segoe UI', sans-serif"
        },
        "radius": 2
    },
    {
        "id": "synthwave-noir",
        "name": "Synthwave Noir",
        "group": "app",
        "mode": "dark",
        "palette": {
            "mode": "dark",
            "primary": {
                "main": "#00e5ff",
                "contrastText": "rgba(0, 0, 0, 0.87)",
                "ink": "#00e5ff"
            },
            "secondary": {
                "main": "#ff2ed1",
                "contrastText": "#fff"
            },
            "error": {
                "main": "#f44336",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ffa726",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "success": {
                "main": "#66bb6a",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "info": {
                "main": "#29b6f6",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "background": {
                "default": "#090614",
                "paper": "#130a26"
            },
            "text": {
                "primary": "#f5edff",
                "secondary": "#b8a7d9"
            },
            "divider": "#40246b"
        },
        "font": {
            "body": "'Orbitron', 'Space Grotesk', 'Segoe UI', sans-serif",
            "heading": "'Orbitron', 'Space Grotesk', 'Segoe UI', sans-serif"
        },
        "radius": 8,
        "nextFont": {
            "body": "--font-orbitron",
            "heading": "--font-orbitron"
        }
    },
    {
        "id": "cyberpunk-rain",
        "name": "Cyberpunk Rain",
        "group": "app",
        "mode": "dark",
        "palette": {
            "mode": "dark",
            "primary": {
                "main": "#00d9ff",
                "contrastText": "rgba(0, 0, 0, 0.87)",
                "ink": "#00d9ff"
            },
            "secondary": {
                "main": "#ff4ddd",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "error": {
                "main": "#f44336",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ffa726",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "success": {
                "main": "#66bb6a",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "info": {
                "main": "#29b6f6",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "background": {
                "default": "#070a14",
                "paper": "#0d1224"
            },
            "text": {
                "primary": "#e4f2ff",
                "secondary": "#8ea6d6"
            },
            "divider": "#2b3e72"
        },
        "font": {
            "body": "'Space Grotesk', 'Orbitron', 'Segoe UI', sans-serif",
            "heading": "'Space Grotesk', 'Orbitron', 'Segoe UI', sans-serif"
        },
        "radius": 8,
        "nextFont": {
            "body": "--font-space-grotesk",
            "heading": "--font-space-grotesk"
        }
    },
    {
        "id": "file-cabinet",
        "name": "File Cabinet",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#6b4423",
                "contrastText": "#fff",
                "ink": "#52331a"
            },
            "secondary": {
                "main": "#b3261e",
                "contrastText": "#fff"
            },
            "error": {
                "main": "#d32f2f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ed6c02",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2e7d32",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#0288d1",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#d2b585",
                "paper": "#fbf8ef"
            },
            "text": {
                "primary": "#2b2620",
                "secondary": "#5b5040"
            },
            "divider": "#c4ad7e"
        },
        "font": {
            "body": "'Nunito Sans', 'Helvetica Neue', Arial, sans-serif",
            "heading": "'Special Elite', 'Courier New', monospace"
        },
        "radius": 4,
        "nextFont": {
            "body": "--font-nunito-sans",
            "heading": "--font-special-elite"
        },
        "accents": {
            "green": "#4f5d24",
            "jade": "#2f6b3f",
            "teal": "#2f6466",
            "blue": "#2b4c7e",
            "violet": "#5a3f73",
            "pink": "#8a3b5c",
            "red": "#a3261d",
            "orange": "#9a4a14",
            "amber": "#7a560c",
            "neutral": "#5b5040"
        }
    },
    {
        "id": "blueprint",
        "name": "Blueprint",
        "group": "app",
        "mode": "dark",
        "palette": {
            "mode": "dark",
            "primary": {
                "main": "#ffcf5c",
                "contrastText": "rgba(0, 0, 0, 0.87)",
                "ink": "#fff3e1"
            },
            "secondary": {
                "main": "#ff7a6b",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "error": {
                "main": "#f44336",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ffa726",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "success": {
                "main": "#66bb6a",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "info": {
                "main": "#29b6f6",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "background": {
                "default": "#173f70",
                "paper": "#225a99"
            },
            "text": {
                "primary": "#f2f7ff",
                "secondary": "#e9f1fa"
            },
            "divider": "rgba(255, 255, 255, 0.35)"
        },
        "font": {
            "body": "'Space Grotesk', 'Segoe UI', sans-serif",
            "heading": "'Barlow Condensed', 'Arial Narrow', sans-serif"
        },
        "radius": 2,
        "nextFont": {
            "body": "--font-space-grotesk",
            "heading": "--font-barlow-condensed"
        },
        "accents": {
            "green": "#d3ecbd",
            "jade": "#a8f0c6",
            "teal": "#a8ecec",
            "blue": "#c6e2ff",
            "violet": "#e6dcff",
            "pink": "#ffd3e6",
            "red": "#ffd0c8",
            "orange": "#ffdcbc",
            "amber": "#ffe09a",
            "neutral": "#e3ebf5"
        }
    },
    {
        "id": "corkboard",
        "name": "Corkboard",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#b3261e",
                "contrastText": "#fff",
                "ink": "#5d130e"
            },
            "secondary": {
                "main": "#2c5d9e",
                "contrastText": "#fff"
            },
            "error": {
                "main": "#d32f2f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#ed6c02",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2e7d32",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#0288d1",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#c49a6c",
                "paper": "#fffdf7"
            },
            "text": {
                "primary": "#2a2520",
                "secondary": "#5d554b"
            },
            "divider": "#e2d8c6"
        },
        "font": {
            "body": "'Nunito Sans', 'Helvetica Neue', Arial, sans-serif",
            "heading": "'Patrick Hand', 'Comic Neue', sans-serif"
        },
        "radius": 4,
        "nextFont": {
            "body": "--font-nunito-sans",
            "heading": "--font-patrick-hand"
        },
        "accents": {
            "green": "#4a6b2a",
            "jade": "#1f7a4d",
            "teal": "#1f6f73",
            "blue": "#2c5d9e",
            "violet": "#6a3f8f",
            "pink": "#a8326a",
            "red": "#b3261e",
            "orange": "#b4500f",
            "amber": "#8a6100",
            "neutral": "#6b5f50"
        }
    },
    {
        "id": "green-earthy",
        "name": "Green Earthy",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#8b5c22",
                "contrastText": "#fff",
                "ink": "#482e10"
            },
            "secondary": {
                "main": "#a2ad39",
                "contrastText": "rgba(0, 0, 0, 0.87)"
            },
            "error": {
                "main": "#8a2f1f",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#7f5b1e",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#606622",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#4e666f",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#9fb04f",
                "paper": "#f6f3e6"
            },
            "text": {
                "primary": "#2f1e0e",
                "secondary": "#413120"
            },
            "divider": "rgba(47, 30, 14, 0.28)"
        },
        "font": {
            "body": "'Nunito Sans', 'Segoe UI', sans-serif",
            "heading": "'Merriweather', 'Georgia', serif"
        },
        "radius": 8,
        "nextFont": {
            "body": "--font-nunito-sans"
        },
        "accents": {
            "green": "#4c7849",
            "jade": "#6c7326",
            "teal": "#487767",
            "blue": "#55707a",
            "violet": "#6b5566",
            "pink": "#9e596a",
            "red": "#8a2f1f",
            "orange": "#a5522a",
            "amber": "#906721",
            "neutral": "#6f6a5e"
        }
    },
    {
        "id": "blue-earthy",
        "name": "Blue Earthy",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#2f6ba8",
                "contrastText": "#fff",
                "ink": "#173757"
            },
            "secondary": {
                "main": "#a1552f",
                "contrastText": "#fff"
            },
            "error": {
                "main": "#9c3a2a",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#825a22",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#0b6d5e",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#2c659e",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#8fb0d2",
                "paper": "#eef2f8"
            },
            "text": {
                "primary": "#16283d",
                "secondary": "#293a58"
            },
            "divider": "rgba(22, 40, 61, 0.24)"
        },
        "font": {
            "body": "'Nunito Sans', 'Segoe UI', sans-serif",
            "heading": "'Merriweather', 'Georgia', serif"
        },
        "radius": 8,
        "nextFont": {
            "body": "--font-nunito-sans"
        },
        "accents": {
            "green": "#50756b",
            "jade": "#0c7b6a",
            "teal": "#1d7691",
            "blue": "#2f6ba8",
            "violet": "#6a5f9c",
            "pink": "#a0526e",
            "red": "#9c3a2a",
            "orange": "#a1552f",
            "amber": "#906426",
            "neutral": "#5d6b7d"
        }
    },
    {
        "id": "lavender-earthy",
        "name": "Lavender Earthy",
        "group": "app",
        "mode": "light",
        "palette": {
            "mode": "light",
            "primary": {
                "main": "#6d54a8",
                "contrastText": "#fff",
                "ink": "#382b57"
            },
            "secondary": {
                "main": "#a1607f",
                "contrastText": "#fff"
            },
            "error": {
                "main": "#9c3a4a",
                "contrastText": "#fff"
            },
            "warning": {
                "main": "#785e28",
                "contrastText": "#fff"
            },
            "success": {
                "main": "#2c6d4d",
                "contrastText": "#fff"
            },
            "info": {
                "main": "#4c609f",
                "contrastText": "#fff"
            },
            "background": {
                "default": "#b0a0d8",
                "paper": "#f4f1fa"
            },
            "text": {
                "primary": "#2b2340",
                "secondary": "#3d3352"
            },
            "divider": "rgba(43, 35, 64, 0.24)"
        },
        "font": {
            "body": "'Nunito Sans', 'Segoe UI', sans-serif",
            "heading": "'Merriweather', 'Georgia', serif"
        },
        "radius": 8,
        "nextFont": {
            "body": "--font-nunito-sans"
        },
        "accents": {
            "green": "#62735d",
            "jade": "#327b57",
            "teal": "#34777d",
            "blue": "#556aae",
            "violet": "#7a5fb0",
            "pink": "#985a77",
            "red": "#9c3a4a",
            "orange": "#986043",
            "amber": "#86692c",
            "neutral": "#6b6376"
        }
    }
];
