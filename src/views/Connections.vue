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
    <v-row>
      <v-col>
        <show-connection-vue :items="records"></show-connection-vue>
      </v-col>
    </v-row>
    <edit-connection-vue :mode="mode" v-model="showEdit"></edit-connection-vue>
  </v-container>
</template>

<script>
import EditConnectionVue from '../components/EditConnection.vue';
import ShowConnectionVue from '../components/ShowConnection.vue';
export default {
  name: 'connections',
  components: { EditConnectionVue, ShowConnectionVue },
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
          text: "Type",
          align: "start",
          sortable: true,
          value: "Type",
        },
        {
          text: "Port",
          align: "start",
          sortable: true,
          value: "Port",
        },
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "Name",
        },
        {
          text: "Datasource",
          align: "start",
          sortable: true,
          value: "Datasource",
        },
        {
          text: "Database",
          align: "start",
          sortable: true,
          value: "Database",
        },
        {
          text: "Username",
          align: "start",
          sortable: true,
          value: "Username",
        },
        {
          text: "Password",
          align: "start",
          sortable: true,
          value: "Password",
          filterable: false,
        },
        {
          text: "Lastchange",
          align: "start",
          sortable: true,
          value: "Lastchange",
        },
        {
          text: "Mode",
          align: "start",
          sortable: true,
          value: "Mode",
        },
      ],
      records: [
        {
          type: "Oracle",
          port: 1521,
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