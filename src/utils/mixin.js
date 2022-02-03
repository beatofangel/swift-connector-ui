export const mixin={
  data() {
    return {
      editMode: Object.freeze({
        DETAIL: "detail",
        CREATE: "create",
        EDIT: "edit",
        DELETE: "delete"
      })
    }
  }
}