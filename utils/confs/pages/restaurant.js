import { ADD_TO_BASKET, DECREMENT_DISH_COUNTER, REMOVE_DISH_FROM_BASKET, SET_RESTAURANT_URL } from "../store-actions/basket";

export const STORE_ADD_TO_BASKET = `basket/${ADD_TO_BASKET}`;
export const STORE_DECREMENT_DISH_COUNTER = `basket/${DECREMENT_DISH_COUNTER}`;
export const STORE_REMOVE_DISH_FROM_BASKET = `basket/${REMOVE_DISH_FROM_BASKET}`;
export const STORE_GET_RESTAURANT_URL = 'basket/getRestaurantUrl';
export const STORE_SET_RESTAURANT_URL = `basket/${SET_RESTAURANT_URL}`;
