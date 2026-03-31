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
    // Generate or retrieve a unique session ID for this user's chat session
    let sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('chatSessionId', sessionId);
    }

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
                body: JSON.stringify({ message: text, sessionId: sessionId })
            });

            const data = await response.json();

            // Handle chatbot respond structure
            const botResponse = data.output || data.response || "Synthesis complete, but no output generated.";
            addMessage(botResponse);

        } catch (error) {
            addMessage("The NITE chatbot is temporarily unreachable. Please check server logs.");
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

// Insights Page Client-Side Fetch
document.addEventListener("DOMContentLoaded", () => {
    const articlesContainer = document.getElementById('articles-container');
    if (!articlesContainer) return;
    const paginationContainer = document.getElementById('pagination-container');
    const noArticlesMessage = document.getElementById('no-articles-message');
    const loadingSpinner = document.getElementById('loading-spinner');

    async function fetchInsights(page = 1) {
        loadingSpinner.classList.remove('hidden');
        articlesContainer.innerHTML = '';
        paginationContainer.innerHTML = '';
        noArticlesMessage.classList.add('hidden');

        try {
            const response = await fetch(`/api/insights?page=${page}&limit=9`);
            const json = await response.json();

            if (json.success) {
                renderArticles(json.data);
                renderPagination(json.pagination);
                if (json.data.length === 0) {
                    noArticlesMessage.classList.remove('hidden');
                }
            } else {
                console.error("Failed to fetch articles:", json.error);
                noArticlesMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error("Error calling API:", error);
            noArticlesMessage.classList.remove('hidden');
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    }

    function renderArticles(articles) {
        let html = '';
        articles.forEach(article => {
            const dateStr = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
            const excerpt = article.excerpt || (article.content ? article.content.substring(0, 150) : '');

            html += `
                    <a href="/insights/${article.slug}" class="group block">
                        <div class="bg-[#010C13] bg-opacity-5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-opacity-100 hover:scale-110 hover:border-[#8EF0DD] transition-all duration-300 h-full flex flex-col p-6 border border-white border-opacity-10">
                            <!-- Title -->
                            <h2 class="text-white text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#8EF0DD] transition-colors">
                                ${article.title}
                            </h2>

                            <!-- Category -->
                            <div class="mb-4">
                                <span class="inline-block bg-[#8EF0DD] text-[#154D41] text-xs font-semibold px-3 py-1 rounded-full">
                                    ${article.category || 'Article'}
                                </span>
                            </div>

                            <!-- Sinopsis -->
                            <p class="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                                ${excerpt}...
                            </p>

                            <!-- Meta Info -->
                            <div class="flex justify-between text-xs text-gray-400 pt-4 border-t border-white border-opacity-10">
                                <span>
                                    ${dateStr}
                                </span>
                                <span>
                                    ${article.views || 0} views
                                </span>
                            </div>
                        </div>
                    </a>
                    `;
        });
        articlesContainer.innerHTML = html;
    }

    function renderPagination(pagination) {
        if (pagination.pages <= 1) return;

        let html = '';
        for (let i = 1; i <= pagination.pages; i++) {
            if (i === pagination.page) {
                html += `
                        <button class="px-4 py-2 rounded-lg bg-[#8EF0DD] text-[#154D41] font-semibold">
                            ${i}
                        </button>
                        `;
            } else {
                html += `
                        <button onclick="window.fetchPage(${i})" class="px-4 py-2 rounded-lg bg-white bg-opacity-10 text-white hover:bg-opacity-20 transition-all">
                            ${i}
                        </button>
                        `;
            }
        }
        paginationContainer.innerHTML = html;
    }

    window.fetchPage = function (page) {
        window.history.pushState({ page }, "Page " + page, "?page=" + page);
        fetchInsights(page);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') ? parseInt(urlParams.get('page')) : 1;
    fetchInsights(initialPage);

    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            fetchInsights(e.state.page);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const page = urlParams.get('page') ? parseInt(urlParams.get('page')) : 1;
            fetchInsights(page);
        }
    });
});
