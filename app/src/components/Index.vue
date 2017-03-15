<template>
<div class="ctn">
  <div class="nav-ctn" v-if="!hideNav">
    <swiper class="nav" :options="swiperOption" ref="mySwiperA" v-if="navs.length > 0">
      <swiper-slide v-for="nav in navs" ><div class="item" :class="{ active: nav.active }" @click="active(nav)">{{ nav.name.toUpperCase() }}</div></swiper-slide>
    </swiper>
  </div>
  <div class="assets-ctn" @scroll="scroll">
    <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-immediate-check="false">
      <li class="item" v-for="asset in assets" :ref="`${asset.newsId}-ctn`">
        <div class="title" :class="{ touched: asset.touched }">{{ asset.title }}</div>
        <div class="video-ctn">
          <video :ref="asset.newsId" class="video" :controls="playing.newsId === asset.newsId" :poster="asset.imgUrl" :autoplay="false">
          </video>
          <div class="button-play" @click="play(asset)" v-if="playing.newsId !== asset.newsId"></div>
        </div>
        <div class="footer hbox">
          <div class="publish-at">{{ date(asset.addedTime) }}</div>
          <div class="button-send" @click="share(asset)">SEND</div>
        </div>
      </li>
    </ul>
    <div v-if="loading || error" class="loading-ctn">
      <div v-if="loading" class="loading"></div>
      <div v-else class="hint">Error occurs, <span class="button-retry" @click="load">click to reload...</span></div>
    </div>
  </div>
</div>
</template>

<script>
/* global kikaopen */

import { swiper, swiperSlide } from 'vue-awesome-swiper';

const AP = 'http://api-dev.kikakeyboard.com/backend-service-cms/news/nzNews';

export default {
  name: 'index',
  data: () => ({
    swiperOption: {
      spaceBetween: 16,
      freeMode: true,
      autoHeight: true,
      slidesPerView: 'auto'
    },
    hideNav: true,
    navs: [],
    assets: [],
    playing: {},
    currentPlaying: '',
    loading: false,
    error: false,
    currentTabId: undefined,
    pageSize: 10
  }),
  async created () {
    const resp = await this.$http.jsonp(`${AP}/category`);

    for (let i = 0; i < resp.data.data.categories.length; i++) {
      const item = resp.data.data.categories[i];
      item.active = false;
      this.navs.push(item);
    }

    this.active(this.navs[0]);
  },
  mounted () {
    const vm = this;

    kikaopen.onWindowChanged = function (fullScreen, width, height) {
      vm.hideNav = Number(height) <= 500;
    };

    vm.hideNav = window.innerHeight <= 500;
  },
  methods: {
    scroll (evt) {
      if (this.currentPlaying) {
        const ctn = this.$refs[`${this.currentPlaying}-ctn`][0];
        if (ctn.offsetTop + ctn.offsetHeight < evt.target.scrollTop) {
          this.$refs[this.currentPlaying][0].pause();
        }
      }
    },
    share (asset) {
      const ap = 'http://aaa.bbb.com?id=';
      const id = asset.newsId;

      kikaopen.shareToApp('link', `${ap}${id}`);
    },
    active (item) {
      let currentItem;

      this.play({ video: { id: undefined }});

      for (let i = 0; i < this.navs.length; i++) {
        if (this.navs[i].active) {
          currentItem = this.navs[i];
          break;
        }
      }

      if (!currentItem) {
        item.active = true;
        return this.load(item.id);
      }

      if (currentItem.id !== item.id) {
        currentItem.active = false;
        item.active = true;
        return this.load(item.id);
      }
    },
    async load (id) {
      this.loading = true;
      this.error = false;
      this.assets = [];

      this.currentTabId = id;
      try {
        const resp = await this.$http.jsonp(`${AP}/category?categoryId=${this.currentTabId}&count=${this.pageSize}&lastId=${this.lastId}`);
        this.assets = resp.data.data.newsList;
      } catch (e) {
        this.error = true;
      }

      this.loading = false;
    },
    async loadMore () {
      if (!this.loading) {
        this.error = false;
        this.loading = true;

        try {
          const resp = await this.$http.jsonp(`${AP}/category?categoryId=${this.currentTabId}&count=${this.pageSize}&lastId=${this.lastId}`);
          this.assets = this.assets.concat(resp.data.data.newsList);
        } catch (e) {
          this.error = true;
        }

        this.loading = false;
      }
    },
    play (asset) {
      asset.touched = true;
      const video = asset;
      if (this.currentPlaying) {
        this.$refs[this.currentPlaying][0].pause();
      }

      const videoEles = this.$refs[video.newsId];
      if (videoEles) {
        videoEles[0].src = asset.mediaUrl;
        videoEles[0].play();
      }
      this.currentPlaying = video.newsId;
      this.playing = video;
    },
    date (input) {
      const date = new Date(input);
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      return `${year}-${monthIndex + 1}-${day}`;
    }
  },
  computed: {
    lastId () {
      const lastItem = this.assets[this.assets.length - 1];
      if (lastItem) {
        return lastItem.newsId;
      } else {
        return undefined;
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  }
};
</script>

<style lang="sass">
@import 'bourbon';
@import 'common';

body {
  background: #000;
}

.nav-ctn {
  background: #feff18;
  box-sizing: border-box;
  left: 0;
  padding: 4px 16px ;
  position: absolute;
  top: 0;
  width: 100%;
}

.nav {
  width: auto;

  .item {
    @include display(inline-block);

    border-bottom: 4px transparent solid;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 10px;
    text-align: center;

    &.active {
      border-bottom: 4px #000 solid;
    }
  }
}

.swiper-slide {
  width: auto !important;
}

.assets-ctn {
  bottom: 0;
  overflow: auto;
  position: absolute;
  top: 51px;
  width: 100%;

  .item {
    background: #000;

    .title {
      color: #fff;
      font-size: 15px;
      line-height: 1.5em;
      padding: 16px;

      &.touched {
        opacity: .7;
      }
    }

    .footer {
      @include align-items(flex-start);

      padding: 16px;

      .publish-at {
        @include flex(1);

        color: #616161;
        font-size: 14px;
      }

      .button-send {
        box-sizing: border-box;
        border: 4px #feff18 solid;
        color: #feff18;
        height: 36px;
        line-height: 28px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        width: 68px;
      }
    }
  }

  .loading-ctn {
    padding: 24px 0;
    text-align: center;

    .loading {
      @include animation(rotate 1s infinite);
      @include display(inline-block);

      background: url(/images/loading.png);
      background-size: cover;
      height: 36px;
      width: 36px;
    }

    .hint {
      color: #fff;
      font-size: 16px;
    }
  }
}

@include keyframes(rotate) {
  0% {
    @include transform(rotate(0deg));
  }
  100% {
    @include transform(rotate(360deg));
  }
}

.video-ctn {
  position: relative;
  width: 100%;

  .video {
    width: 100%;
  }

  .button-play {
    background-image: url(/images/play.png);
    background-size: cover;
    height: 100px;
    left: 50%;
    margin: -50px 0 0 -50px;
    position: absolute;
    top: 50%;
    width: 100px;
  }
}

.ctn {
  height: 100%;
}
</style>
