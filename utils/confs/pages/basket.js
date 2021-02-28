import {
  EMPTY_BASKET,
  ADD_TO_BASKET,
  INCREMENT_DISH_COUNTER,
  DECREMENT_DISH_COUNTER
} from "../store-actions/basket";

import {
  SET_USER_PHONE_NUMBER,
  SET_SMS_TIMER
} from "../store-actions/user"

export const STORE_EMPTY_BASKET = `basket/${EMPTY_BASKET}`;
export const STORE_ADD_TO_BASKET = `basket/${ADD_TO_BASKET}`;
export const STORE_INCREMENT_DISH_COUNTER = `basket/${INCREMENT_DISH_COUNTER}`;
export const STORE_DECREMENT_DISH_COUNTER = `basket/${DECREMENT_DISH_COUNTER}`;
export const STORE_GET_TOTAL_PRICE = 'basket/getTotalPrice';
export const STORE_GET_TOTAL_PRICE_WITH_DELIVERY = 'basket/getTotalPriceWithDelivery';
export const STORE_GET_RESTAURANT_URL = 'basket/getRestaurantUrl';
export const STORE_GET_DISHES = 'basket/getDishes';
export const STORE_SET_USER_PHONE_NUMBER = `user/${SET_USER_PHONE_NUMBER}`;
export const STORE_SET_SMS_TIMER = `user/${SET_SMS_TIMER}`;
export const STORE_GET_USER_PHONE_NUMBER = 'user/getUserPhoneNumber';
export const STORE_GET_CURRENT_ADDRESS = 'map/getCurrentAddress';

export const YEST_DELIVERY_COST = 5;
