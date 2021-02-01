import BaseApi from "./BaseApi";

class DishApi extends BaseApi {
  search (data) {
    return this.axios.post('search', data).then(response => response.data);
  }
}

export default new DishApi();
