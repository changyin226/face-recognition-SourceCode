<template>
  <nav class="navigation-component tr pv3">
    <div v-if="routeName === 'Home'">
      <a
        class="dib f3 black underline pa3 pointer tracked"
      >
        <span @click="signOut">登出</span>
      </a>
    </div>
    <div v-else>
      <router-link
        :to="{ name: 'SignIn' }"
        class="dib f3 black underline pa3 pointer tracked"
      >
        登入
      </router-link>
      <router-link
        :to="{ name: 'Register' }"
        class="dib f3 black underline pa3 pointer tracked"
      >
        註冊
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    routeName() {
      return this.$route.name;
    },
  },
  methods: {
    signOut() {
      const token = localStorage.getItem('token');
      const api = 'https://quiet-sea-49749.herokuapp.com/signout';
      this.$http.post(api, null, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        localStorage.removeItem('token');
        this.$router.push({ name: 'SignIn' });
        this.$notify({ type: 'success', text: res.data });
      }).catch((err) => {
        this.$notify({ type: 'error', text: err.response.data });
      });
    },
  },
};
</script>

<style lang="scss">
.navigation-component{
  a{
    transition: 0.3s;
    &:hover{
      transform: scale(1.1,1.1);
    }
  }
}
</style>
