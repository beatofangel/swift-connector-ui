<template>
  <v-container class="mt-6">
    <v-row>
      <v-col>
        <v-card max-height="calc(100vh - 48px)">
          <v-card-title class="py-2">
            <v-row class="d-flex mx-2 my-0" dense>
              <v-col cols="6">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="getSearchLabel"
                  single-line
                  clearable
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="6" align="right">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-slide-x-transition>
                      <v-btn class="mt-n2" v-show="toggleViewMode == 0" @click="showPassword = !showPassword" v-bind="attrs" v-on="on" small icon>
                        <v-icon :color="showPassword ? 'primary' : 'grey darken-2'">{{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                      </v-btn>
                    </v-slide-x-transition>
                  </template>
                  <span>{{ showPassword ? $t('label.hidePassword') : $t('label.showPassword') }}</span>
                </v-tooltip>
                <v-fade-transition>
                  <v-divider v-show="toggleViewMode == 0" class="mx-2 short-divider" vertical></v-divider>
                </v-fade-transition>
                <v-btn-toggle class="mt-5" v-model="toggleViewMode" mandatory>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" small>
                        <v-icon>mdi-view-list</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('label.listView') }}</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" small>
                        <v-icon>mdi-view-module</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('label.moduleView') }}</span>
                  </v-tooltip>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card
            class="overflow-y-auto overflow-x-hidden"
            elevation="0"
            max-height="calc(100vh - 118px)"
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
                        <div v-if="item.Current && toggleViewMode == 1" :class="`stamp-mini ${getMiniStampTransition(item.current)}`">{{ $t('label.inUse') }}</div>
                        <v-row v-if="toggleViewMode == 1" class="">
                          <v-col cols="10" class="mx-2 text-h5 overflow-x-hidden" align="center">
                            <span class="text-truncate"><v-icon class="mt-n1" v-if="item.Mode == 1">mdi-lock-outline</v-icon>{{ item.Name }}</span>
                          </v-col>
                        </v-row>
                        <v-row :class="toggleViewMode == 1 ? 'mt-n6' : null">
                          <v-col
                            :cols="toggleViewMode == 0 ? 4 : 12"
                            :class="toggleViewMode == 0 ? 'pr-0' : null"
                          >
                          <v-tooltip :disabled="item.Current" top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-hover v-slot="{ hover }">
                                <v-card
                                  @click="
                                    item.Current ? null : switch2Current(item.Id)
                                  "
                                  :ripple="false"
                                  class="overflow-x-hidden select-database"
                                  height="200"
                                  elevation="0"
                                  v-bind="attrs" v-on="on"
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
                            </template>
                            <span>{{ $t('message.switch2Current').replace('{0}', $t('label.connection').toLowerCase()) }}</span>
                          </v-tooltip>
                          </v-col>
                          <v-col
                            v-if="toggleViewMode == 0"
                            cols="8"
                            class="pl-0"
                          >
                            <v-card height="200" elevation="0">
                              <div v-if="item.Current" :class="`stamp ${getStampTransition(item.current)}`">{{ $t('label.inUse') }}</div>
                              <v-row class="">
                                <v-col cols="10" class="mx-2 text-h5 overflow-x-hidden">
                                  <span class="text-truncate"><v-icon class="mt-n1" v-if="item.Mode == 1">mdi-lock-outline</v-icon>{{ item.Name }}</span>
                                </v-col>
                              </v-row>
                              <v-card-text>
                                <v-row>
                                  <v-col>
                                    <b>{{ $t('label.host') }}:</b> {{ item.Datasource }}
                                  </v-col>
                                  <v-col v-if="!!item.Port">
                                    <b>{{ $t('label.port') }}:</b> {{ item.Port }}
                                  </v-col>
                                  <v-col v-if="!!item.Database">
                                    <b>{{ $t('label.databaseName') }}:</b> {{ item.Database }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col v-if="!!item.Username">
                                    <b>{{ $t('label.username') }}:</b> {{ item.Username }}
                                  </v-col>
                                  <v-col v-if="!!item.Password">
                                    <b>{{ $t('label.password') }}:</b> {{ showPassword ? item.Password : '******' }}
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
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            @click="editConnection(editMode.EDIT, item)"
                            color="primary"
                            small
                            fab
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('label.edit') }}</span>
                      </v-tooltip>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            @click="editConnection(editMode.CREATE, item)"
                            color="success"
                            small
                            fab
                          >
                            <v-icon>mdi-content-copy</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('label.copy') }}</span>
                      </v-tooltip>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            @click="editConnection(editMode.DELETE, item)"
                            color="error"
                            small
                            fab
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('label.delete') }}</span>
                      </v-tooltip>
                    </div>
                  </v-speed-dial>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
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
            </template>
            <span>{{ $t('label.create') }}</span>
          </v-tooltip>
      </v-col>
    </v-row>
    <edit-connection-vue
      :mode="mode"
      :data="item"
      :showPassword.sync="showPassword"
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
      this.item = Object.assign({}, item);
      if (this.mode == this.editMode.CREATE && item != null) {
        this.item.Id = null
        this.item.Name = this.item.Name + " " + this.$t('label.aCopy')
        this.item.Current = false
      }
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
    },
    getStampTransition(current) {
      return current ? '' : 'makeStamp'
    },
    getMiniStampTransition(current) {
      return current ? '' : 'makeMiniStamp'
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
      showPassword: false,
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
.v-divider--vertical.short-divider {
  height: 24px;
  min-height: 24px;
}

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

.slideOut {
  animation: slideOut 0.4s ease-in-out both;
}

.slideIn {
  animation: slideIn 0.4s ease-in-out both;
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

.blurOut {
  animation: blurOut 0.3s ease-in-out both;
}

.blurIn {
  animation: blurIn 0.3s ease-in-out both;
}

@keyframes makeStamp {
  0% {
    filter: blur(2px) opacity(0%);
    transform: scale(3, 3) rotate(30deg);
  }
  100% {
    filter: blur(0.5px) opacity(80%);
    transform: scale(1, 1) rotate(30deg);
  }
}

.makeStamp {
  animation: makeStamp 0.3s ease-in-out both;
}

@keyframes makeMiniStamp {
  0% {
    filter: blur(2px) opacity(0%);
    transform: scale(2, 2) rotate(30deg);
    z-index: 1;
  }
  100% {
    filter: blur(0.5px) opacity(80%);
    transform: scale(1, 1) rotate(30deg);
    z-index: 1;
  }
  to {
    filter: blur(0.5px) opacity(80%);
    transform: scale(1, 1) rotate(30deg);
  }
}

.makeMiniStamp {
  animation: makeMiniStamp 0.3s ease-in-out both;
}

.stamp {
	display: inline-block;
	border-radius: 20px;
	border-width: 6px;
	border-color: #ef3e42;
	border-style: solid;
	color: #ef3e42;
	text-transform: uppercase;
	margin: 0 auto;
	font-size: 30px;
  font-weight: 700;
	letter-spacing: 0px;
	padding: 5px 15px;
  position: absolute;
  right: -5px;
  top: 15px;
	
	border-image: url(../assets/stamp-texture.png) 30;
  background: url(../assets/stamp-texture.png) no-repeat center center;
  background-size: cover;
  background-clip:text;
  -webkit-text-fill-color: transparent;
}

.stamp-mini {
	display: inline-block;
	border-radius: 20px;
	border-width: 4px;
	border-color: #ef3e42;
	border-style: solid;
	color: #ef3e42;
	text-transform: uppercase;
	margin: 0 auto;
	font-size: 18px;
  font-weight: 700;
	letter-spacing: 0px;
	padding: 0px 8px;
  position: absolute;
  right: -5px;
  top: 3px;
	
	border-image: url(../assets/stamp-texture.png) 30;
  background: url(../assets/stamp-texture.png) no-repeat center center;
  background-size: cover;
  background-clip:text;
  -webkit-text-fill-color: transparent;
}

</style>