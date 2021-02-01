import BaseApi from "./BaseApi";

class PageDataApi extends BaseApi {
  getPageData (params) {
    return this.axios.get('get-data-page', { params }).then(response => response.data);
  }
}

export default new PageDataApi();
