const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '236a52a7',
                // Movie title to search for (from: OMDb document, under the 'by search')
                s: searchTerm
            }
        });
        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
};

// Calling createAutoComplete function
// Left hand side
createAutoComplete({
    ...autoCompleteConfig,
    // ...: means make a copy of everything that object or take all the different functions inside there and throw them into this object and then add in this property as well
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        // hiding tutorial when clicked: is-hidden class is from the bulma css
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});
// Right hand side
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        // is-hidden class is from the bulma css
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;

// Helper function for selecting movie from the results
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '236a52a7',
            // parameter i for get the detailed information on a movie
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    };

    //If leftMovie and rightMovie are both defined then call runComparison()
    if (leftMovie && rightMovie) {
        runComparison();
    };
};


// Helper function
const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        //leftStat: represents an article element that is going to have that data set value that we really care about
        //index: index of that element inside of leftSideStats
        const rightStat = rightSideStats[index];
        
        // fetching the data from data-value property inside our article
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        //We need to parse the value into integer, because leftStat.dataset.value (also rightStat) will return the string value

        if (rightSideValue > leftSideValue) {
            //is-primary and is-warning classes are from bulma css
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        };
    });
};

// Helper function for rendering movie info on our application screen
const movieTemplate = (movieDetail) => {
    //Box Office: '$629,000,000' -> '629000000'
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    //Metascore
    const metascore = parseInt(movieDetail.Metascore);
    //IMDb rating
    const imdbRating = parseFloat(movieDetail.imdbRating);
    //IMDb votes
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    //Awards
    let count = 0; //going to track the number of award values
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDb Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDb Votes</p>
        </article>
    `;
};