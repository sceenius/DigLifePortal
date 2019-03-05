<template>
  <router-view />
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  name: "Home",
  components: { Navbar },
  data: () => ({})
};
</script>

<style>
@import "https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons";
</style>
