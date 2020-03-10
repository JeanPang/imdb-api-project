import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import StoreUtil from '../utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    movies: StoreUtil.state(),
    genres: {
      data: [],
      options: [],
    },
    totalResults: null,
    totalPages: null,
  },
  mutations: {
    GET_MOVIE_LIST(state, payload) {
      state.movies = StoreUtil.updateState(state.movies, payload);
    },
    GET_GENRES(state, payload) {
      state.genres = payload;
    },
    TOTAL_RESULTS(state, payload) {
      state.totalResults = payload;
    },
    TOTAL_PAGES(state, payload) {
      state.totalPages = payload;
    },
  },
  actions: {
    getGenres(context) {
      context.commit('GET_GENRES');

      axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=0b6344d0554c5cd28c5ad8aedb0cded6&language=en-US')
        .then(
          (response) => {
            const { data } = response;

            const genres = {};
            genres.data = data.genres;
            genres.options = [];
            data.genres.map((item) => genres.options.push(item.name));
            context.commit('GET_GENRES', genres);
          },
        );
    },
    getMovies(context, onChange) {
      const base = ['https://api.themoviedb.org/3/discover/movie?api_key=0b6344d0554c5cd28c5ad8aedb0cded6'];

      const primaryReleaseYear = '&primary_release_year='.concat(onChange.yearValue);
      const sortBy = '&sort_by='.concat(onChange.sortByValue);
      const withGenres = '&with_genres='.concat(onChange.genresValue);
      const page = '&page='.concat(onChange.page);

      if (onChange.yearValue !== undefined) {
        base.push(primaryReleaseYear);
      }
      if (onChange.sortByValue !== undefined) {
        base.push(sortBy);
      }
      if (onChange.genresValue !== undefined) {
        base.push(withGenres);
      }
      if (onChange.page !== undefined) {
        base.push(page);
      }

      const api = base.join('');

      axios.get(api)
        .then(
          (response) => {
            const { data } = response;
            context.commit('TOTAL_PAGES', data.total_pages);
            context.commit('GET_MOVIE_LIST', data.results);
          },
        )
        .catch((e) => {
          context.commit('GET_MOVIE_LIST', e);
        });
    },
  },
});
