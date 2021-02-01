import { mapActions, mapGetters } from "vuex";
import {
  STORE_DROP_LOCATION,
  STORE_GET_ZONE_LIST,
  STORE_SET_EMPTY_BASKET,
  STORE_SET_SELECTED_ZONE
} from "../confs/pages/home";

export default {
  methods: {
    ...mapActions({
      setEmptyBasket : STORE_SET_EMPTY_BASKET,
      dropLocation: STORE_DROP_LOCATION,
      setSelectedZone: STORE_SET_SELECTED_ZONE
    }),
    handleZoneClick(zone) {
      this.toggleRestOverlay();
      this.setEmptyBasket();
      this.dropLocation();
      this.setSelectedZone(zone);
      this.$router.push({ name: 'restaurants', params: { region: zone.alias } })
    },
    toggleRestOverlay() {
      this.restOverlay = !this.restOverlay;
    }
  },
  computed: {
    ...mapGetters({
      getZoneList: STORE_GET_ZONE_LIST
    })
  },
}
