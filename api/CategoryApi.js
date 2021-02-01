import BaseApi from "./BaseApi";

class CategoryApi extends BaseApi {
  getCategories (params) {
    return this.axios.get('categories', { params }).then(response => response.data);
  }

  getCategoryInfo (params) {
    return this.axios.get('categories/info', { params }).then(response => response.data);
  }
}

export default new CategoryApi();
