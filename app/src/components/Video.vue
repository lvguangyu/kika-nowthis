<template>
<div class="assets-ctn">
  <div class="item" v-if="!loading">
    <div class="title">{{ video.title }}</div>
    <div class="video-ctn">
      <video class="video" ref="video" :controls="playing" :src="video.mediaUrl" :poster="video.imgUrl" :autoplay="false">
      </video>
      <div class="button-play" @click="play" v-if="!playing"></div>
    </div>
    <div class="footer hbox">
      <div class="publish-at">{{ date(video.createdTime) }}</div>
      <!--<div class="button-send">SEND</div>-->
    </div>
  </div>
  <div v-if="loading || error" class="loading-ctn">
    <div v-if="loading" class="loading"></div>
    <div v-if="error" class="hint">Error occurs, <span class="button-retry" @click="load">click to reload...</span></div>
  </div>
</div>
</template>

<script>
function getParameterByName (name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default {
  data: () => ({
    loading: false,
    error: false,
    playing: false,
    video: {}
  }),
  created () {
    this.load();
  },
  methods: {
    play (video) {
      if (this.playing) {
        this.$refs.video.pause();
        this.playing = false;
      } else {
        this.$refs.video.play();
        this.playing = true;
      }
    },
    date (input) {
      const date = new Date(input);
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      return `${year}-${monthIndex + 1}-${day}`;
    },
    async load () {
      const id = getParameterByName('newsId');
      this.loading = true;

      const resp = await this.$http.jsonp(`http://api-dev.kikakeyboard.com/backend-service-cms/news/nzNews?newsId=${id}`);

      console.log(resp);

      this.video = resp.data.data.news;

      this.loading = false;
    }
  }
};
</script>

<style lang="sass">
@import 'bourbon';
@import 'common';

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

.swiper-slide {
  width: auto !important;
}

.assets-ctn {
  overflow: auto;
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

body {
  background: #000;
  height: 100%;
}
</style>
