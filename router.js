import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Home from "./pages/Home.vue";
import Business from "./pages/resources/Business.vue";
import Contacts from "./pages/resources/Contacts.vue";
import Delivery from "./pages/resources/Delivery.vue";
import Faq from "./pages/resources/Faq.vue";
import Partner from "./pages/resources/Partner.vue";
import Profile from "./pages/resources/Profile.vue";
import Questions from "./pages/resources/Questions.vue";
import Rabota from "./pages/resources/Rabota.vue";
import TermsOfUse from "./pages/resources/TermsOfUse.vue";
import RestaturantsMain from "./pages/restaurants/Main.vue";
import RestaurantMain from "./pages/restaurant/Main";
import BasketMain from "./pages/basket/Main"

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home,
      },
      {
        path: '/business',
        name: 'business',
        component: Business,
      },
      {
        path: '/contacts',
        name: 'contacts',
        component: Contacts,
      },
      {
        path: '/delivery',
        name: 'delivery',
        component: Delivery,
      },
      {
        path: '/faq',
        name: 'faq',
        component: Faq,
      },
      {
        path: '/partner',
        name: 'partner',
        component: Partner,
      },
      {
        path: '/profile',
        name: 'profile',
        component: Profile
      },
      {
        path: '/questions',
        name: 'questions',
        component: Questions,
      },
      {
        path: '/basket',
        name: 'basket',
        component: BasketMain,
        props: true
      },
      {
        path: '/rabota',
        name: 'rabota',
        component: Rabota,
      },
      {
        path: '/terms-of-use',
        name: 'terms-of-use',
        component: TermsOfUse,
      },
      {
        path: '/:region',
        name: 'restaurants',
        component: RestaturantsMain,
        props: true
      },
      {
        path: '/:region/restaurants/category/:category',
        name: 'restaurantsWithCategory',
        component: RestaturantsMain,
        props: true
      }, // can I have that ?
      {
        path: '/:region/restaurant/:restaurantName',
        name: 'restaurant',
        component: RestaurantMain,
        props: true
      }
    ]
  })
}

