import { SET_ZONES, SET_SELECTED_ZONE } from "@/utils/confs/store-actions/zone";
import { DROP_LOCATION } from "@/utils/confs/store-actions/map";
import { EMPTY_BASKET } from "@/utils/confs/store-actions/basket";

export const STORE_SET_ZONES = `zone/${SET_ZONES}`;
export const STORE_SET_SELECTED_ZONE = `zone/${SET_SELECTED_ZONE}`;
export const STORE_SET_EMPTY_BASKET = `basket/${EMPTY_BASKET}`;
export const STORE_DROP_LOCATION = `map/${DROP_LOCATION}`;
export const STORE_GET_ZONE_LIST = 'zone/getZoneList';
