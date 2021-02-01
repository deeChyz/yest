import {
  CATEGORY_INFO_DEFAULT_BACKGROUND_URL,
  CATEGORY_INFO_DEFAULT_ICON_URL,
  SORT_BY_COORDINATES_DEFAULT_LIMIT, SORT_BY_COORDINATES_DEFAULT_START, SORT_BY_COORDINATES_TEN_THOUSAND_LIMIT
} from "../confs/pages/restaurants";
import RestaurantApi from "../../api/RestaurantApi";
import CookieHelper from "./CookieHelper";

class RestaurantsHelper {
  createCategoryInfoObject (currentZone) {
    return currentZone ? {
      header: 'Быстрая доставка',
      city: currentZone.accusative,
      background: CATEGORY_INFO_DEFAULT_BACKGROUND_URL,
      category_icon: CATEGORY_INFO_DEFAULT_ICON_URL,
      meta: {
        title: currentZone.seo.title,
        description: currentZone.seo.description,
        keywords: currentZone.seo.keywords,
      }
    } : null;
  }

  calcWorkTime (restaurants, onlyOpen = false) {
    const utcDateTime = new Date(), [openRestaurants, closeRestaurants, currentDay, currentTime] = [
      [],
      [],
      utcDateTime.getDay(),
      ((utcDateTime.getHours() * 3600) + (utcDateTime.getMinutes() * 60) + (utcDateTime.getSeconds()))*100
    ];
    let todayOT = [];

    restaurants.forEach((item, i, arr) => {
      todayOT = [];
      item.is_open = false;
      item.operation_time.forEach((time, i_time, arr_time) => {
        if(time.day === currentDay){
          let time_open = (time.open_time).split(':');
          let close_time = (time.close_time).split(':');

          todayOT.push({
            time_open: (time_open[0]*3600) + (time_open[1]*60) + time_open[2],
            close_time: (close_time[0]*3600) + (close_time[1]*60) + close_time[2],
          });
        }
      });

      todayOT.forEach((time, i, arr) => {
        if(!item.is_open && Number(time.time_open) <= currentTime && Number(time.close_time) > currentTime){
          item.is_open = true;
        }
      });

      switch(item.is_open){
        case true:
          openRestaurants.push(item);
          break;
        case false:
          closeRestaurants.push(item);
          break;
      }
    });
    return onlyOpen ? openRestaurants : openRestaurants.concat(closeRestaurants);
  }

  async getLatAndLonFromRequestHeaders (request) {
    // Calculate and set lat and lon
    let latitude, longitude;
    if (process.server && request && request.headers && request.headers.cookie) {
      const latAndLonAreValid = request.headers.cookie.indexOf('latitude') > 0 && request.headers.cookie.indexOf('longitude') > 0;
      [latitude, longitude] = [
        latAndLonAreValid ? await CookieHelper.getCookieFromString('latitude', request.headers.cookie) : null,
        latAndLonAreValid ? await CookieHelper.getCookieFromString('longitude', request.headers.cookie) : null
      ]
    }
    return { latitude, longitude };
  }

  async getRestaurants (
    currentCategory,
    currentZone,
    request = null,
    coordinatesObject = { latitude: null, longitude: null },
    withBigLimit = false
  ) {

    // Get latitude and longitude
    const coordinatesObj = coordinatesObject  ? coordinatesObject : { latitude: null, longitude: null };
    let { latitude, longitude } = request ?
      await this.getLatAndLonFromRequestHeaders(request) : coordinatesObj;

    // Set category and zone ids
    const [
      currentCategoryId,
      currentZoneId
    ] = [
      currentCategory ? currentCategory.id : 0,
      currentZone ? currentZone.id : 0
    ];

    // Create object for sorting
    const sortingParamsObject = latitude && longitude ?
      {
        zone_id: currentZoneId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        start: SORT_BY_COORDINATES_DEFAULT_START,
        limit: SORT_BY_COORDINATES_DEFAULT_LIMIT
      } :
      {
        zone_id: currentZoneId,
        start: SORT_BY_COORDINATES_DEFAULT_START,
        limit: withBigLimit ? SORT_BY_COORDINATES_TEN_THOUSAND_LIMIT : SORT_BY_COORDINATES_DEFAULT_LIMIT,
      };


    const { restaurants } = currentCategoryId ?
      await RestaurantApi.getRestaurantsByCategory(sortingParamsObject, currentCategoryId) :
      await RestaurantApi.getRestaurants(sortingParamsObject);


    // Filter restaurants by open/close time
    const timeFilteredRestaurantsList = restaurants && restaurants.length ?
      this.calcWorkTime(restaurants) : [];


    // Getting special offers
    let specialOffers, showSpecialOffers;
    specialOffers = await RestaurantApi.getSpecialOffers({ zone_id: sortingParamsObject.zone_id });
    showSpecialOffers = Boolean(specialOffers.length);


    // Getting restaurants by special offers
    let specialOfferRestaurants = (currentCategoryId ?
      await RestaurantApi.getRestaurantsBySpecialOffersAndCategory(sortingParamsObject, currentCategoryId):
      await RestaurantApi.getRestaurantsBySpecialOffers(sortingParamsObject)).restaurants;


    // Filter restaurants by open/close time
    const timeFilteredRestaurantsBySpecialOfferList =
      specialOfferRestaurants && specialOfferRestaurants.length ?
        this.calcWorkTime(specialOfferRestaurants, true) : [];


    return {
      restaurants,
      timeFilteredRestaurantsBySpecialOfferList,
      specialOfferRestaurants,
      specialOffers,
      showSpecialOffers,
      timeFilteredRestaurantsList
    }
  }
}

export default new RestaurantsHelper();
