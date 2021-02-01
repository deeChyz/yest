export default {
  data () {
    return {
      currentDay: null,
      currentTime: null,
    }
  },
  methods: {
    calculateWorkTime (item) {
      (item.operation_time).forEach((time) => {
        if (time.day === this.currentDay) {
          const openingTime = (time.open_time).split(':');
          const closingTime = (time.close_time).split(':');
          const openingTimeInSec = openingTime[0] * 3600 + openingTime[1] * 60 + openingTime[2];
          const closingTimeInSec = closingTime[0] * 3600 + closingTime[1] * 60 + closingTime[2];

          item.is_open = openingTimeInSec <= this.currentTime && closingTimeInSec > this.currentTime;

          let todayOT = [];

          todayOT.push({
            time_open: openingTimeInSec,
            close_time: closingTimeInSec,
          });
        }
      });

      return [item, todayOT];
    },
    async restaurantWorkTime (context, payload) {
      return new Promise((resolve, reject) => {
        this.currentDay = new Date().getDay();
        const UTC_DATE_TIME = new Date();
        this.currentTime = ((UTC_DATE_TIME.getHours() * 3600)
            + (UTC_DATE_TIME.getMinutes() * 60)
            + (UTC_DATE_TIME.getSeconds())) * 100;

        let item = payload;
        item.is_open = false;
        let data = this.calculateWorkTime(item);
        let returnData = {
          todayOT: data.todayOT,
          is_open: data.item.is_open
        };

        resolve(returnData);
      });
    },

    // Фильтрация ресторанов по режиму работы
    async filteringRestaurantsByWorkTime(context, payload) {
      return new Promise((resolve, reject) => {
        const openRestaurants = [];
        const closeRestaurants = [];
        this.currentDay = new Date().getDay();
        const UTC_DATE_TIME = new Date();
        this.currentTime = ((UTC_DATE_TIME.getHours() * 3600)
          + (UTC_DATE_TIME.getMinutes() * 60)
          + (UTC_DATE_TIME.getSeconds())) * 100;

        payload.forEach((item) => {
          item.is_open = false;
          let data = this.calculateWorkTime(item);
          data.item.is_open ? openRestaurants.push(data.item) : closeRestaurants.push(data.item);
        });
        resolve(openRestaurants.concat(closeRestaurants));
      });
    },
    async openRestaurants(context, payload) {
      return new Promise((resolve, reject) => {
        const openRestaurants = [];
        this.currentDay = new Date().getDay();
        const UTC_DATE_TIME = new Date();
        this.currentTime = ((UTC_DATE_TIME.getHours() * 3600)
          + (UTC_DATE_TIME.getMinutes() * 60)
          + (UTC_DATE_TIME.getSeconds())) * 100;

        payload.forEach((item, i, arr) => {
          item.is_open = false;
          let data = this.calculateWorkTime(item);

          if (data.item.is_open) {
            openRestaurants.push(data.item);
          }
        });
        resolve(openRestaurants);
      });
    },
  }
}
