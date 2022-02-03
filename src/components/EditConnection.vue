<template>
  <v-dialog v-model="toggleShow" max-width="600">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-card>
          <v-toolbar>
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
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-select
                    v-model="formData.databaseType"
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
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.connectionName"
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
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.host"
                    :label="$t('label.host')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.host')"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.port')"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.port"
                    :label="$t('label.port')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.port')"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.databaseName')"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.databaseName"
                    :label="$t('label.databaseName')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.databaseName')"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col class="py-0">
                <validation-provider
                  :name="$t('label.username')"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.username"
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
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="formData.password"
                    :label="$t('label.password')"
                    :error-messages="errors[0]"
                    :placeholder="$t('message.ph.password')"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dense
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row class="my-0">
              <v-col class="py-0">
                <v-switch
                  v-model="formData.protected"
                  class="mx-3"
                  inset
                  :false-value="protectedMode.NORMAL"
                  :true-value="protectedMode.PROTECTED"
                  :label="$t(`label.${formData.protected == protectedMode.PROTECTED ? 'protected' : 'normal'}Mode`)"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="onClose" text>Cancel</v-btn>
            <v-btn type="submit" :disabled="invalid" color="primary">OK</v-btn>
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
    mode: String,
  },
  mounted() {
    window.addConnectionCallback = this.addConnectionCallback
  },
  methods: {
    onClose() {
      this.toggleShow = false
      this.$refs.form.reset ()
      this.$refs.observer.reset()
    },
    onSubmit() {
      this.$refs.observer.validate().then(isValid => {
        if (isValid) {
          window.chrome.webview.postMessage({
            api: 'addConnection',
            callback: 'addConnectionCallback',
            args: JSON.stringify(this.formData)
          })
        }
      })
    },
    addConnectionCallback(result) {
      if (result.success) {
        this.onClose()
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
    getIcon() {
      // detail
      let icon = "mdi-file-document-box";
      switch (this.mode) {
        case this.editMode.DELETE:
          // delete
          icon = "mdi-close";
          break;
        case this.editMode.EDIT:
          // edit
          icon = "mdi-pencil";
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
    getHint() {
      return this.$t(`message.hint.connection.${this.mode}`);
    },
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
      showPassword: false,
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
      },
    };
  },
};
</script>