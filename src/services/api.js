// src/services/api.js

export async function fetchPopularMovies(page = 1) {
  return [
    {
    id: 1,
    title: 'Inception',
    poster: 'https://c8.alamy.com/comp/2JKYCTN/movie-poster-inception-2010-2JKYCTN.jpg'
    },
    {
        id: 2,
        title: 'Interstellar',
        poster: 'https://www.themoviedb.org/t/p/original/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg',
    },
    {
        id: 3,
        title: 'The Dark Knight',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    },
    {
        id: 4,
        title: 'Tenet',
        poster: 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg',
    },
    {
        id: 5,
        title: 'Dunkirk',
        poster: 'https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg',
    },
    {
        id: 6,
        title: 'Oppenheimer',
        poster: 'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg',
    },
    {
      id: 7,
      title: 'The Prestige',
      poster: 'https://posterspy.com/wp-content/uploads/2018/08/the_prestige_alternative_movie_poster_01.jpg',
    },
    {
      id: 8,
      title: 'Memento',
      poster: 'https://www.themoviedb.org/t/p/original/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg',
    },
  ];
}
