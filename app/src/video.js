import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueResource from 'vue-resource';
import infiniteScroll from 'vue-infinite-scroll';
import Video from './components/Video.vue';

Vue.use(VueResource);
Vue.use(infiniteScroll);

Vue.http.options.root = 'https://sb-bridge.public.nowth.is/v1';
Vue.http.options.credentials = true;
Vue.http.headers.common['X-NT-API-Token'] = '808a7bb0d28f6607e47d0da4f86024a6';

Vue.use(VueAwesomeSwiper);

new Vue({
  el: '#app',
  render: h => h(Video)
});
