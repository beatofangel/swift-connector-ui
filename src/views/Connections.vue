<template>
  <v-container class="mt-6">
    <v-row>
      <v-col>
        <v-card max-height="calc(100vh - 48px)">
          <v-card-title>
            <v-row class="d-flex justify-space-between mx-2">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="getSearchLabel"
                  single-line
                  clearable
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn-toggle class="mt-4" v-model="toggleViewMode" mandatory>
                  <v-btn small>
                    <v-icon>mdi-view-list</v-icon>
                  </v-btn>
                  <v-btn small>
                    <v-icon>mdi-view-module</v-icon>
                  </v-btn>
                </v-btn-toggle>
            </v-row>
          </v-card-title>
          <v-card
            class="overflow-y-auto overflow-x-hidden"
            elevation="0"
            max-height="calc(100vh - 128px)"
          >
            <v-card-text>
              <v-row dense>
                <v-col
                  v-for="item in getFilteredItems"
                  :key="item.Id"
                  :cols="toggleViewMode == 0 ? 12 : getResponsiveColumns"
                >
                  <v-speed-dial
                    :id="item.Id"
                    direction="right"
                    transition="slide-x-reverse-transition"
                    open-on-hover
                  >
                    <template v-slot:activator>
                      <v-card
                        class="mx-4 my-6"
                        :elevation="item.Current ? '8' : '2'"
                      >
                        <v-row v-if="toggleViewMode == 1" class="mb-n6">
                          <v-spacer></v-spacer>
                          <v-col align="right">
                            <v-avatar
                              v-show="item.Current"
                              size="40"
                              class="mt-n5 mr-4 pl-1 select-database"
                            >
                              <v-icon x-large color="success"
                                >mdi-bookmark-check</v-icon
                              >
                            </v-avatar>
                            <v-hover
                              v-show="!item.Current"
                              v-slot="{ hover }"
                            >
                              <v-btn
                                @click="switch2Current(item.Id)"
                                class="mt-n5 mr-4 select-database"
                                :ripple="false"
                                text
                                icon
                              >
                                <v-icon
                                  x-large
                                  :color="hover ? 'success' : 'grey'"
                                  >{{
                                    hover
                                      ? "mdi-bookmark-check"
                                      : "mdi-bookmark"
                                  }}</v-icon
                                >
                              </v-btn>
                            </v-hover>
                          </v-col>
                        </v-row>
                        <v-row v-if="toggleViewMode == 1" class="mt-n10">
                          <v-col cols="10" class="mx-2 text-h5 overflow-x-hidden">
                            <span class="text-truncate"><v-icon class="mt-n1" v-if="item.Mode == 1">mdi-lock-outline</v-icon>{{ item.Name }}</span>
                          </v-col>
                        </v-row>
                        <v-row :class="toggleViewMode == 1 ? 'mt-n6' : null">
                          <v-col
                            :cols="toggleViewMode == 0 ? 4 : 12"
                            :class="toggleViewMode == 0 ? 'pr-0' : null"
                          >
                            <v-hover v-slot="{ hover }">
                              <v-card
                                @click="
                                  item.Current ? null : switch2Current(item.Id)
                                "
                                :ripple="false"
                                class="overflow-x-hidden select-database"
                                :height="toggleViewMode == 0 ? 200 : 224"
                                elevation="0"
                              >
                                <v-card-text class="justify-center">
                                  <v-img
                                    :class="getImageTransition(item.Current, hover)"
                                    width="168"
                                    height="168"
                                    :src="getAvatar(item.Type)"
                                  >
                                  </v-img>
                                </v-card-text>
                              </v-card>
                            </v-hover>
                          </v-col>
                          <v-col
                            v-if="toggleViewMode == 0"
                            cols="8"
                            class="pl-0"
                          >
                            <v-card height="200" elevation="0">
                              <v-row class="mb-n6">
                                <v-col align="right">
                                  <v-avatar
                                    v-show="item.Current"
                                    size="40"
                                    class="mt-n5 mr-4 pl-1 select-database"
                                  >
                                    <v-icon x-large color="success"
                                      >mdi-bookmark-check</v-icon
                                    >
                                  </v-avatar>
                                  <v-hover
                                    v-show="!item.Current"
                                    v-slot="{ hover }"
                                  >
                                    <v-btn
                                      @click="switch2Current(item.Id)"
                                      class="mt-n5 mr-4 select-database"
                                      :ripple="false"
                                      text
                                      icon
                                    >
                                      <v-icon
                                        x-large
                                        :color="hover ? 'success' : 'grey'"
                                        >{{
                                          hover
                                            ? "mdi-bookmark-check"
                                            : "mdi-bookmark"
                                        }}</v-icon
                                      >
                                    </v-btn>
                                  </v-hover>
                                </v-col>
                              </v-row>
                              <v-row class="mt-n10">
                                <v-col cols="10" class="mx-2 text-h5 overflow-x-hidden">
                                  <span class="text-truncate"><v-icon class="mt-n1" v-if="item.Mode == 1">mdi-lock-outline</v-icon>{{ item.Name }}</span>
                                </v-col>
                              </v-row>
                              <v-card-text>
                                <v-row>
                                  <v-col>
                                    <b>Host:</b> {{ item.Datasource }}
                                  </v-col>
                                  <v-col v-if="!!item.Port">
                                    <b>Port:</b> {{ item.Port }}
                                  </v-col>
                                  <v-col v-if="!!item.Database">
                                    <b>Database:</b> {{ item.Database }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col v-if="!!item.Username">
                                    <b>Username:</b> {{ item.Username }}
                                  </v-col>
                                  <v-col v-if="!!item.Password">
                                    <b>Password:</b> {{ item.Password }}
                                  </v-col>
                                  <v-spacer></v-spacer>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card>
                    </template>
                    <div class="ml-n14">
                      <div>
                        <v-btn
                          @click="editConnection(editMode.EDIT, item)"
                          color="primary"
                          small
                          fab
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </div>
                      <div>
                        <v-btn
                          @click="editConnection(editMode.DELETE, item)"
                          color="error"
                          small
                          fab
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-speed-dial>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn
            @click="editConnection(editMode.CREATE)"
            class="mb-14"
            color="success"
            dark
            absolute
            bottom
            left
            fab
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <edit-connection-vue
      :mode="mode"
      :data="item"
      v-model="showEdit"
      v-on:refresh="refreshConnections"
    ></edit-connection-vue>
  </v-container>
</template>

<script>
import EditConnectionVue from "../components/EditConnection.vue";
import "vuetify/lib/components/VBtnToggle";
export default {
  name: "connections",
  components: { EditConnectionVue },
  mounted() {
    window.initConnections = this.initConnections;
    window.switch2CurrentCallback = this.switch2CurrentCallback;
    window.chrome.webview.postMessage({
      api: "loadConnections",
      callback: "initConnections",
    });
  },
  methods: {
    initConnections(content) {
      this.records = JSON.parse(content);
    },
    editConnection(mode, item) {
      this.mode = mode;
      // if (this.item) {
      //   for(var key in this.item) {
      //     this.$set(this.item, key, item != null ? item[key] : null)
      //   }
      // } else {
      //   this.item = item
      // }
      this.item = Object.assign({}, item);
      this.showEdit = true;
    },
    refreshConnections() {
      window.chrome.webview.postMessage({
        api: "loadConnections",
        callback: "initConnections",
      });
    },
    getAvatar(type) {
      const dbType = this.dbTypes.filter((v) => v.value == type);
      return dbType.length > 0 ? dbType[0].icon : null;
    },
    switch2Current(id) {
      window.chrome.webview.postMessage({
        api: "switch2Current",
        callback: "switch2CurrentCallback",
        args: id,
      });
    },
    switch2CurrentCallback(content) {
      const result = JSON.parse(content);
      if (result.Success) {
        this.$toast.success(
          this.$t("message.switch").replace("{0}", this.$t("message.success")),
          { icon: "mdi-check-circle-outline" }
        );
        this.refreshConnections();
      } else {
        this.$toast.error(
          this.$t("message.switch").replace("{0}", this.$t("message.failed")),
          { icon: "mdi-close-circle-outline" }
        );
        console.error(result.Message);
      }
    },
    getImageTransition(current, hover) {
      if (this.toggleViewMode == 0) {
        return (current || hover) ? 'slideIn' : 'slideOut'
      } else {
        return (current || hover) ? 'blurIn' : 'blurOut'
      }
    }
  },
  computed: {
    getCreateBtnLabel() {
      return this.$t("label.editMode." + this.editMode.CREATE).replace(
        "{0}",
        this.$t("label.connection")
      );
    },
    getSearchLabel() {
      return this.$t("label.search");
    },
    getFilteredItems() {
      const filter = this.search;
      return filter
        ? this.records.filter((item) => {
            for (const key in item) {
              const value = item[key];
              if (value && value.toString().includes(filter)) {
                return true;
              }
            }
            return false;
          })
        : this.records;
    },
    getResponsiveColumns() {
      if (this.$vuetify.breakpoint.xl) {
        return 2
      } else if (this.$vuetify.breakpoint.lg) {
        return 2
      } else if (this.$vuetify.breakpoint.md) {
        return 3
      } else if (this.$vuetify.breakpoint.sm) {
        return 4
      } else {
        return 6
      }
    },
  },
  data() {
    return {
      showEdit: false,
      mode: "detail",
      toggleViewMode: 0, // 0: list 1: module
      item: null,
      search: "",
      dbTypes: [
        {
          label: "Oracle",
          value: 1,
          icon: require("@/assets/icons/database/oracle.svg"),
        },
        {
          label: "MySQL",
          value: 2,
          icon: require("@/assets/icons/database/mysql.svg"),
        },
        {
          label: "SQL Server",
          value: 3,
          icon: require("@/assets/icons/database/sqlserver.svg"),
        },
        {
          label: "PostgreSQL",
          value: 4,
          icon: require("@/assets/icons/database/postgresql.svg"),
        },
        {
          label: "SQLite",
          value: 5,
          icon: require("@/assets/icons/database/sqlite.svg"),
        },
      ],
      records: [],
    };
  },
};
</script>

<style scoped>
.select-database:before {
  background-color: transparent !important;
}
@keyframes slideOut {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-64px);
    filter: blur(2px) opacity(75%);
  }
}

@keyframes slideIn {
  0% {
    transform: translateX(-64px);
    filter: blur(2px) opacity(75%);
  }
  100% {
    transform: translateX(0px);
  }
}

@keyframes blurOut {
  0% {
    /* filter: blur(0px) opacity(100%); */
    transform: scale(1, 1);
  }
  100% {
    filter: blur(2px) opacity(75%);
    transform: scale(0.8, 0.8);
  }
}

@keyframes blurIn {
  0% {
    filter: blur(2px) opacity(75%);
    transform: scale(0.8, 0.8);
  }
  100% {
    /* filter: blur(0px) opacity(100%); */
    transform: scale(1, 1);
  }
}

.slideOut {
  animation: slideOut 0.4s ease-in-out both;
}

.slideIn {
  animation: slideIn 0.4s ease-in-out both;
}

.blurOut {
  animation: blurOut 0.3s ease-in-out both;
}

.blurIn {
  animation: blurIn 0.3s ease-in-out both;
}
</style>