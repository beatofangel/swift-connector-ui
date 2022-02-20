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
                    <v-fade-transition>
                      <v-btn
                        class="mt-n2"
                        v-show="toggleViewMode == ViewMode.LIST"
                        @click="showPassword = !showPassword"
                        v-bind="attrs"
                        v-on="on"
                        small
                        icon
                      >
                        <v-icon
                          :color="showPassword ? 'primary' : 'grey darken-2'"
                          >{{
                            showPassword ? "mdi-eye" : "mdi-eye-off"
                          }}</v-icon
                        >
                      </v-btn>
                    </v-fade-transition>
                  </template>
                  <span>{{
                    showPassword
                      ? $t("label.hidePassword")
                      : $t("label.showPassword")
                  }}</span>
                </v-tooltip>
                <v-fade-transition>
                  <v-divider
                    v-show="toggleViewMode == ViewMode.LIST"
                    class="mx-2 short-divider"
                    vertical
                  ></v-divider>
                </v-fade-transition>
                <v-menu
                  transition="scale-transition"
                  origin="center center"
                  :close-on-content-click="false"
                  offset-y
                >
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          class="mt-n2"
                          v-bind="attrs"
                          v-on="{ ...tooltip, ...menu }"
                          small
                          icon
                        >
                          <v-icon :color="sorts.filter(s => s.direction != 0).length > 0 ? 'primary' : 'grey darken-2'">mdi-sort</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("label.sort") }}</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-item @click="clearSortDirections">
                      <v-list-item-content>{{
                        $t("label.clear")
                      }}</v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item
                      v-for="(item, key, index) in getSortFields"
                      :key="index"
                      @click="toggleSortDirection(key)"
                    >
                      <v-list-item-content>{{
                        item.label
                      }}</v-list-item-content>
                      <v-list-item-action class="my-2">
                        <v-icon>{{ calcSortIcon(key, item.icon) }}</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-divider class="mx-2 short-divider" vertical></v-divider>
                <v-menu
                  transition="scale-transition"
                  origin="center center"
                  :close-on-content-click="false"
                  offset-y
                >
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          class="mt-n2"
                          v-bind="attrs"
                          v-on="{ ...tooltip, ...menu }"
                          small
                          icon
                        >
                          <v-icon
                            :color="
                              isDbTypeFiltered ? 'primary' : 'grey darken-2'
                            "
                            >{{
                              isDbTypeFiltered
                                ? "mdi-filter"
                                : "mdi-filter-outline"
                            }}</v-icon
                          >
                        </v-btn>
                      </template>
                      <span>{{ $t("label.filterDbType") }}</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-item @click="toggleSelectAllDbTypes">
                      <v-list-item-avatar style="min-width:30px;width:30px;height:30px;" tile>
                        <v-row class="ma-0 pa-0">
                          <v-col class="ma-0 pa-0" 
                          v-for="(dbDef, index) in DbDef"
                          :key="index">
                        <v-img
                          :alt="dbDef.label"
                          :src="dbDef.icon32"
                          class="d-flex ma-0 pa-0"
                          width="10"
                          height="10"
                        ></v-img>
                          </v-col>
                          <v-spacer></v-spacer>
                        </v-row>
                      </v-list-item-avatar>
                      <v-list-item-content>{{
                        $t("label.selectAll")
                      }}</v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox
                          :indeterminate="
                            isDbTypeFiltered && filterDbTypes.length != 0
                          "
                          :input-value="!isDbTypeFiltered"
                        >
                        </v-checkbox>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item
                      v-for="(def, index) in DbDef"
                      :key="index"
                      @click="toggleSelectDbType(def.value)"
                    >
                      <v-list-item-avatar size="30" tile>
                        <v-img :alt="def.label" :src="def.icon32"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>{{
                        def.label
                      }}</v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox
                          :input-value="!!filterDbTypes.includes(def.value)"
                        ></v-checkbox>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-divider class="mx-2 short-divider" vertical></v-divider>
                <v-btn-toggle class="mt-5" v-model="toggleViewMode" mandatory>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" small>
                        <v-icon>mdi-view-list</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t("label.listView") }}</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" small>
                        <v-icon>mdi-view-module</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t("label.moduleView") }}</span>
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
                  :cols="toggleViewMode == ViewMode.LIST ? 12 : getResponsiveColumns"
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
                        <div
                          v-if="item.Current && toggleViewMode == ViewMode.MODULE"
                          :class="`stamp-mini ${getMiniStampTransition(
                            item.current
                          )}`"
                        >
                          {{ $t("label.inUse") }}
                        </div>
                        <v-row v-if="toggleViewMode == ViewMode.MODULE" class="">
                          <v-col
                            cols="10"
                            class="mx-2 text-h5 overflow-x-hidden"
                            align="center"
                          >
                            <span class="text-truncate"
                              ><v-icon class="mt-n1" v-if="item.Mode == 1"
                                >mdi-lock-outline</v-icon
                              >{{ item.Name }}</span
                            >
                          </v-col>
                        </v-row>
                        <v-row :class="toggleViewMode == ViewMode.MODULE ? 'mt-n6' : null">
                          <v-col
                            :cols="toggleViewMode == ViewMode.LIST ? 4 : 12"
                            :class="toggleViewMode == ViewMode.LIST ? 'pr-0' : null"
                          >
                            <v-tooltip :disabled="item.Current" top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-hover v-slot="{ hover }">
                                  <v-card
                                    @click="
                                      item.Current
                                        ? null
                                        : switch2Current(item)
                                    "
                                    :ripple="false"
                                    class="overflow-x-hidden select-database"
                                    height="200"
                                    elevation="0"
                                    v-bind="attrs"
                                    v-on="on"
                                  >
                                    <v-card-text class="justify-center">
                                      <v-img
                                        :class="
                                          getImageTransition(
                                            item.Current,
                                            hover
                                          )
                                        "
                                        width="168"
                                        height="168"
                                        :src="getAvatar(item.Type)"
                                      >
                                      </v-img>
                                    </v-card-text>
                                  </v-card>
                                </v-hover>
                              </template>
                              <span>{{
                                $t("message.switch2Current").replace(
                                  "{0}",
                                  $t("label.connection").toLowerCase()
                                )
                              }}</span>
                            </v-tooltip>
                          </v-col>
                          <v-col
                            v-if="toggleViewMode == ViewMode.LIST"
                            cols="8"
                            class="pl-0"
                          >
                            <v-card height="200" elevation="0">
                              <div
                                v-if="item.Current"
                                :class="`stamp ${getStampTransition(
                                  item.current
                                )}`"
                              >
                                {{ $t("label.inUse") }}
                              </div>
                              <v-row class="">
                                <v-col
                                  cols="10"
                                  class="mx-2 text-h5 overflow-x-hidden"
                                >
                                  <span class="text-truncate"
                                    ><v-icon class="mt-n1" v-if="item.Mode == 1"
                                      >mdi-lock-outline</v-icon
                                    >{{ item.Name }}</span
                                  >
                                </v-col>
                              </v-row>
                              <v-card-text>
                                <v-row>
                                  <v-col>
                                    <b>{{ $t("label.host") }}:</b>
                                    {{ item.Datasource }}
                                  </v-col>
                                  <v-col v-if="!!item.Port">
                                    <b>{{ $t("label.port") }}:</b>
                                    {{ item.Port }}
                                  </v-col>
                                  <v-col v-if="!!item.Database">
                                    <b>{{ $t("label.databaseName") }}:</b>
                                    {{ item.Database }}
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col v-if="!!item.Username">
                                    <b>{{ $t("label.username") }}:</b>
                                    {{ item.Username }}
                                  </v-col>
                                  <v-col v-if="!!item.Password">
                                    <b>{{ $t("label.password") }}:</b>
                                    {{
                                      showPassword ? item.Password : "******"
                                    }}
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
                            @click="editConnection(EditMode.EDIT, item)"
                            color="primary"
                            small
                            fab
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ getEditBtnLabel }}</span>
                      </v-tooltip>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            @click="editConnection(EditMode.COPY, item)"
                            color="success"
                            small
                            fab
                          >
                            <v-icon>mdi-content-copy</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ getCopyBtnLabel }}</span>
                      </v-tooltip>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            @click="editConnection(EditMode.DELETE, item)"
                            color="error"
                            small
                            fab
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ getDeleteBtnLabel }}</span>
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
              @click="editConnection(EditMode.CREATE)"
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
          <span>{{ getCreateBtnLabel }}</span>
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
import { EditMode, ViewMode, DbDef } from "@/utils/enum"
export default {
  name: "connections",
  components: { EditConnectionVue },
  mounted() {
    window.loadConnectionsCallback = this.loadConnectionsCallback;
    window.switch2CurrentCallback = this.switch2CurrentCallback;
    this.refreshConnections();
  },
  methods: {
    loadConnectionsCallback(content) {
      const result = JSON.parse(content);
      if (result.Success) {
        this.records = result.Data;
      } else {
        this.$toast.error(this.$t(`message.loadingFailed`), {
          icon: "mdi-close-circle-outline",
        });
        console.error(result.Message);
      }
    },
    editConnection(mode, item) {
      this.mode = mode;
      this.item = Object.assign({}, item);
      if (this.mode == EditMode.COPY) {
        this.item.Id = null;
        this.item.Name = this.item.Name + " " + this.$t("label.aCopy");
        this.item.Current = false;
      }
      this.showEdit = true;
    },
    refreshConnections() {
      window.chrome.webview.postMessage({
        api: "loadConnections",
        callback: "loadConnectionsCallback",
      });
    },
    getAvatar(type) {
      const dbDef = this.DbDef.filter((def) => def.value == type);
      return dbDef.length > 0 ? dbDef[0].iconSvg : null;
    },
    getOperationLabel(operation) {
      return this.$t("label.editMode." + operation).replace(
        "{0}",
        this.$t("label.connection")
      );
    },
    switch2Current(item) {
      window.chrome.webview.postMessage({
        api: "switch2Current",
        callback: "switch2CurrentCallback",
        args: JSON.stringify(item),
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
      if (this.toggleViewMode == ViewMode.LIST) {
        return current || hover ? "slideIn" : "slideOut";
      } else {
        return current || hover ? "blurIn" : "blurOut";
      }
    },
    getStampTransition(current) {
      return current ? "" : "makeStamp";
    },
    getMiniStampTransition(current) {
      return current ? "" : "makeMiniStamp";
    },
    toggleSelectAllDbTypes() {
      if (this.isDbTypeFiltered) {
        this.filterDbTypes = this.DbDef.map((def) => def.value).slice();
      } else {
        this.filterDbTypes = [];
      }
    },
    toggleSelectDbType(value) {
      const idx = this.filterDbTypes.indexOf(value);
      if (idx == -1) {
        this.filterDbTypes.push(value);
      } else {
        this.filterDbTypes.splice(idx, 1);
      }
    },
    toggleSortDirection(value) {
      const fields = this.sorts.filter(sort => sort.field == value)
      if (fields.length == 0) {
        this.sorts.push({
          field: value,
          direction: 0
        })
      }
      this.sorts.forEach(sort => {
        if (sort.field == value) {
          sort.direction = (sort.direction + 1) % 3
        } else {
          sort.direction = 0
        }
      })
    },
    getSortDirection(value) {
      const fields = this.sorts.filter(sort => sort.field == value)
      if (fields.length > 0) {
        return fields[0].direction
      }
      return 0
    },
    calcSortIcon(field, iconTemplate) {
      const direction = this.getSortDirection(field)
      if (direction == 2) {
        return iconTemplate.replace('{0}', 'descending')
      } else if (direction == 1) {
        return iconTemplate.replace('{0}', 'ascending')
      } else {
        return ''
      }
    },
    clearSortDirections() {
      this.sorts.splice(0)
    }
  },
  computed: {
    getCreateBtnLabel() {
      return this.getOperationLabel("create")
    },
    getEditBtnLabel() {
      return this.getOperationLabel("edit")
    },
    getCopyBtnLabel() {
      return this.getOperationLabel("copy")
    },
    getDeleteBtnLabel() {
      return this.getOperationLabel("delete")
    },
    getSearchLabel() {
      return this.$t("label.search");
    },
    getFilteredItems() {
      const filter = this.search;
      
      const items = this.records.filter((item) => {
        const dbTypeMatched = this.filterDbTypes.includes(item.Type);
        if (dbTypeMatched) {
          if (filter) {
            for (const key in item) {
              const value = item[key];
              if (value && value.toString().includes(filter)) {
                return true;
              }
            }
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      }).sort((first, second) => {
        const fields = this.sorts.filter(sort => sort.direction > 0)
        if (fields.length > 0) {
          const field = fields[0].field
          const direction = fields[0].direction
          const firstVal = first[field]
          const secondVal = second[field]
          const isBool = typeof firstVal == 'boolean'
          if (direction == 1) { // ascending
            if (isBool) {
              return !firstVal || firstVal && secondVal ? -1 : 1
            }
            return firstVal < secondVal ? -1 : 1
          } else if (direction == 2) { // descending
            if (isBool) {
              return firstVal && !secondVal ? -1 : 1
            }
            return firstVal > secondVal ? -1 : 1
          }
        }
        return 0
      })

      return items
    },
    getResponsiveColumns() {
      if (this.$vuetify.breakpoint.xl) {
        return 2;
      } else if (this.$vuetify.breakpoint.lg) {
        return 2;
      } else if (this.$vuetify.breakpoint.md) {
        return 3;
      } else if (this.$vuetify.breakpoint.sm) {
        return 4;
      } else {
        return 6;
      }
    },
    isDbTypeFiltered() {
      return this.filterDbTypes.length < this.DbDef.length;
    },
    getSortFields() {
      const sortFields = {
        Current: { label: this.$t("label.inUse"), icon: 'mdi-sort-bool-{0}' },
        Type: { label: this.$t("label.databaseType"), icon: 'mdi-sort-numeric-{0}' },
        Name: { label: this.$t("label.connectionName"), icon: 'mdi-sort-alphabetical-{0}' },
        Datasource: { label: this.$t("label.host"), icon: 'mdi-sort-alphabetical-{0}' },
        Port: { label: this.$t("label.port"), icon: 'mdi-sort-numeric-{0}' },
        Database: { label: this.$t("label.databaseName"), icon: 'mdi-sort-alphabetical-{0}' },
        Mode: { label: this.$t("label.protectedMode"), icon: 'mdi-sort-numeric-{0}' },
        Username: { label: this.$t("label.username"), icon: 'mdi-sort-alphabetical-{0}' },
        Password: { label: this.$t("label.password"), icon: 'mdi-sort-alphabetical-{0}' },
        Lastchange: { label: this.$t("label.lastChange"), icon: 'mdi-sort-clock-{0}' },
      };
      return sortFields;
    },
  },
  data() {
    return {
      EditMode,
      DbDef,
      ViewMode,
      showEdit: false,
      mode: EditMode.DETAIL,
      toggleViewMode: ViewMode.MODULE, // 0: list 1: module
      showPassword: false,
      item: null,
      search: "",
      // filterDbTypes: [1, 2, 3, 4, 5],
      filterDbTypes: DbDef.map(def => def.value),
      sorts: [], // direction 0: n/a 1: ascending 2: descending; field
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
  background-clip: text;
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
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>