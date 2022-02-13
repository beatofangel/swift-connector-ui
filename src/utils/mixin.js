export const mixin={
  data() {
    return {
      editMode: Object.freeze({
        DETAIL: "detail",
        CREATE: "create",
        EDIT: "edit",
        DELETE: "delete",
        COPY: "copy"
      }),
      protectedMode: Object.freeze({
        PROTECTED: 1,
        NORMAL: 0
      })
    }
  }
}