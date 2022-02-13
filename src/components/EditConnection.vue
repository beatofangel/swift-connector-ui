<template>
  <v-dialog v-model="toggleShow" max-width="600">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-card>
          <v-toolbar>
            <v-img :src="getBackgroundImage" max-width="400px" class="background"></v-img>
            <v-icon>{{ getIcon }}</v-icon>
            <span class="mt-1">{{ getTitle }}</span>
            <v-spacer></v-spacer>
            <v-btn @click="onClose" fab plain x-small>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title>
            <v-subheader>{{ getHint }}</v-subheader>
          </v-card-title>
          <v-card-text>
            <v-row class="my-0">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.databaseType')"
                  :rules="getRules.databaseType"
                  v-slot="{ errors }"
                >
                  <v-select
                    v-model="formData.databaseType"
                    :disabled="mode != editMode.CREATE && mode != editMode.COPY"
                    :items="dbTypes"
                    :menu-props="{ bottom: true, offsetY: true }"
                    :label="$t('label.databaseType')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.databaseType')"
                    outlined
                    dense
                  >
                    <template v-slot:selection="{ item }">
                      <v-img
                        class="ml-2"
                        max-width="32"
                        :src="item.icon"
                      ></v-img
                      ><span class="ml-2">{{ item.label }}</span>
                    </template>
                    <template v-slot:item="{ item }">
                      <v-img max-width="32" :src="item.icon"></v-img
                      ><span class="ml-2">{{ item.label }}</span>
                    </template>
                  </v-select>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.connectionName')"
                  :rules="getRules.connectionName"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.connectionName"
                    :disabled="mode == editMode.DELETE || mode == editMode.DETAIL"
                    :label="$t('label.connectionName')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.connectionName')"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.host')"
                  :rules="getRules.host"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.host"
                    :disabled="mode == editMode.DELETE || mode == editMode.DETAIL"
                    :label="$t('label.host')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.host')"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0" v-show="formData.databaseType != 5">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.port')"
                  :rules="getRules.port"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.port"
                    :disabled="mode == editMode.DELETE || mode == editMode.DETAIL"
                    :label="$t('label.port')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.port')"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0" v-show="formData.databaseType != 5">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.databaseName')"
                  :rules="getRules.databaseName"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.databaseName"
                    :disabled="mode == editMode.DELETE || mode == editMode.DETAIL"
                    :label="$t('label.databaseName')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.databaseName')"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0" v-show="formData.databaseType != 5">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.username')"
                  :rules="getRules.username"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.username"
                    :disabled="mode == editMode.DELETE || mode == editMode.DETAIL"
                    :label="$t('label.username')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.username')"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.password')"
                  :rules="getRules.password"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.password"
                    :disabled="mode == editMode.DELETE || mode == editMode.DETAIL"
                    :label="$t('label.password')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.password')"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dense
                  >
                    <template v-slot:append>
                      <v-icon :color="showPassword ? 'primary' : 'grey darken-2'" @click="updateShowPassword =! showPassword">
                        {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                      </v-icon>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col class="py-0">
                <v-switch
                  v-model="formData.protected"
                  :disabled="mode == editMode.DELETE || mode == editMode.DETAIL"
                  class="mx-3"
                  inset
                  :false-value="protectedMode.NORMAL"
                  :true-value="protectedMode.PROTECTED"
                  :label="$t(`label.${formData.protected == protectedMode.PROTECTED ? 'protected' : 'normal'}Mode`)"
                ></v-switch>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn @click="onTestConnection" icon="mdi-connection" color="secondary">{{ $t('label.testConnection') }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="onClose" text>{{ $t('label.cancel') }}</v-btn>
            <v-btn v-if="mode && mode != editMode.DETAIL" type="submit" :disabled="invalid" color="primary">{{ $t('label.ok') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </validation-observer>
  </v-dialog>
</template>

<script>
export default {
  name: "edit-connection",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    data: {
      Id: String,
      Type: Number,
      Name: String,
      Datasource: String,
      Port: String,
      Database: String,
      Mode: Number,
      Current: Boolean,
      Username: String,
      Password: String,
      Lastchange: Date
    },
    mode: String,
    showPassword: Boolean
  },
  mounted() {
    window.editConnectionCallback = this.editConnectionCallback
  },
  watch: {
    data: {
      deep: true,
      handler(newValue) {
        if (newValue) {
          this.formData.id = newValue.Id
          this.formData.databaseType = newValue.Type
          this.formData.connectionName = newValue.Name
          this.formData.host = newValue.Datasource
          this.formData.port = newValue.Port
          this.formData.databaseName = newValue.Database
          this.formData.protected = newValue.Mode
          this.formData.current = newValue.Current
          this.formData.username = newValue.Username
          this.formData.password = newValue.Password
          this.formData.lastChange = newValue.Lastchange
        } else {
          this.formData.id = null
          this.formData.databaseType = null
          this.formData.connectionName = null
          this.formData.host = null
          this.formData.port = null
          this.formData.databaseName = null
          this.formData.protected = 0
          this.formData.current = false
          this.formData.username = null
          this.formData.password = null
          this.formData.lastChange = null
        }
      }
    }
  },
  computed: {
    toggleShow: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
    updateShowPassword: {
      get: function () {
        return this.showPassword;
      },
      set: function (newValue) {
        this.$emit("update:showPassword", newValue);
      },
    },
    getIcon() {
      // detail
      let icon = "mdi-file-document-box";
      switch (this.mode) {
        case this.editMode.DELETE:
          // delete
          icon = "mdi-delete";
          break;
        case this.editMode.EDIT:
          // edit
          icon = "mdi-pencil";
          break;
        case this.editMode.COPY:
          icon = "mdi-content-copy";
          break;
        case this.editMode.CREATE:
          // add
          icon = "mdi-plus";
          break;
        default:
      }
      return icon;
    },
    getTitle() {
      return this.$t(`label.editMode.${this.mode}`).replace(
        "{0}",
        this.$t("label.connection")
      );
    },
    getAlternativeMode() {
      return this.mode == this.editMode.COPY ? this.editMode.CREATE : this.mode;
    },
    getHint() {
      return this.$t(`message.hint.connection.${this.getAlternativeMode}`);
    },
    getRules() {
      if (this.formData.databaseType) {
        return this.rules[this.formData.databaseType - 1]
      } else {
        return { 
          databaseType: { required: true },
          connectionName: { required: true },
          host: {  },
          port: { numeric: true, between: [1024, 49151] },
          databaseName: { alpha_num: true },
          username: { alpha_num: true },
          password: {  }
        }
      }
    },
    getBackgroundImage() {
      if (this.formData && this.formData.databaseType > 0) {
        return this.dbTypeBackgrounds[this.formData.databaseType - 1]
      }
      return ''
    }
  },
  methods: {
    onClose() {
      this.toggleShow = false
      // this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    onTestConnection() {
      this.$refs.observer.validate().then(isValid => {
        if (isValid) {
          window.chrome.webview.postMessage({
            api: 'testConnection',
            callback: 'editConnectionCallback',
            args: JSON.stringify(this.formData)
          })
        }
      })
    },
    onSubmit() {
      switch (this.mode) {
        case this.editMode.CREATE:
        case this.editMode.COPY:
          this.$refs.observer.validate().then(isValid => {
            if (isValid) {
              window.chrome.webview.postMessage({
                api: 'addConnection',
                callback: 'editConnectionCallback',
                args: JSON.stringify(this.formData)
              })
            }
          })
          break;
        case this.editMode.EDIT:
          this.$refs.observer.validate().then(isValid => {
            if (isValid) {
              window.chrome.webview.postMessage({
                api: 'editConnection',
                callback: 'editConnectionCallback',
                args: JSON.stringify(this.formData)
              })
            }
          })
          break;
        case this.editMode.DELETE:
          window.chrome.webview.postMessage({
            api: 'deleteConnection',
            callback: 'editConnectionCallback',
            args: JSON.stringify(this.formData)
          })
          break;
        default:
      }
    },
    editConnectionCallback(content) {
      const result = JSON.parse(content)
      if (result.Success) {
        if (result.Api == 'testConnection') {
          this.$toast.success(this.$t('message.success'), { icon: 'mdi-check-circle-outline' })
        } else {
          this.$toast.success(this.$t(`label.editMode.${this.getAlternativeMode}`).replace('{0}', this.$t('message.success')), { icon: 'mdi-check-circle-outline' })
          this.$emit('refresh')
          this.onClose()
        }
      } else {
        if (result.Api == 'testConnection') {
          this.$toast.error(result.Message, { icon: 'mdi-close-circle-outline' })
        } else {
          this.$toast.error(this.$t(`label.editMode.${this.getAlternativeMode}`).replace('{0}', this.$t('message.failed')), { icon: 'mdi-close-circle-outline' })
        }
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
          icon: require("@/assets/icons/database/oracle_mini_32.png"),
        },
        {
          label: "MySQL",
          value: 2,
          icon: require("@/assets/icons/database/mysql_mini_32.png"),
        },
        {
          label: "SQL Server",
          value: 3,
          icon: require("@/assets/icons/database/sqlserver_mini_32.png"),
        },
        {
          label: "PostgreSQL",
          value: 4,
          icon: require("@/assets/icons/database/postgresql_mini_32.png"),
        },
        {
          label: "SQLite",
          value: 5,
          icon: require("@/assets/icons/database/sqlite_mini_32.png"),
        },
      ],
      dbTypeBackgrounds: [
        require("@/assets/icons/database/oracle.svg"),
        require("@/assets/icons/database/mysql.svg"),
        require("@/assets/icons/database/sqlserver.svg"),
        require("@/assets/icons/database/postgresql.svg"),
        require("@/assets/icons/database/sqlite.svg"),
      ],
      rules: 
        [{
          databaseType: { required: true },
          connectionName: { required: true },
          host: { required: true },
          port: { required: true, numeric: true, between: [1024, 49151] },
          databaseName: { required: true, alpha_num: true },
          username: { required: true, alpha_num: true },
          password: { required: true }
        },
        {
          databaseType: { required: true },
          connectionName: { required: true },
          host: { required: true },
          port: { required: true, numeric: true, between: [1024, 49151] },
          databaseName: { required: true, alpha_num: true },
          username: { required: true, alpha_num: true },
          password: { required: true }
        },
        {
          databaseType: { required: true },
          connectionName: { required: true },
          host: { required: true },
          port: { required: true, numeric: true, between: [1024, 49151] },
          databaseName: { required: true, alpha_num: true },
          username: { required: true, alpha_num: true },
          password: { required: true }
        },
        {
          databaseType: { required: true },
          connectionName: { required: true },
          host: { required: true },
          port: { required: true, numeric: true, between: [1024, 49151] },
          databaseName: { required: true, alpha_num: true },
          username: { required: true, alpha_num: true },
          password: { required: true }
        },
        {
          databaseType: { required: true },
          connectionName: { required: true },
          host: { required: true },
          port: {  },
          databaseName: {  },
          username: {  },
          password: {  }
        }]
      ,
      formData: {
        id: null,
        databaseType: null,
        connectionName: null,
        host: null,
        port: null,
        databaseName: null,
        username: null,
        password: null,
        protected: 0,
        current: false,
        lastChange: null,
      },
      isValidConnection: null
    };
  },
};
</script>

<style scoped>
.background {
  position: absolute;
  left: 160px;
  top: 0px;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  filter: blur(6px);
}
</style>