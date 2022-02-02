<template>

  <v-container>
    <v-row>
      <v-col>
          <v-card
            class="overflow-y-auto"
            max-height="calc(100vh - 24px)"
          >
            <v-skeleton-loader
              v-bind="attrs"
              type="card-heading,divider,table-heading,divider,list-item-three-line@2,table-heading,divider,list-item-three-line"
            >
              <v-card-text>
                  <markdown-it-vue class="md-body" :content="content" />
              </v-card-text>
            </v-skeleton-loader>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
export default {
  name: 'change-log',
  components: {
    MarkdownItVue
  },
  mounted() {
    window.initChangeLog = this.initChangeLog
    window.chrome.webview.postMessage({
      api: 'loadChangeLog',
      callback: 'initChangeLog'
    })
  },
  methods: {
    initChangeLog(content) {
      this.content = content
      this.$nextTick(()=>{
        this.attrs.loading = false
      })
    }
  },
  data() {
    return {
      content: this.$t("message.loading"),
      attrs: {
        class: 'mb-6',
        loading: true,
        elevation: 0,
      },
    }
  }
}
</script>

<style>
</style>