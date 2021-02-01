import BaseApi from "./BaseApi";

class RestaurantApi extends BaseApi {
  getRestaurants (params) {
    return this.axios.get('restaurants', { params }).then(response => response.data);
  }

  getRestaurantsByCategory (params, categoryId) {
    return this.axios.get(`restaurants/category/${categoryId}`, { params }).then(response => response.data);
  }

  getRestaurantInfo (id, params) {
    return this.axios.get(`restaurant/${id}`, { params }).then(response => response.data);
  }

  getRestaurantsBySpecialOffers (params) {
    return this.axios.get('restaurants/restaurants-special-offers/', { params }).then(response => response.data);
  }

  getRestaurantsBySpecialOffersAndCategory (params, categoryId) {
    return this.axios.get(`restaurants/restaurants-special-offers/category/${categoryId}`, { params }).then(response => response.data);
  }

  getSpecialOffers (params) {
    return this.axios.get('restaurants/special-offers/', { params }).then(response => response.data);
  }
}

export default new RestaurantApi();
