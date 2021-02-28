import BaseApi from "./BaseApi";

class UserApi extends BaseApi {

  getSmsWithCode (data) {
    return this.axios.post('user/send_sms', data);
  }

  authUser (data) {
    return this.axios.post('user/auth', data);
  }
}

export default new UserApi();
