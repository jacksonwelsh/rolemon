import { ENUM } from "sequelize";
import { TEXT } from "sequelize";
import { Sequelize, STRING } from "sequelize";

export const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

export const Tags = sequelize.define("tags", {
  name: STRING,
  description: TEXT,
  roleId: {
    type: STRING,
    unique: true,
  },
  emoji: STRING,
  class: ENUM("freshman", "sophomore", "junior", "senior", "grad"),
  category: ENUM("course", "pronoun", "other"),
});
