(() => {
    document.getElementById("search").addEventListener('input', (e) => {
        this.searchMovies(e.target.value)
    })
    fetchMovieList()
})();

function searchMovies(query){
    fetchMovieList(query)
}

function addToFavorites(movie) {
    const localData = localStorage.getItem("favorites");
    if(localData){
        localStorage.setItem("favorites", `${localData},${movie}`)
    }else{
        localStorage.setItem("favorites", movie)
    }
    fetchMovieList()
}

function removeFavorites(movie) {
    const localData = localStorage.getItem("favorites").split(",");
    const newLocalData = localData.filter(title => title !== movie)
    localStorage.setItem("favorites", newLocalData);
    fetchMovieList()
}


function fetchMovieList(query = ""){
    fetch("./data-movies.json")
        .then((response) => response.json())
        .then((data) => {
            const result = data.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()))
            renderMovieList(result)
        })
        .catch((error) => console.log(error));
}


function renderMovieList(movies) {
    const contentMovies = document.getElementById("movies-list");
    contentMovies.innerHTML = ""
    const localData = localStorage.getItem("favorites");
    let favorites = localData ? localData.split(",") : [];
    const movieCard = (movie) => `
        <div class="card">
            <div class="card-img">
                <img src="${movie.image}" alt="${movie.title}" width="100%" height="320px" onerror="this.onerror=null;this.src='./img-not-found.png'"/>
            </div>
            <div class="card-header">
                <h3 class="card-header-title">${movie.title}</h3>
                ${
                    !favorites.includes(movie.title)
                    ?
                        `<button id="${movie.title}" onclick="addToFavorites('${movie.title}')" class="card-header-btn">Add Favorite</button>`
                    :
                        `<button id="${movie.title}" onclick="removeFavorites('${movie.title}')" class="card-header-btn">Remove Favorite</button>`
                }
            </div>
            <div class="card-content">
                <div class="card-content-row">
                    <p class="card-content-label">
                        Genre:
                    </p>
                    <p class="card-content-value">
                        ${movie.genres.toString()}
                    </p>
                </div>
                <p class="card-content-label">
                    Description:
                </p>
                <p class="card-content-value">
                    ${movie.description}
                </p>
            </div>
        </div>
    `;

    movies.length > 0 ?
        movies.forEach((movie) => contentMovies.innerHTML+=movieCard(movie))
        : contentMovies.innerHTML = "<div class='not-results'><h2>Not results</h2></div>"
}
