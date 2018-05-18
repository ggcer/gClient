<template>
  <div id="app">
    <transition :name="direction">
      <router-view class="root-router-view"/>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
    }
  },
  methods: {

  },
  computed: {
    ...mapState({
      direction: state => state.direction
    })
  },
  mounted() {
  }
}
</script>

<style lang="scss">
@import "src/assets/css/main.scss";
.root-router-view{
  width: 100%;
  height: 100%;
  position: absolute;
  transition: all 0.3s cubic-bezier(.55,0,.1,1);
}
.forward-enter, .back-leave-active {
  opacity: 0.6;
}
.forward-leave-active, .back-enter {
  opacity: 0.6;
}
</style>
