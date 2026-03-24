// Navbar Mobile Responsive (DOM Manipulation)
const navbar = document.getElementById("navbar");
const mobileMenu = document.getElementById("mobile-menu");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add("bg-white/15", "backdrop-blur-lg");
        } else {
            navbar.classList.remove("bg-white/15", "backdrop-blur-lg");
        }
    }

    window.addEventListener("scroll", handleScroll);
});

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("-translate-x-full");
    mobileMenu.classList.add("translate-x-0");
});

closeBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-0");
    mobileMenu.classList.add("-translate-x-full");
});


// Chatbot Section
const PROXY_ENDPOINT = '/api/chat';

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatWindow = document.getElementById('chat-window');

    if (!chatForm) return;

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = isUser
            ? "bg-[#010C13]/80 p-4 rounded-lg self-end text-white border-r-2 border-[#154D41] max-w-[80%]"
            : "bg-[#154D41]/10 p-4 rounded-lg self-start text-black border-l-2 border-[#154D41] max-w-[80%]";
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';

        try {
            const response = await fetch(PROXY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            // Handle n8n output structure
            const botResponse = data.output || data.response || "Synthesis complete, but no output generated.";
            addMessage(botResponse);

        } catch (error) {
            addMessage("The Advisory Core is temporarily unreachable. Please check server logs.");
        }
    });
});


// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('bg-[#010C13]');
    else nav.classList.remove('bg-[#010C13]');
});


// Articles Tableau Lazy Loading & Dynamic Embedding
(function () {
    let tableauScriptLoaded = false;

    /**
     * Load the Tableau Embedding API script dynamically
     */
    function loadTableauScript(callback) {
        if (tableauScriptLoaded) {
            if (callback) callback();
            return;
        }

        tableauScriptLoaded = true;

        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';

        script.onload = () => {
            console.log('Tableau script loaded successfully');
            if (callback) callback();
        };

        script.onerror = () => {
            console.error('Failed to load Tableau embedding script');
            tableauScriptLoaded = false;
        };

        document.body.appendChild(script);
    }

    /**
     * Parse & render visible Tableau visualizations
     */
    function parseTableauVizs() {
        // Move data-src to src so Tableau can embed
        document.querySelectorAll('tableau-viz.visible-for-tableau:not([src])').forEach(viz => {
            const dataSrc = viz.getAttribute('data-src');
            if (dataSrc) {
                viz.setAttribute('src', dataSrc);
            }
        });

        // Trigger Tableau parsing if library is ready
        if (window.tableau && window.tableau.Embedding) {
            window.tableau.Embedding.parse();
        } else {
            console.warn('Tableau Embedding API not ready');
        }
    }

    /**
     * Watch for tableau-viz elements entering viewport
     */
    function initTableauObserver() {
        const tableauVizs = document.querySelectorAll('tableau-viz[data-src]');

        if (!tableauVizs.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !entry.target.classList.contains('visible-for-tableau')) {
                            entry.target.classList.add('visible-for-tableau');

                            // Load Tableau script and parse
                            loadTableauScript(() => {
                                parseTableauVizs();
                            });

                            observer.unobserve(entry.target);
                        }
                    });
                },
                { rootMargin: '200px' }
            );

            tableauVizs.forEach(viz => {
                observer.observe(viz);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            tableauVizs.forEach(viz => {
                viz.classList.add('visible-for-tableau');
            });
            loadTableauScript(() => {
                parseTableauVizs();
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableauObserver);
    } else {
        initTableauObserver();
    }
})();