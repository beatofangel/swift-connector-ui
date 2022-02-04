<template>
  <v-row>
    <v-col>
      <v-card class="overflow-y-auto" max-height="calc(100vh - 24px)">
        <v-card class="mx-4" v-for="item in getFilteredItems" :key="item.Id">
          <v-row class="my-4">
            <v-col cols="4" class="pr-0">
              <v-hover v-slot="{ hover }">
                <v-card @click="item.Current == 1 ? null : switch2Current(item.Id)" :ripple="false" class="overflow-x-hidden select-database" height="200" elevation="0">
                  <v-card-text class="justify-center">
                    <v-img
                      :class="`${item.Current == 1 || hover ? 'slideIn' : 'slideOut'}`"
                      width="168"
                      height="168"
                      :src="getAvatar(item.Type)"
                    >
                    </v-img>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col cols="8" class="pl-0">
              <v-card height="200" elevation="0">
                <v-card-title class="text-h5">
                  {{ item.Name }}
                  <v-spacer />
                  <v-avatar
                    v-show="item.Current == 1"
                    size="40"
                    class="mt-n16 pl-1 select-database"
                  >
                    <v-icon x-large color="primary">mdi-bookmark-check</v-icon>
                  </v-avatar>
                  <v-hover
                    v-show="item.Current != 1"
                    v-slot="{ hover }"
                  >
                    <v-btn
                      @click="switch2Current(item.Id)"
                      class="mt-n16 select-database"
                      :ripple="false"
                      text
                      icon
                    >
                      <v-icon x-large :color="hover ? 'primary' : 'grey'">{{
                        hover ? "mdi-bookmark-check" : "mdi-bookmark"
                      }}</v-icon>
                    </v-btn>
                  </v-hover>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col> <b>Host:</b> {{ item.Datasource }} </v-col>
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
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "show-connection",
  props: {
    filter: String,
    items: Array,
  },
  mounted() {
    window.switch2CurrentCallback = this.switch2CurrentCallback
  },
  computed: {
    getFilteredItems() {
      const filter = this.filter
      return filter ? this.items.filter(item => {
        for (const key in item) {
          const value = item[key]
          if (value && value.toString().includes(filter)) {
            return true
          }
        }
        return false
      }) : this.items
    }
  },
  methods: {
    getAvatar(type) {
      const dbType = this.dbTypes.filter(v => v.value == type);
      return dbType.length > 0 ? dbType[0].icon : null;
    },
    switch2Current(id) {
      window.chrome.webview.postMessage({
        api: 'switch2Current',
        callback: 'switch2CurrentCallback',
        args: id
      })
    },
    switch2CurrentCallback(content) {
      const result = JSON.parse(content)
      if (result.Success) {
        this.$toast.success(this.$t('message.switch').replace('{0}', this.$t('message.success')), { icon: 'mdi-check-circle-outline' })
        this.$emit('refresh')
      } else {
        this.$toast.error(this.$t('message.switch').replace('{0}', this.$t('message.failed')), { icon: 'mdi-close-circle-outline' })
        console.error(result.Message)
      }
    }
  },
  data() {
    return {
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
    };
  },
};
</script>

<style scoped>
.select-database:before {
  background-color: transparent !important;
}
@keyframes slideOut { 
  0% { transform: translateX(0px); }
  100% { transform: translateX(-64px); filter: blur(2px) opacity(75%); }
}

@keyframes slideIn {
  0% { transform: translateX(-64px); filter: blur(2px) opacity(75%); }
  100% { transform: translateX(0px); }
}

.slideOut {
  animation: slideOut 0.5s ease-in-out both;
}

.slideIn {
  animation: slideIn 0.5s ease-in-out both;
}

</style>