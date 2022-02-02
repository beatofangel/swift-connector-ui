<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="pt-4 text-center"
      color="grey lighten-3"
      permanent
      right
      mini-variant
      mini-variant-width="80"
    >
    <v-tooltip v-for="item in items" :key="item.name" left>
      <template v-slot:activator="{ on, attrs }">
        <localized-link style="text-decoration: none; color: inherit;" :to="item.path">
          <v-btn class="ma-2" v-bind="attrs"  v-on="on" :elevation="isCurrent(item.path) ? 10 : 4" :color="isCurrent(item.path) ? 'blue-grey' : 'grey'" fab :ripple="false" :x-small="!isCurrent(item.path)">
            <v-icon class="white--text text-h5">{{ item.icon }}</v-icon>
          </v-btn>
        </localized-link>
      </template>
      <span>{{ $t("label." + item.name.toLowerCase()) }}</span>
    </v-tooltip>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
export default {
  created() {
    this.$router.options.routes.forEach((route) => {
      this.items.push({
        name: route.name,
        path: route.path,
        icon: route.icon
      });
    });
  },
  mounted() {
    window.navigateTo = this.navigateTo
  },
  methods: {
    isCurrent(path) {
      return this.$router.currentRoute.path === '/' + this.$i18n.locale + path
    },
    navigateTo(path) {
      if (this.$router.currentRoute.path !== path) {
        this.$router.push(path)
      }
    }
  },
  data() {
    return {
      items: [],
      drawer: null,
    };
  },
};
</script>