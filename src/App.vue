<template>
  <v-app>
    <v-system-bar v-if="getShowCtrlBox" fixed dark>
      <v-spacer></v-spacer>
      <v-hover v-slot="{ hover }">
        <v-btn
          tabIndex="-1"
          @click="minimizeWindow"
          :color="hover ? 'grey darken-4' : 'transparent'"
          depressed
          :ripple="false"
          x-small
          tile
          ><v-icon class="mx-0" color="grey lighten-1"
            >mdi-window-minimize</v-icon
          ></v-btn
        >
      </v-hover>
      <v-hover v-if="windowSize == 1" v-slot="{ hover }">
        <v-btn
          tabIndex="-1"
          @click="maximizeWindow"
          :color="hover ? 'grey darken-4' : 'transparent'"
          depressed
          :ripple="false"
          x-small
          tile
          ><v-icon class="mx-0" color="grey lighten-1"
            >mdi-window-maximize</v-icon
          ></v-btn
        >
      </v-hover>
      <v-hover v-if="windowSize == 2" v-slot="{ hover }">
        <v-btn
          tabIndex="-1"
          @click="restoreWindow"
          :color="hover ? 'grey darken-4' : 'transparent'"
          depressed
          :ripple="false"
          x-small
          tile
          ><v-icon class="mx-0" color="grey lighten-1"
            >mdi-window-restore</v-icon
          ></v-btn
        >
      </v-hover>
      <v-hover v-slot="{ hover }">
        <v-btn
          tabIndex="-1"
          @click="closeWindow"
          :color="hover ? 'red' : 'transparent'"
          depressed
          :ripple="false"
          x-small
          tile
          ><v-icon class="mx-0" :color="hover ? 'black' : 'grey lighten-1'"
            >mdi-window-close</v-icon
          ></v-btn
        >
      </v-hover>
    </v-system-bar>
    <v-navigation-drawer
      v-model="drawer"
      v-if="getShowNavi && appAccess"
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
          <localized-link
            style="text-decoration: none; color: inherit"
            v-if="!item.solo && !(appAccess && item.path === '/')"
            :to="item.path"
          >
            <v-btn
              tabIndex="-1"
              class="ma-2"
              v-bind="attrs"
              v-on="on"
              :elevation="isCurrent(item.path) ? 10 : 4"
              :color="isCurrent(item.path) ? 'blue-grey' : 'grey'"
              fab
              :ripple="false"
              :x-small="!isCurrent(item.path)"
            >
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
import { mapGetters, mapActions } from "vuex";
export default {
  created() {
    document.querySelector('.website-loading').addEventListener("animationend", function() {
      setTimeout(() => {
        document.querySelector('.website-loading').remove();
      }, 1000);
    }, { once: true });

    this.$router.options.routes.forEach((route) => {
      this.items.push({
        name: route.name,
        path: route.path,
        icon: route.icon,
        solo: route.solo == true
      });
    });
    
    document.querySelector('.website-loading').classList.add("website-loading-fadeout")
  },
  mounted() {
    window.platformVerifyCallback = this.platformVerifyCallback;
    window.navigateTo = this.navigateTo;
    this.taskPaneMode = window.taskPaneMode;
    window.chrome.webview && window.chrome.webview.postMessage({
      api: "platformVerify",
      callback: "platformVerifyCallback"
    });
  },
  computed: {
    ...mapGetters(["getShowNavi", "getShowCtrlBox", "windowSize"]),
  },
  methods: {
    ...mapActions(["maximize", "restore"]),
    isCurrent(path) {
      return this.$router.currentRoute.path === "/" + this.$i18n.locale + path;
    },
    platformVerifyCallback() {
      console.log('switch to app mode')
      this.appAccess = true
    },
    navigateTo(path) {
      if (this.$router.currentRoute.path !== path) {
        this.$router.push(path);
      }
    },
    closeWindow() {
      window.chrome.webview.postMessage({
        api: "closeWindow",
      });
    },
    minimizeWindow() {
      window.chrome.webview.postMessage({
        api: "minimizeWindow",
      });
    },
    maximizeWindow() {
      this.maximize();
      window.chrome.webview.postMessage({
        api: "maximizeWindow",
      });
    },
    restoreWindow() {
      this.restore();
      window.chrome.webview.postMessage({
        api: "restoreWindow",
      });
    },
  },
  data() {
    return {
      items: [],
      drawer: null,
      taskPaneMode: true,
      appAccess: false,
    };
  },
};
</script>

<style scoped>
</style>