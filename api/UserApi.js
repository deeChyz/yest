import BaseApi from "./BaseApi";

class UserApi extends BaseApi {
  constructor(props) {
    super(props);
    this.axios.defaults.baseURL += 'user/';
  }

  getSmsWithCode () {
    return this.axios.post('send_sms').then(response => response.data);
  }

  authUser () {
    return this.axios.post('auth').then(response => response.data);
  }
}

export default new UserApi();
