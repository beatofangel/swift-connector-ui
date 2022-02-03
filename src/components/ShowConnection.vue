<template>
  <v-row>
    <v-col>
      <v-card class="overflow-y-auto" max-height="calc(100vh - 24px)">
        <v-card class="mx-4" v-for="item in items" :key="item.Id">
          <v-row class="my-4">
            <v-col cols="4" class="pr-0">
              <v-card class="overflow-x-hidden" height="200" elevation="0">
                <v-img class="ml-n16" width="200" height="200" :src="getAvatar(item.Type)">
                </v-img>
              </v-card>
            </v-col>
            <v-col cols="8" class="pl-0">
              <v-card height="200" elevation="0">
                <v-card-title class="text-h5" v-text="item.Name"></v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      Host: {{ item.Datasource }}
                    </v-col>
                    <v-col>
                      Port: {{ item.Port}}
                    </v-col>
                    <v-col>
                      Database: {{ item.Database }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Username: {{ item.Username}}
                    </v-col>
                    <v-col>
                      Password: {{ item.Password}}
                    </v-col>
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
// function Connection() {
//   this.Id = ''
//   this.Type = 0
//   this.Name = ''
//   this.Datasource = ''
//   this.Port = ''
//   this.Database = ''
//   this.Mode = 0
//   this.Current = ''
//   this.Username = ''
//   this.Password = ''
//   this.Lastchange = ''
// }

export default {
  name: "show-connection",
  props: {
    items: Array,
  },
  methods: {
    getAvatar(type) {
      const dbType = this.dbTypes.filter((v) => v.value == type);
      return dbType.length > 0 ? dbType[0].icon : null;
    },
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