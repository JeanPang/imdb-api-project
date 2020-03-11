<template>
  <div
    class="background"
    v-bind:style='{ backgroundImage: `url("${bgImgUrl}")` }'
  >
    <div
      class="wrapper"
      v-bind:style='{ background: rgba }'
    >
      <div class="top-container">
          <div v-if="movie.poster_path !== undefined">
            <img
              v-if="movie.poster_path !== null"
              :src="'https://image.tmdb.org/t/p/w300_and_h450_bestv2/' + movie.poster_path"
              class="poster"
            >
            <div
              v-else
              class="no-image-holder-poster"
            >
          </div>

          </div>
        <div class="info">
          <div class="movie-name">
            {{ movie.title }}
            <span v-if="isNaN(releaseYear) === false" class="release-year">&nbsp;({{ releaseYear }})</span>
          </div>
          <div class="user-score-wrapper">
            <div class="user-score">{{ movie.vote_average * 10}}</div>
            <div class="percent">&nbsp;%</div>
          </div>
          <div>
            <div class="title">Overview</div>
            <div class="content-text">
              {{
                movie.overview ? movie.overview
                :"We don't have an overview translated in English.Help us expand our database by adding one."
              }}
            </div>
          </div>
          <div>
            <div class="title">Featured Crew</div>
            <div class="profile-container">
              {{ featuredCrews.length === 0
                ? "We don't have any crew added to this movie. You can help by adding some!" : "" }}
              <div class="profile" v-for="featuredCrew in featuredCrews" :key="featuredCrew.id">
                <div class="crew-name">{{ featuredCrew.name }}</div>
                <div class="crew-character">{{ featuredCrew.jobTitle }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as Vibrant from 'node-vibrant';
import moment from 'moment';

export default {
  name: 'Movies',
  data() {
    return {
      movie: {},
      featuredCrews: [],
      releaseYear: '',
      bgImgUrl: null,
      rgba: null,
    };
  },
  mounted() {
    this.getMoviesDetail(this.$route.params.id);
    this.getCredits(this.$route.params.id);
  },
  methods: {
    getMoviesDetail(id) {
      const api = `https://api.themoviedb.org/3/movie/${id}?api_key=0b6344d0554c5cd28c5ad8aedb0cded6&language=en-US`;
      axios.get(api)
        .then(
          (response) => {
            const { data } = response;
            this.movie = data;

            if (data.backdrop_path !== null) {
              this.bgImgUrl = `https://image.tmdb.org/t/p/w1400_and_h450_face${this.movie.backdrop_path}`;
            }
            this.getColor();

            this.releaseYear = moment(data.release_date, 'YYYY-MM-DD').year();
          },
        );
    },

    getColor() {
      if (this.movie.poster_path !== null) {
        const img = `https://image.tmdb.org/t/p/w185_and_h278_bestv2${this.movie.poster_path}`;

        Vibrant.from(img).getPalette()
          .then((palette) => {
            const paletteChoose = palette.DarkMuted;
            this.rgba = `rgba(${paletteChoose.r}, ${paletteChoose.g}, ${paletteChoose.b}, 0.85)`;
          });
      } else {
        this.rgba = 'rgba(204, 204, 204, 0.6)';
      }
    },

    getCredits(id) {
      const api = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=0b6344d0554c5cd28c5ad8aedb0cded6&language=en-US`;
      axios.get(api)
        .then(
          (response) => {
            const { data } = response;

            const filteredJob = [];
            data.crew.filter((crew) => {
              switch (crew.job) {
                case 'Director':
                  return filteredJob.push(crew);
                case 'Screenplay':
                  return filteredJob.push(crew);
                case 'Story':
                  return filteredJob.push(crew);
                case 'Novel':
                  return filteredJob.push(crew);
                case 'Writer':
                  return filteredJob.push(crew);
                case 'Characters':
                  return filteredJob.push(crew);
                default:
                  return '';
              }
            });
            const featureCrewName = [];
            filteredJob.map((profile) => featureCrewName.push(profile.name));
            const featureCrewNameNoDuplicate = Array.from(new Set(featureCrewName));

            let filteredName;
            let i;
            const featuredCrew = [];
            for (i = 0; i < featureCrewNameNoDuplicate.length; i += 1) {
              const index = i;
              filteredName = data.crew.filter(
                (crew) => crew.name === featureCrewNameNoDuplicate[index],
              );
              const jobTitleArr = [];
              filteredName.map((name) => {
                switch (name.job) {
                  case 'Director':
                    return jobTitleArr.push(name.job);
                  case 'Screenplay':
                    return jobTitleArr.push(name.job);
                  case 'Story':
                    return jobTitleArr.push(name.job);
                  case 'Novel':
                    return jobTitleArr.push(name.job);
                  case 'Writer':
                    return jobTitleArr.push(name.job);
                  case 'Characters':
                    return jobTitleArr.push(name.job);
                  default:
                    return '';
                }
              });
              const jobTitle = jobTitleArr.join(', ');
              featuredCrew.push({
                id: i + 1,
                name: filteredName[0].name,
                jobTitle,
              });
            }

            if (featuredCrew.length > 9) {
              featuredCrew.length = 9;
            }
            this.featuredCrews = featuredCrew;
          },
        );
    },
  },
};
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }
  .background {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 850px;
  }
  .wrapper {
    display: flex;
    justify-content: center;
    color: #fff;
    font-family: 'Source Sans Pro', Arial, sans-serif;
    height: 100%;
  }
  .top-container {
    max-width: 1000px;
    display: flex;
    margin: 40px 0px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    overflow: hidden;
    padding: 0px 0px;
    height: 480px;
    margin-top: 100px;
    align-items: center;
  }
  @media (max-width: 1080px) {
    .top-container {
      margin-left: 30px;
    }
  }
  .poster {
    height: 480px;
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
    width: 320px;
  }
  .no-image-holder-poster {
    height: 480px;
    width: 300px;
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
  }
  .no-image-holder-poster:before {
    font-family: 'Glyphicons Halflings';
    content:"\e060";
    font-size: 92px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #b5b5b5;
    height: 480px;
  }
  .info {
    padding: 25px 40px;
    width: 700px;
    height: 450px;
    position: relative;
    line-height: 1.4em;
  }
  .movie-name {
    font-Weight: 700;
    width: 540px;
    color: #fff;
    border-bottom: solid 1px #fff;
    padding-bottom: 20px;
    font-size: 1.8em;
    line-height: 1.2em;
  }
  .release-year {
    opacity: 0.6;
    font-size: 0.6em;
    font-Weight: 500;
  }
  .user-score-wrapper {
    position: absolute;
    right: 20px;
    top: 20px;
    font-family: 'Odin Bold';
    background: rgba(256,256,256,0.1);
    border-radius: 100px;
    width: 80px;
    height: 80px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .user-score {
    font-size: 38px;
    padding: 30px 3px;
  }
  .percent {
    font-size: 16px;
    margin-top: 25px;
  }
  .title {
    color: #fff;
    font-size: 1.2em;
    font-weight: 600;
    padding: 10px 0px;
    margin-top: 12px;
  }
  .content-text {
    font-size: 1em;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
    letter-spacing: 0.2px;
  }
  .crew-name {
    font-weight: 800;
    font-size: 1.05em;
  }
  .crew-character {
    font-size: 1em;
  }
  .profile-container {
    font-size: 0.95em;
    display: flex;
    flex-wrap: wrap;
  }
  .profile {
    width: 33%;
    margin-bottom: 10px;
  }
</style>
