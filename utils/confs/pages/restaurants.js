// Constants

import {SET_SELECTED_ZONE, SET_ZONES} from "../store-actions/zone";
import {SET_CATEGORIES, SET_CATEGORY, SET_CATEGORY_INFO} from "../store-actions/restaurant";

export const CATEGORY_ALL = {
  name: 'Все',
  id: 0,
  alias: 'all'
};

export const DEFAULT_BREADCRUMB = {
  text: 'Yest.by',
  url: process.env.API_URL
}

export const SORT_BY_COORDINATES_DEFAULT_LIMIT = 1000;
export const SORT_BY_COORDINATES_TEN_THOUSAND_LIMIT = 10000;
export const SORT_BY_COORDINATES_DEFAULT_START = 0;

export const CATEGORY_INFO_DEFAULT_BACKGROUND_URL = 'https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png';
export const CATEGORY_INFO_DEFAULT_ICON_URL = 'https://menu-menu.by/images/category_background/mobile/pizza.jpg';

export const DEFAULT_SEARCH_MODAL_IMAGE_URL = 'https://img.eatmealby.com/resize/restaurant/600/';

export const DEFAULT_RESTAURANTS_SHOW_LIMIT = 12;

export const STORE_SET_ZONES = `zone/${SET_ZONES}`;
export const STORE_SET_SELECTED_ZONE = `zone/${SET_SELECTED_ZONE}`;
export const STORE_SET_CATEGORY_INFO = `restaurant/${SET_CATEGORY_INFO}`;
export const STORE_GET_CATEGORIES = 'restaurant/getCategories';
export const STORE_GET_CATEGORY_INFO = 'restaurant/getCategoryInfo';
export const STORE_SET_CATEGORIES = `restaurant/${SET_CATEGORIES}`;
export const STORE_GET_CURRENT_COORDS = 'map/getCurrentAddress';
export const STORE_GET_ZONE_LIST = 'zone/getZoneList';
export const STORE_GET_SELECTED_ZONE = 'zone/getSelectedZone';
