const axios = require('axios');
const { title } = require('process');

let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://cms-assets.webediamovies.pro/prod/flix-brewhouse/663a25e5a500bb1cd5d8b0d4/public/page-data/sq/d/517488378.json',
    headers: {}
};

axios.request(config)
    .then((response) => {
        // console.log(JSON.stringify(response.data));
        let movies = response.data.data.allMovie.nodes

        let convertedMovies = []

        for (let movie of movies) {
            convertedMovies.push({
                id: movie.id,
                showtimesPath: movie.path,
                title: movie.title,
                certificate: movie.certificate,
                poster: movie.poster,
            })
        }

        // console.log(movies[0].theaters);
        // console.log(movies.length);

        let containerStyles = 'div style=" font-family: Neutra2, sans-serif; border: solid 1px black; border-radius: 5px; height: 14em; padding: 1em; background: #354048; display: flex"'
        let certStyles = `div style="border-radius: 10px; border: solid 2px #E2E2E2; padding: 5px; color: #E2E2E2; margin: 1em 0"`
        let showtimeStyles = `div style="border-radius: 10px; background: #e1aa21; padding: 5px"`
        let html = convertedMovies.map(movie => `<${containerStyles}>
        <img style="max-width: 100%; max-height: 100%; margin-right: 10px; border-radius: 4px" src="https://all.web.img.acsta.net/${movie.poster}" />
        <div style="display: flex; flex-direction: column; height: 100%; align-items: start">
            <div style="color: #E2E2E2; font-size: 1.4em; font-weight: 700">${movie.title}</div>
            <${certStyles}>${movie.certificate ? movie.certificate : 'Not Rated'}</div>
            <${showtimeStyles}><a style="text-decoration: none; color: black; font-size: 1.25em" href="https://flixbrewhouse.com${movie.showtimesPath}">Showtimes</a></div>
        </div>
        </div>`)

        console.log(html.join(''));
    })
    .catch((error) => {
        console.log(error);
    });
