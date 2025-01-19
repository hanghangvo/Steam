const Base_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/"
let selectedGenre = ""
let selectedGame = ""
let page = 1;
let limit = 12

function onGameClick(gameName) {
    selectedGame = gameName;
    renderFeatures();
}

function onGenreClick(genreName) {
    selectedGenre = genreName;
    renderGames() // re-render game list
}

function onPageClick(selectedPage) {
    page = selectedPage;
    renderGames();
}

const prePage = () => {
    if (page <= 1) {
        return
    } page -= 1;
    renderGames();
}

const nextPage = () => {
    page += 1;
    renderGames();
}

document.querySelector(".btn-search")
        .addEventListener("click", () => {
            const value = document.querySelector(".input-search").value;
            renderGames(value);
        });



const getAllGames = async (search, genres) => {
    try {
        let url = `${Base_URL}games?page=${page}&limit=${limit}&`;
        if (search) {
            url += `q=${search}`;
        }
        if (genres) {
            url += `genres=${genres}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch(err) {
        console.log("error", err.message);
    }
};

const renderGames = async (search, genres) => {
    try {
        const data = await getAllGames(search, genres);
        const listCard = document.querySelector(".list-card");
        listCard.innerHTML = data.data
                            .filter((game) =>
                                game.genres.includes(selectedGenre) || !selectedGenre
                            )
                            .map((game) => {
                                return  `
                                <div class="card col-lg-3 col-md-5 col-12" onClick="onGameClick('${game.name}')">
                                    <img src="${game.header_image}" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title">${game.name}</h5>
                                    </div>
                                </div>
                            `
                            }).join("");
    } catch(error) {
        console.log("error", error);
    }
}
renderGames();

const getFeatures = async () => {
    try {
        const url = `${Base_URL}features`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch(error) {
        console.log("error", error.message);
    }
};

const renderFeatures = async () => {
    try {
            const data = await getFeatures();
            const listCard = document.querySelector(".list-card");
            const x = data.data.find((feature) => feature.name === selectedGame);
            listCard.innerHTML =
            `<div class="card" style="width: 18rem;">
                <img src="${x.header_image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h3 class="card-title">${x.name}</h3>
                    <h4>$${x.price}</h4>
                    <p class="card-text">${x.description}</p>
                    <ul class="list-details">
                        <li><strong>Positive Ratings:</strong> ${x.positive_ratings}</li>
                        <li><strong>Negative Ratings:</strong> ${x.negative_ratings}</li>
                        <li><strong>Developer:</strong> ${x.developer}</li>
                    </ul>
                </div>
            </div>`
    } catch(e) {
        console.log("error", e.message);
    }
    }

const getGenres = async () => {
    try {
        const url = `${Base_URL}genres?page=${page}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("error", e.message);
    }
};


const renderGenres = async () => {
    const data = await getGenres();
    const listGenres = document.querySelector(".side-nav");
    listGenres.innerHTML = data.data.map((genres) => {
        return `<li class="nav-item" onClick="onGenreClick('${genres.name}')">
                    <a class="nav-link side-nav-link" aria-current="page">${genres.name}</a>
                </li>`
    }).join("")
}
renderGenres();





