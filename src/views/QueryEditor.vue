<template>
  <v-container class="mt-6">
    <v-row>
      <v-col>
        <v-card max-height="calc(100vh - 48px)">
          <v-card-title class="py-2" dense>
            <v-row>
              <v-col>
                <v-skeleton-loader v-bind="attrs" class="d-inline-flex" width="32" height="32" type="avatar">
                  <v-avatar size="32px" tile>
                    <v-img
                      v-if="!attrs.loading"
                      max-width="32"
                      :src="dbType.icon32"
                    ></v-img
                    ></v-avatar
                  >
                </v-skeleton-loader>
                <v-btn
                  @click="beautify()"
                  :disabled="
                    editor && editor.state && editor.state.doc.length == 0
                  "
                  icon
                  small
                  ><v-icon>mdi-brush-variant</v-icon></v-btn
                >
                <v-btn
                  @click="query()"
                  :disabled="
                    editor && editor.state && editor.state.doc.length == 0
                  "
                  color="success"
                  icon
                  small
                  ><v-icon>mdi-play</v-icon></v-btn
                >
              </v-col>
              <v-spacer></v-spacer>
              <v-col align="right">
                <v-btn
                  @click="copyResult()"
                  :disabled="items.length == 0"
                  icon
                  small
                  ><v-icon>mdi-content-copy</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider />
          <v-card
            class="overflow-y-auto overflow-x-hidden"
            elevation="0"
            max-height="calc(100vh - 118px)"
          >
            <v-card-text>
              <v-row dense>
                <v-col>
                  <v-card>
                    <div
                      class="CodeMirror"
                      tabindex="-1"
                      ref="codemirror"
                    ></div>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    fixed-header
                    :headers="headers"
                    :items="items"
                    hide-default-footer
                    disable-pagination
                    height="calc(30vh - 10px)"
                    class="tbl_result elevation-1"
                    disable-sort
                    dense
                  >
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { format } from "sql-formatter";
import { customBasicSetup } from "@/utils/customBasicSetup";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { sql } from "@codemirror/lang-sql";
import { mapActions } from "vuex";
import { DbDef } from "@/utils/enum";
// import { oneDarkTheme } from "@codemirror/theme-one-dark";

export default {
  name: "query-editor",
  mounted() {
    window.initQueryEditor = this.initPage;
    window.sqlQueryCallback = this.sqlQueryCallback;
    window.curConnectionCallback = this.curConnectionCallback;
    this.clearContent();
  },
  methods: {
    ...mapActions(["restore"]),
    initPage() {
      this.restore();
      this.clearContent();
    },
    clearContent() {
      window.chrome.webview.postMessage({
        api: "curConnection",
        callback: "curConnectionCallback",
      });
      // this.editor.dispatch({
      //   changes: {
      //     from: 0,
      //     to: this.editor.state.doc.length,
      //     insert: "",
      //   },
      // });
      this.tx = 0;
      this.forward = true;
      this.more = 0;
      this.items = [];
      this.headers = [];
    },
    curConnectionCallback(content) {
      const result = JSON.parse(content);
      if (result.Success) {
        this.dbType = this.DbDef.find((db) => db.value == parseInt(result.Data));
        this.attrs.loading = false;
        this.editor && this.editor.destroy();
        this.editor = new EditorView({
          state: EditorState.create({
            // doc: this.value,
            extensions: [
              customBasicSetup,
              // oneDarkTheme,
              sql({
                dialect: this.dbType.dialect,
              }),
            ],
          }),
          parent: this.$refs.codemirror,
        });
      }
    },
    beautify() {
      let formattedSql = format(this.editor.state.doc.toString(), {
        language: this.dbType.lang,
        uppercase: true,
      });
      this.editor.dispatch({
        changes: {
          from: 0,
          to: this.editor.state.doc.length,
          insert: formattedSql,
        },
      });
    },
    query() {
      let sql = "";
      const from = this.editor.state.selection.main.from;
      const to = this.editor.state.selection.main.to;
      if (from < to) {
        sql = this.editor.state.sliceDoc(from, to);
      } else {
        sql = this.editor.state.doc.toString();
      }
      window.chrome.webview.postMessage({
        api: "sqlQuery",
        callback: "sqlQueryCallback",
        args: JSON.stringify({
          tx: this.tx,
          sql: sql,
          forward: this.forward,
          more: this.more,
        }),
      });
    },
    copyResult() {
      const clipboardData = [];
      const hRow = [];
      this.headers.forEach((header) => {
        hRow.push(header.value);
      });
      clipboardData.push(hRow.join("\t"));
      this.items.forEach((item) => {
        const row = [];
        for (const key in item) {
          row.push(item[key]);
        }
        clipboardData.push(row.join("\t"));
      });
      navigator.clipboard
        .writeText(clipboardData.join("\r\n"))
        .then(() => {
          this.$toast.success(this.$t("message.copySuccess"), {
            icon: "mdi-check-circle-outline",
          });
        })
        .catch((err) => {
          this.$toast.error(this.$t("message.copyFailed"), {
            icon: "mdi-close-circle-outline",
          });
          console.error(err);
        });
    },
    sqlQueryCallback(content) {
      const result = JSON.parse(content);
      if (result.Success) {
        this.tx = result.Data.tx;
        this.more = result.Data.more;
        this.forward = result.Data.forward;
        this.items = result.Data.items;
        this.headers = result.Data.headers;
      } else {
        console.error(result.Message);
      }
    },
  },
  data() {
    return {
      DbDef,
      editor: null,
      tx: 0,
      forward: true,
      more: 0,
      items: [],
      headers: [],
      dbType: null,
      attrs: {
        loading: true,
        elevation: 0,
      },
    };
  },
};
</script>

<style>
.cm-focused {
  outline-style: none !important;
}
/* .cm-editor {
  border: 1px solid lightgrey;
} */
.cm-editor .cm-content {
  font-family: "Courier New", Courier, "Lucida Sans Typewriter",
    "Lucida Typewriter", monospace;
  /* box-shadow: inset 0px 1px 1px grey; */
}
.cm-scroller {
  overflow: scroll;
  min-height: 243px;
  max-height: 243px;
}
.cm-gutters {
  min-height: 243px !important;
  box-shadow: 1px 0px 1px grey;
}
/* .cm-content, .cm-gutter { min-height: 350px; } */
</style>