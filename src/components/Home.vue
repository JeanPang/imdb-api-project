<template>
<v-app>
  <v-toolbar
    dark
    src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
  >
    <v-toolbar-title class="nav-title">
      <div>Discover Your Movies</div>
    </v-toolbar-title>
  </v-toolbar>
  <div class="wrapper">
    <div class="container">
      <div class="search-row">
        <div class="search-element">
          <multiselect
            v-model="yearValue"
            class="select-year"
            :options="optionsYear"
            placeholder="Year"
            @input="onChangeYear"
          />
        </div>
        <div class="search-element">
          <multiselect
            v-model="sortByValue"
            class="select-sort-by"
            :options="optionsSortBy"
            placeholder="Sort By"
            @input="onChangeSortBy"
          />
        </div>
        <div class="search-element">
          <multiselect
            v-model="genresValue"
            class="select-genres"
            :options="genres === undefined ? [] : genres.options"
            placeholder="Genres"
            @input="onChangeGenres"
          />
        </div>
      </div>

      <div v-if="movies !== []" class="results-row">
        <div
          v-for="(movie, index) in movies.data"
          :key="movie.id"
          class="poster-card"
        >
          <router-link :to="{ name: 'movies', params: {id: movie.id } }" class="routerlink">
            <div class="hover-style">
              <div
                v-if="movie.poster_path !== null"
                :class="(randomIndex.includes(index))
                ?'image-container-horizontal'
                :'image-container-vertical'"
              >
                <img
                  v-if="movie.poster_path !== null"
                  :src="(randomIndex.includes(index))
                  ? 'https://image.tmdb.org/t/p/w500_and_h282_face' + movie.poster_path
                  :'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + movie.poster_path"
                  alt="..."
                >
              </div>
            </div>
            <div
              v-if="movie.poster_path === null"
              :class="(randomIndex.includes(index))
              ?'no-image-holder-horizontal'
              :'no-image-holder-vertical'"
            >
            </div>
            <div :class="(randomIndex.includes(index))?'title-horizontal':'title-vertical'">
              {{ movie.title }}
            </div>
          </router-link>
        </div>
      </div>

      <v-pagination
        v-model="pagination.page"
        :page="pagination.page"
        :length="totalPages"
        :total-visible="pagination.totalVisible"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @input="onPageChange"
        class="pagination"
      ></v-pagination>
    </div>
  </div>
</v-app>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import { mapState } from 'vuex';
import store from '../../store';

Vue.component('multiselect', Multiselect);

const onChange = {};

let yearArr = Array(121).fill(1900).map((x, y) => x + y).reverse();
yearArr = ['None', ...yearArr];

const arr = Array(20).fill(0).map((x, y) => x + y);
const randomIndex = [];

const splitArray = [];
for (let i = 0, len = arr.length; i < len; i += 4) {
  splitArray.push(arr.slice(i, i + 4));
}

splitArray.map((row) => {
  const index = Math.floor((Math.random() * row.length));
  return randomIndex.push(row[index]);
});

export default {
  name: 'App',
  components: { Multiselect },
  computed: mapState([
    'movies',
    'genres',
    'totalPages',
  ]),
  data() {
    return {
      yearValue: null,
      sortByValue: null,
      genresValue: null,
      optionsYear: yearArr,
      optionsSortBy: ['Popularity Descending', 'Popularity Ascending', 'Rating Descending', 'Rating Ascending', 'Release Date Descending', 'Release Date Ascending'],
      randomIndex,
      pagination: {
        page: 1,
        totalVisible: 10,
      },
    };
  },
  mounted() {
    this.$store.dispatch('getMovies', onChange);
    this.$store.dispatch('getGenres');
  },
  methods: {
    onPageChange(value) {
      onChange.page = value;
      this.$store.dispatch('getMovies', onChange);
    },
    onChangeYear(value) {
      onChange.yearValue = value;
      this.$store.dispatch('getMovies', onChange);
    },
    onChangeSortBy(value) {
      let sortByValue;
      switch (value) {
        case 'Popularity Descending':
          sortByValue = 'popularity.desc';
          break;
        case 'Popularity Ascending':
          sortByValue = 'popularity.asc';
          break;
        case 'Rating Descending':
          sortByValue = 'vote_average.desc';
          break;
        case 'Rating Ascending':
          sortByValue = 'vote_average.asc';
          break;
        case 'Release Date Descending':
          sortByValue = 'release_date.desc';
          break;
        case 'Release Date Ascending':
          sortByValue = 'release_date.asc';
          break;
        default:
          break;
      }
      onChange.sortByValue = sortByValue;
      this.$store.dispatch('getMovies', onChange);
    },
    onChangeGenres(value) {
      const filteredData = store.state.genres.data.filter((item) => item.name.includes(value));
      onChange.genresValue = filteredData[0].id;
      this.$store.dispatch('getMovies', onChange);
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.v-pagination__item {
  outline: none !important;
}
/* .theme--light.v-pagination .v-pagination__item {
  background: #ffe3ed !important;
} */
</style>
<style>
  .multiselect {
    display: inline-block;
  }
  .multiselect__option--highlight,
  .multiselect__option--highlight:after,
  .multiselect__option--selected.multiselect__option--highlight {
    background: pink;
    content: '';
  }
  .multiselect__option--selected.multiselect__option--highlight:after,
  .multiselect__option--selected:after {
    content: '';
  }
  .multiselect__tags input {
    border: none !important;
    box-shadow: none !important;
  }
  .multiselect__placeholder {
    margin-bottom: 0px !important;
    padding-top: 0px !important;
  }
  .v-application ol, .v-application ul {
    padding-left: 0px;
  }
  .multiselect__element span {
    /* text-align: center; */
    padding-left: 10px;
    padding-right: 10px;
  }
  .multiselect__single {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
<style scoped>
  * {
    box-sizing: border-box;
    font-family: 'Source Sans Pro', Arial, sans-serif;
  }
  .wrapper {
    display: flex;
    justify-content: center;
  }
  .container {
    width: 1000px;
    padding: 40px 0px;
  }
  .nav-title {
    font-Weight: 600;
    font-size: 1.3em;
    width: 100%;
    display: flex;
    justify-content: center;
    font-family: Arial, sans-serif;
  }
  .search-row {
    padding: 10px 0px;
  }
  .search-element {
    padding-right: 30px;
    display: inline-block;
  }
  .select-year {
    width: 100px;
  }
  .select-sort-by {
    width: 260px;
  }
  .select-genres {
    width: 260px;
  }
  .results-row {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    padding: 20px 0px;
    margin-top: 30px;
  }
  .poster-card {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
  }
  .image-container-horizontal {
    display: flex;
    justify-content: center;
    width: 410px;
    height: 278px;
    overflow: hidden;
  }
  .image-container-vertical {
    height: 278px;
  }
  .poster-card:hover .image-container-horizontal, .poster-card:hover .image-container-vertical{
    background: #fff;
    opacity: 70%;
  }
  .poster-card:hover .title-horizontal, .poster-card:hover .title-vertical{
    font-weight: bold;
  }
  .title-horizontal {
    padding: 6px 4px;
    font-size: 0.9em;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 410px;
  }
  .title-vertical {
    padding: 6px 4px;
    font-size: 0.9em;
    word-wrap: break-word;
    width: 185px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  a {
    color: #000 !important;
    text-decoration: none !important;
  }
  .no-image-holder-horizontal {
    border: 1px solid #d7d7d7;
    width: 100%;
    background-color: #dbdbdb;
    display: flex;
    justify-content: center;
    width: 410px;
    height: 278px;
    overflow: hidden;
  }
  .no-image-holder-horizontal:before {
    font-family: 'Glyphicons Halflings';
    content:"\e060";
    font-size: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #b5b5b5;
  }
  .no-image-holder-vertical {
    border: 1px solid #d7d7d7;
    width: 100%;
    background-color: #dbdbdb;
    display: flex;
    justify-content: center;
    height: 278px;
    overflow: hidden;
  }
  .no-image-holder-vertical:before {
    font-family: 'Glyphicons Halflings';
    content:"\e060";
    font-size: 92px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #b5b5b5;
  }
  .pagination {
    padding: 10px 0px 40px 0px;
  }
</style>
