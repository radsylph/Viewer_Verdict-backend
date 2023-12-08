import axios from "axios";

const AII = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Bearer ${process.env.API_MOVIE_TOKEN}`,
  },
});

const API = axios.create({
  baseURL: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

export { AII, API };
