<template>
  <v-container class="mt-6">
    <v-row>
      <v-col>
        <v-card height="500">
          <v-card-title>
            <span>{{ $t("label.home") }}</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="text-center">
                <v-btn
                  color="blue-grey"
                  href="https://github.com/beatofangel/SwiftConnector/raw/master/SwiftConnector/publish/setup.exe"
                  dark
                  >Download Swift Connector</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
};
</script>
