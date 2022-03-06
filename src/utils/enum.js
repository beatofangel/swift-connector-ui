const ProtectedMode = Object.freeze({
  PROTECTED: 1,
  NORMAL: 0
});

const EditMode = Object.freeze({
  DETAIL: "detail",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  COPY: "copy"
});

const ViewMode = Object.freeze({
  LIST: 0,
  MODULE: 1
});

import { PLSQL, MySQL, SQLite, PostgreSQL, MSSQL } from "@codemirror/lang-sql";
const DbDef = Object.freeze(
  [
    {
      label: "Oracle",
      value: 1,
      dialect: PLSQL,
      lang: "plsql",
      icon32: "images/database/oracle_mini_32.png",
      icon64: "images/database/oracle_large_64.png",
      iconSvg: "images/database/oracle.svg",
    },
    {
      label: "MySQL",
      value: 2,
      dialect: MySQL,
      lang: "mysql",
      icon32: "images/database/mysql_mini_32.png",
      icon64: "images/database/mysql_large_64.png",
      iconSvg: "images/database/mysql.svg",
    },
    {
      label: "SQL Server",
      value: 3,
      dialect: MSSQL,
      lang: "tsql",
      icon32: "images/database/sqlserver_mini_32.png",
      icon64: "images/database/sqlserver_large_64.png",
      iconSvg: "images/database/sqlserver.svg",
    },
    {
      label: "PostgreSQL",
      value: 4,
      dialect: PostgreSQL,
      lang: "postgresql",
      icon32: "images/database/postgresql_mini_32.png",
      icon64: "images/database/postgresql_large_64.png",
      iconSvg: "images/database/postgresql.svg",
    },
    {
      label: "SQLite",
      value: 5,
      dialect: SQLite,
      lang: "sql",
      icon32: "images/database/sqlite_mini_32.png",
      icon64: "images/database/sqlite_large_64.png",
      iconSvg: "images/database/sqlite.svg",
    },
  ]
);

export { ProtectedMode, EditMode, ViewMode, DbDef};