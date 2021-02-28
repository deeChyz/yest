import BaseApi from "./BaseApi";

class OrderApi extends BaseApi {
  create (data) {
    return this.axios.post('create/order/', data);
  }
}

export default new OrderApi();
