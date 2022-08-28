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
  name: {
    type: STRING,
    unique: true,
  },
  description: TEXT,
  roleId: STRING,
  emoji: STRING,
  class: ENUM("freshman", "sophomore", "junior", "senior", "grad"),
  category: ENUM('course', 'pronoun', 'other')
});
