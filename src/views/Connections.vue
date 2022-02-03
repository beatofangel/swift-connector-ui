<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="overflow-y-auto" max-height="calc(100vh - 24px)">
          <v-skeleton-loader v-bind="attrs" type="table">
            <v-card-title class="d-flex justify-space-between">
              <v-row>
                <v-col cols="4">
                  <v-btn @click="editConnection(editMode.CREATE)" color="green" class="mt-3" dark>
                    {{ getCreateBtnLabel }}<v-icon right>mdi-file-document</v-icon>
                  </v-btn>
                </v-col>
                <v-spacer/>
                <v-col cols="4">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    :label="getSearchLabel"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="records"
                :search="search"
                :items-per-page="5"
                class="elevation-1"
                >
              </v-data-table>
            </v-card-text>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <edit-connection-vue :mode="mode" v-model="showEdit"></edit-connection-vue>
  </v-container>
</template>

<script>
import EditConnectionVue from '../components/EditConnection.vue';
export default {
  name: 'connections',
  components: { EditConnectionVue },
  mounted() {
    window.initConnections = this.initConnections
    window.chrome.webview.postMessage({
      api: 'loadConnections',
      callback: 'initConnections'
    })
  },
  methods: {
    initConnections(content) {
      this.records = JSON.parse(content)
      this.$nextTick(()=>{
        this.attrs.loading = false
      })
    },
    editConnection(mode) {
      this.mode = mode
      this.showEdit = true
    }
  },
  computed: {
    getCreateBtnLabel() {
      return this.$t('label.editMode.' + this.editMode.CREATE).replace('{0}', this.$t('label.connection'))
    },
    getSearchLabel() {
      return this.$t('label.search')
    }
  },
  data() {
    return {
      showEdit: false,
      mode: 'detail',
      search: '',
      headers: [
        {
          text: "type",
          align: "start",
          sortable: true,
          value: "type",
        },
        {
          text: "port",
          align: "start",
          sortable: true,
          value: "port",
        },
        {
          text: "sid",
          align: "start",
          sortable: true,
          value: "sid",
        },
        {
          text: "name",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "datasource",
          align: "start",
          sortable: true,
          value: "datasource",
        },
        {
          text: "database",
          align: "start",
          sortable: true,
          value: "database",
        },
        {
          text: "username",
          align: "start",
          sortable: true,
          value: "username",
        },
        {
          text: "password",
          align: "start",
          sortable: true,
          value: "password",
          filterable: false,
        },
        {
          text: "lastchange",
          align: "start",
          sortable: true,
          value: "lastchange",
        },
        {
          text: "mode",
          align: "start",
          sortable: true,
          value: "mode",
        },
      ],
      records: [
        {
          type: "Oracle",
          port: 1521,
          sid: "xepdb1",
          name: "test-conn1",
          datasource: "localhost",
          database: null,
          username: "swiftoracle",
          password: "swiftoracle",
          lastchange: "2021/12/24 12:31:56",
          mode: 0,
        },
        {
          type: "MySQL",
          port: 3306,
          sid: null,
          name: "test-conn2",
          datasource: "localhost",
          database: "myConn1",
          username: "swiftoracle",
          password: "swiftoracle",
          lastchange: "2021/12/24 12:31:56",
          mode: 0,
        },
      ],
      attrs: {
        class: 'mb-6',
        loading: true,
        elevation: 0,
      },
    };
  },
};
</script>