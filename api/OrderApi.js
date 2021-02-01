import BaseApi from "./BaseApi";

class OrderApi extends BaseApi {
  create (data) {
    return this.axios.post('create/order/', data).then(response => response.data);
  }
}

export default new OrderApi();
