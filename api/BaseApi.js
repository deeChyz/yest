import axios from 'axios';

export default class BaseApi {
  constructor () {
    this.axios = axios.create({
      baseURL: process.env.API_URL + ':' + process.env.API_PORT,
      headers: {}
    });
  }
}
