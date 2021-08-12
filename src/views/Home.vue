<template>
  <div
    v-if="user.name"
    class="home-page"
  >
    <Tilt
      class="tilt br2 shadow-2 ma4 mt0"
      :options="tiltOption"
    >
      <img
        src="../assets/image/brain.svg"
        alt="logo"
      >
    </Tilt>
    <h1 class="white f3">
      {{ user.name }}, 您目前掃描得照片總數為...
    </h1>
    <p class="white f1">
      {{ user.entries }}
    </p>
    <div>
      <p class="f3 mv4">
        提供圖片網址，Magic Brain 將會為您偵測出現在圖片上的臉。
      </p>
      <div
        class="form pa4 br3 shadow-5 center flex"
      >
        <input
          v-model="imgUrl"
          type="text"
          class="f4 pa2 w-70"
          @keypress.enter="urlSubmit"
          @input="imgUrlChange"
        >
        <div
          class="w-30"
          :class="{ 'not-allowed': isNotAllowSubmit }"
        >
          <button
            type="button"
            class="f4 w-100 h-100 link ph3 pv2 white bg-light-purple pointer bn"
            @click="urlSubmit"
          >
            偵測
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="ma4 relative">
        <transition name="fade">
          <img
            v-if="imgUrl"
            ref="image"
            :src="imgUrl"
            alt=""
            @load="isNotAllowSubmit = false"
          >
        </transition>
        <Box
          v-for="(box, i) in boxes"
          :key="i"
          :box="box"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-len */
import Tilt from 'vanilla-tilt-vue';
import Box from '@/components/Box.vue';

export default {
  components: {
    Tilt,
    Box,
  },
  data() {
    return {
      user: {},
      imgUrl: '',
      isNotAllowSubmit: true,
      boxes: [],
      tiltOption: {
        max: 30,
        glare: true,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getUser();
    });
  },
  methods: {
    getUser() {
      this.$bus.$emit('update:loading', true);
      const token = localStorage.getItem('token');
      if (token) {
        const signInApi = 'https://quiet-sea-49749.herokuapp.com/signin';
        this.$http.post(signInApi, null, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          const profileApi = `https://quiet-sea-49749.herokuapp.com/profile/${res.data}`;
          return this.$http.get(profileApi, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
        }).then((res) => {
          this.user = res.data.user;
          this.$bus.$emit('update:loading', false);
          this.$notify({ type: 'success', text: `${res.data.user.name} ${res.data.message}` });
        }).catch((err) => {
          localStorage.removeItem('token');
          this.$router.push({ name: 'SignIn' });
          this.$bus.$emit('update:loading', false);
          this.$notify({ type: 'error', text: err.response.data });
        });
      } else {
        this.$router.push({ name: 'SignIn' });
        this.$bus.$emit('update:loading', false);
        this.$notify({ type: 'error', text: '請先登入' });
      }
    },
    urlSubmit() {
      if (this.isNotAllowSubmit) return;
      this.$bus.$emit('update:loading', true);
      const token = localStorage.getItem('token');
      this.$http.post('https://quiet-sea-49749.herokuapp.com/imageurl', { input: this.imgUrl }, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        this.displayFaceBoxes(res.data.outputs[0].data.regions);
        const { id } = this.user;
        return this.$http.put('https://quiet-sea-49749.herokuapp.com/image', { id }, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }).then((res) => {
        this.user.entries = res.data;
        this.$bus.$emit('update:loading', false);
      }).catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          this.$router.push({ name: 'SignIn' });
        }
        this.$bus.$emit('update:loading', false);
        this.$notify({ type: 'error', text: err.response.data });
      });
    },
    imgUrlChange() {
      this.boxes = [];
      this.isNotAllowSubmit = true;
    },
    displayFaceBoxes(data) {
      const img = this.$refs.image;
      const width = Number(img.width);
      const height = Number(img.height);
      const boxes = data.map((faceBox) => {
        const location = faceBox.region_info.bounding_box;
        return {
          leftCol: location.left_col * width,
          topRow: location.top_row * height,
          rightCol: width - (location.right_col * width),
          bottomRow: height - (location.bottom_row * height),
        };
      });
      this.boxes = boxes;
    },
  },
};
</script>

<style lang="scss">
.home-page{
  line-height: 1.5;
  .tilt{
    width: 175px;
    height: 175px;
    background: linear-gradient(90deg, #04C8DE, #FF5EDF);
  }
  .form {
    max-width: 700px;
    background:
      radial-gradient(circle farthest-side at 0% 50%,#fb1 23.5%,rgba(240,166,17,0) 0)21px 30px,
      radial-gradient(circle farthest-side at 0% 50%,#B71 24%,rgba(240,166,17,0) 0)19px 30px,
      linear-gradient(#fb1 14%,rgba(240,166,17,0) 0, rgba(240,166,17,0) 85%,#fb1 0)0 0,
      linear-gradient(150deg,#fb1 24%,#B71 0,#B71 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,#B71 0,#B71 76%,#fb1 0)0 0,
      linear-gradient(30deg,#fb1 24%,#B71 0,#B71 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,#B71 0,#B71 76%,#fb1 0)0 0,
      linear-gradient(90deg,#B71 2%,#fb1 0,#fb1 98%,#B71 0%)0 0 #fb1;
      background-size: 40px 60px;
  }
  img{
    width: 100%;
    max-width: 700px;
  }
}
</style>
