import {EMPTY_BASKET} from "@/utils/confs/store-actions/basket";
import {SET_SELECTED_ZONE} from "@/utils/confs/store-actions/zone";
import {DROP_LOCATION} from "@/utils/confs/store-actions/map";
import {SET_CATEGORIES} from "@/utils/confs/store-actions/restaurant";

export const STORE_SET_EMPTY_BASKET = `basket/${EMPTY_BASKET}`;
export const STORE_SET_SELECTED_ZONE = `zone/${SET_SELECTED_ZONE}`;
export const STORE_SET_CATEGORIES = `restaurant/${SET_CATEGORIES}`;
export const STORE_DROP_LOCATION = `map/${DROP_LOCATION}`;

export const STORE_GET_SELECTED_ZONE = 'zone/getSelectedZone';
export const STORE_GET_CURRENT_ADDRESS = 'map/getCurrentAddress';
export const STORE_GET_ZONE_LIST = 'zone/getZoneList';
export const STORE_IS_MAP_VISIBLE = 'map/isMapVisible';
export const STORE_IS_INPUT_ADDRESS_MODE = 'map/isInputAddressMode';
export const STORE_GET_TOTAL_PRICE = 'basket/getTotalPrice';
export const STORE_GET_RESTAURANT_URL = 'basket/getRestaurantUrl';
export const STORE_GET_USER_PHONE_NUMBER = 'user/getUserPhoneNumber';
export const STORE_GET_CATEGORIES = 'restaurant/getCategories';
