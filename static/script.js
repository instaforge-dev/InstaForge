// ==========================================
// InstaForge
// Instagram Username Generator
// ==========================================


// ===============================
// GET HTML ELEMENTS
// ===============================

const keywordInput =
    document.getElementById("keyword");

const styleSelect =
    document.getElementById("style");

const amountSelect =
    document.getElementById("amount");

const generateBtn =
    document.getElementById("generateBtn");

const resultsContainer =
    document.getElementById("results");

const resultCount =
    document.getElementById("resultCount");

const searchInput =
    document.getElementById("searchInput");

const themeBtn =
    document.getElementById("themeBtn");

const clearFavoritesBtn =
    document.getElementById("clearFavoritesBtn");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// ===============================
// FAVORITES
// ===============================

let favorites =
    JSON.parse(
        localStorage.getItem(
            "instaforgeFavorites"
        )
    ) || [];


// ===============================
// GENERATE USERNAMES
// ===============================

async function generateUsernames() {

    const keyword =
        keywordInput.value.trim();

    const style =
        styleSelect.value;

    const amount =
        amountSelect.value;


    // Check empty input

    if (!keyword) {

        showToast(
            "Please enter a name or keyword."
        );

        keywordInput.focus();

        return;
    }


    // Loading

    generateBtn.disabled = true;

    generateBtn.innerHTML = `
        <span class="loading-spinner"></span>
        Generating...
    `;


    try {

        const response =
            await fetch("/generate", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    keyword: keyword,

                    style: style,

                    amount: Number(amount)

                })

            });


        if (!response.ok) {

            throw new Error(
                "Server error"
            );

        }


        const data =
            await response.json();


        renderResults(
            data.usernames || []
        );


        showToast(
            "Usernames generated successfully!"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Something went wrong. Make sure app.py is running."
        );

    } finally {

        generateBtn.disabled = false;

        generateBtn.innerHTML = `
            <span>⚡</span>
            Generate Usernames
        `;

    }

}


// ===============================
// DISPLAY RESULTS
// ===============================

function renderResults(usernames) {

    resultsContainer.innerHTML = "";


    if (
        !usernames ||
        usernames.length === 0
    ) {

        resultsContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    😕
                </div>

                <h3>
                    No usernames found
                </h3>

                <p>
                    Try another name or style.
                </p>

            </div>

        `;


        resultCount.textContent =
            "0 usernames";

        return;
    }


    resultCount.textContent =
        `${usernames.length} username ideas`;


    usernames.forEach(
        username => {

            const card =
                createUsernameCard(
                    username
                );

            resultsContainer
                .appendChild(card);

        }
    );

}


// ===============================
// CREATE USERNAME CARD
// ===============================

function createUsernameCard(
    username
) {

    const card =
        document.createElement("div");


    card.className =
        "username-card";


    const isFavorite =
        favorites.includes(username);


    card.innerHTML = `

        <div class="username-info">

            <div class="username-name">

                @${escapeHTML(username)}

            </div>

            <div class="username-status">

                🟡 Needs manual check

            </div>

        </div>


        <div class="username-actions">


            <button
                class="card-btn check-btn"
                title="Open Instagram profile">

                🔎 Check

            </button>


            <button
                class="card-btn copy-btn"
                title="Copy username">

                📋 Copy

            </button>


            <button
                class="card-btn favorite-btn
                ${isFavorite ? "active" : ""}"
                title="Add to favorites">

                ${isFavorite ? "★" : "☆"}

            </button>


        </div>

    `;


    // ===========================
    // CHECK
    // ===========================

    const checkBtn =
        card.querySelector(
            ".check-btn"
        );


    checkBtn.addEventListener(
        "click",
        () => {

            const instagramURL =
                `https://www.instagram.com/${encodeURIComponent(username)}/`;


            window.open(
                instagramURL,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );


    // ===========================
    // COPY
    // ===========================

    const copyBtn =
        card.querySelector(
            ".copy-btn"
        );


    copyBtn.addEventListener(
        "click",
        async () => {

            try {

                await navigator
                    .clipboard
                    .writeText(username);


                showToast(
                    `@${username} copied!`
                );


            } catch {

                showToast(
                    "Could not copy username."
                );

            }

        }
    );


    // ===========================
    // FAVORITE
    // ===========================

    const favoriteBtn =
        card.querySelector(
            ".favorite-btn"
        );


    favoriteBtn.addEventListener(
        "click",
        () => {

            toggleFavorite(
                username,
                favoriteBtn
            );

        }
    );


    return card;
}


// ===============================
// FAVORITE SYSTEM
// ===============================

function toggleFavorite(
    username,
    button
) {

    const index =
        favorites.indexOf(username);


    // ADD

    if (index === -1) {

        favorites.push(username);

        button.textContent =
            "★";

        button.classList.add(
            "active"
        );

        showToast(
            "Added to favorites ⭐"
        );

    }


    // REMOVE

    else {

        favorites.splice(
            index,
            1
        );

        button.textContent =
            "☆";

        button.classList.remove(
            "active"
        );

        showToast(
            "Removed from favorites"
        );

    }


    localStorage.setItem(
        "instaforgeFavorites",
        JSON.stringify(favorites)
    );

}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    () => {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const cards =
            document.querySelectorAll(
                ".username-card"
            );


        let visible = 0;


        cards.forEach(
            card => {

                const username =
                    card.querySelector(
                        ".username-name"
                    )
                    .textContent
                    .toLowerCase();


                if (
                    username.includes(search)
                ) {

                    card.style.display =
                        "";

                    visible++;

                } else {

                    card.style.display =
                        "none";

                }

            }
        );


        if (
            search &&
            visible === 0
        ) {

            resultCount.textContent =
                "No matching usernames.";

        }

        else if (search) {

            resultCount.textContent =
                `${visible} matching usernames`;

        }

    }
);


// ===============================
// CLEAR FAVORITES
// ===============================

clearFavoritesBtn.addEventListener(
    "click",
    () => {

        if (
            favorites.length === 0
        ) {

            showToast(
                "You don't have any favorites."
            );

            return;
        }


        favorites = [];


        localStorage.setItem(
            "instaforgeFavorites",
            JSON.stringify(favorites)
        );


        document
            .querySelectorAll(
                ".favorite-btn"
            )
            .forEach(
                button => {

                    button.textContent =
                        "☆";

                    button.classList.remove(
                        "active"
                    );

                }
            );


        showToast(
            "Favorites cleared."
        );

    }
);


// ===============================
// DARK / LIGHT MODE
// ===============================

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "instaforgeTheme"
        );


    if (
        savedTheme === "light"
    ) {

        document.body
            .classList
            .add("light-mode");

        themeBtn.textContent =
            "☀️";

    }

    else {

        document.body
            .classList
            .remove("light-mode");

        themeBtn.textContent =
            "🌙";

    }

}


themeBtn.addEventListener(
    "click",
    () => {

        document.body
            .classList
            .toggle("light-mode");


        const isLight =
            document.body
                .classList
                .contains("light-mode");


        if (isLight) {

            themeBtn.textContent =
                "☀️";

            localStorage.setItem(
                "instaforgeTheme",
                "light"
            );

        }

        else {

            themeBtn.textContent =
                "🌙";

            localStorage.setItem(
                "instaforgeTheme",
                "dark"
            );

        }

    }
);


// ===============================
// TOAST
// ===============================

let toastTimeout;


function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


// ===============================
// ENTER KEY
// ===============================

keywordInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            generateUsernames();

        }

    }
);


// ===============================
// SECURITY
// ===============================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ===============================
// START
// ===============================

loadTheme();


// ===============================
// GENERATE BUTTON
// ===============================

generateBtn.addEventListener(
    "click",
    generateUsernames
);