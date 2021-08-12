<template>
  <div class="register-page pa4 black-80 br3 ba b--black-10 w-100 mw6 center shadow-5">
    <form
      class="measure center"
      @keypress.enter="registerSubmit"
      @submit.prevent
    >
      <fieldset
        id="sign_up"
        class="ba b--transparent ph0 mh0"
      >
        <legend class="f1 fw6 ph0 mh0 tracked">
          註冊
        </legend>
        <div class="mt3">
          <label
            class="db fw6 lh-copy f5 mb1"
            for="name"
          >姓名</label>
          <input
            id="name"
            v-model.trim="name"
            class="b pa2 mb2
              input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
            type="text"
            name="name"
            onChange="{this.onNameChange}"
          >
          <transition
            name="fade"
            mode="out-in"
          >
            <small
              v-if="!isValidName"
              key="nameFalse"
              class="db f6 tl dark-red"
            >*必須輸入姓名且不能含標點符號</small>
            <small
              v-else
              key="nameSuccess"
              class="db b f6 tl dark-green"
            >*有效的姓名</small>
          </transition>
        </div>
        <div class="mt3">
          <label
            class="db fw6 lh-copy f5 mb1"
            for="email"
          >信箱</label>
          <input
            id="email"
            v-model.trim="email"
            class="b pa2 mb2
              input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
            type="email"
            name="email"
            onChange="{this.onEmailChange}"
          >
          <transition
            name="fade"
            mode="out-in"
          >
            <small
              v-if="!isValidEmail"
              key="emailFalse"
              class="db f6 tl dark-red"
            >*必須輸入有效Email格式</small>
            <small
              v-else
              key="emailSuccess"
              class="db b f6 tl dark-green"
            >*有效的Email格式</small>
          </transition>
        </div>
        <div class="mv3">
          <label
            class="db fw6 lh-copy f5 mb1"
            for="password"
          >密碼</label>
          <input
            id="password"
            v-model.trim="password"
            class="b pa2 mb2
              input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
            type="password"
            name="password"
            onChange="{this.onPasswordChange}"
          >
          <transition
            name="fade"
            mode="out-in"
          >
            <small
              v-if="!isValidPassword"
              key="passwordFalse"
              class="db f6 tl dark-red db"
            >*必須為字母加數字且長度不小於8</small>
            <small
              v-else
              key="passwordSuccess"
              class="db b f6 tl dark-green"
            >*有效的密碼</small>
          </transition>
        </div>
      </fieldset>
      <div
        class="dib"
        :class="{ 'not-allowed': isNotAllowSubmit }"
      >
        <button
          class="b ph3 pv2 ba b--black bg-transparent pointer f5"
          type="button"
          @click="registerSubmit"
        >
          註冊
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  computed: {
    isNotAllowSubmit() {
      return !(this.isValidName && this.isValidEmail && this.isValidPassword);
    },
    isValidName() {
      const str = this.name;
      const reg = new RegExp(/^[0-9A-Za-z]+$/);
      return reg.test(str);
    },
    isValidEmail() {
      const str = this.email;
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      return reg.test(str);
    },
    isValidPassword() {
      const str = this.password;
      const reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
      const reg1 = new RegExp(/^[0-9A-Za-z]+$/);
      return str.length >= 8 && reg.test(str) && reg1.test(str);
    },
  },
  methods: {
    registerSubmit() {
      if (this.isNotAllowSubmit) return;
      this.$bus.$emit('update:loading', true);
      const { name, email, password } = this;
      const api = 'https://quiet-sea-49749.herokuapp.com/register';
      this.$http.post(api, {
        name,
        email,
        password,
      }).then((res) => {
        localStorage.setItem('token', res.data.token);
        this.$router.push({ name: 'Home' });
      }).catch((err) => {
        if (err === '發生錯誤，請再登入一次') {
          this.$router.push({ name: 'SignIn' });
          this.$notify({ type: 'error', text: err });
        } else {
          this.$bus.$emit('update:loading', false);
          this.$notify({ type: 'error', text: err.response.data });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.register-page{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0)
}
</style>
