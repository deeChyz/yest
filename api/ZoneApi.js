import BaseApi from "./BaseApi";

class ZoneApi extends BaseApi {
  getZones () {
    return this.axios.get('get-zones').then(response => response.data);
  }
}

export default new ZoneApi();
