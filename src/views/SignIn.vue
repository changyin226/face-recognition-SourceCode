<template>
  <div class="sign-in-page pa4 black-80 br3 ba b--black-10 w-100 mw6 center shadow-5">
    <form
      class="measure center"
      @keypress.enter="signInSubmit"
      @submit.prevent
    >
      <fieldset
        id="sign_up"
        class="ba b--transparent ph0 mh0"
      >
        <legend class="f1 fw6 ph0 mh0 tracked">
          登入
        </legend>
        <div class="mt3">
          <label
            for="email"
            class="db fw6 lh-copy f5 mb1"
          >信箱</label>
          <input
            id="email"
            v-model.trim="email"
            class="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
            type="email"
            name="email"
          >
        </div>
        <div class="mv3">
          <label
            for="password"
            class="db fw6 lh-copy f5 mb1"
          >密碼</label>
          <input
            id="password"
            v-model.trim="password"
            class="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
            type="password"
            name="password"
          >
        </div>
      </fieldset>
      <div
        class="dib"
        :class="{ 'not-allowed': isNotAllowSubmit }"
      >
        <button
          class="b ph3 pv2 ba b--black bg-transparent pointer f5"
          type="button"
          @click="signInSubmit"
        >
          登入
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    isNotAllowSubmit() {
      return !this.email || !this.password;
    },
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) this.$router.push({ name: 'Home' });
  },
  methods: {
    signInSubmit() {
      if (this.isNotAllowSubmit) return;
      this.$bus.$emit('update:loading', true);
      const { email, password } = this;
      // const api = 'https://boiling-sea-04766.herokuapp.com/signin';
      const api = 'https://quiet-sea-49749.herokuapp.com/signin';
      this.$http.post(api, {
        email,
        password,
      }).then((res) => {
        localStorage.setItem('token', res.data.token);
        this.$router.push({ name: 'Home' });
      }).catch((err) => {
        Object.assign(this.$data, this.$options.data.call(this));
        this.$bus.$emit('update:loading', false);
        this.$notify({ type: 'error', text: err.response.data });
      });
    },
  },
};
</script>

<style lang="scss">
.sign-in-page{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
</style>
