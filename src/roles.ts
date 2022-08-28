import { Model } from "sequelize";
import { Tags } from "./db";

export enum RoleType {
  FRESHMAN,
  SOPHOMORE,
  JUNIOR,
  SENIOR,
  GRAD,
  PRONOUN,
  OTHER,
}

export interface Role {
  label: string;
  description?: string;
  value: string;
  emoji?: string;
  roleId: string;
  class: RoleType;
}

const roles: Role[] = [
  {
    label: "CSCE 1030",
    description: "Computer Science I",
    emoji: "798231901487104030",
    roleId: "878366832803868732",
    class: RoleType.FRESHMAN,
  },
  {
    label: "CSCE 1040",
    description: "Computer Science II",
    emoji: "798231901487104030",
    roleId: "878366576015978567",
    class: RoleType.FRESHMAN,
  },
  {
    label: "CSCE 2100",
    description: "Foundations of Computing I",
    emoji: "798233981069164565",
    roleId: "877428932192923668",
    class: RoleType.SOPHOMORE,
  },
  {
    label: "CSCE 2110",
    description: "Foundations of Computing II",
    emoji: "798232774741852260",
    roleId: "877428881496358933",
    class: RoleType.SOPHOMORE,
  },
  {
    label: "CSCE 2610",
    description: "Assembly Language and Computer Organization",
    roleId: "877429109817479178",
    class: RoleType.SOPHOMORE,
  },
  {
    label: "CSCE 3010",
    description: "Signals and Systems",
    roleId: "877687039414378506",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3020",
    description: "Communications Systems",
    roleId: "932742231696240670",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3055",
    description: "IT Project Management",
    roleId: "877429156277813259",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3110",
    description: "Data Structures and Algorithms",
    roleId: "877428618140196904",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3220",
    description: "Human Computer Interfaces",
    roleId: "879761357686321162",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3420",
    description: "Internet Programming",
    roleId: "878397213884174436",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3444",
    description: "Software Engineering",
    roleId: "877687688659099658",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3530",
    description: "Introduction to Computer Networks",
    roleId: "932451719395307520",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3550",
    description: "Introduction to Computer Security",
    roleId: "932451378540990487",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3560",
    description: "Computer Systems Security",
    roleId: "932451512687427634",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3600",
    description: "Systems Programming",
    roleId: "877428672435482676",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3612",
    description: "Embedded Systems Design",
    roleId: "933035616965361724",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 3615",
    description: "Enterprise Systems Architecture and Design",
    roleId: "877687758972411914",
    class: RoleType.JUNIOR,
  },
  {
    label: "CSCE 4010/4011",
    description: "Social Issues in Computing/Engineering Ethics",
    roleId: "932403691871420426",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4110",
    description: "Algorithms",
    roleId: "932458219085889627",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4115",
    description: "Formal Languages, Automata, and Computability",
    roleId: "879133115434561547",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4210",
    description: "Game Programming I",
    roleId: "878392459590262856",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4220",
    description: "Game Programming II",
    roleId: "932451921439096862",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4350",
    description: "Introduction to Database Systems Design",
    roleId: "877429373928615956",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4355",
    description: "Database Administration",
    roleId: "935247116689895434",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4430",
    description: "Programming Languages",
    roleId: "877683860702371841",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4460/5460",
    description: "Software Testing and Empirical Methodologies",
    roleId: "933031548029120522",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4600",
    description: "Introduction to Operating Systems",
    roleId: "932452099239850014",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 4999",
    description: "Senior Thesis",
    roleId: "963440784898662480",
    class: RoleType.SENIOR,
  },
  {
    label: "CSCE 5150",
    description: "Analysis of Computer Algorithms",
    roleId: "932462093544857620",
    class: RoleType.GRAD,
  },
  {
    label: "CSCE 5210",
    description: "Artificial Intelligence",
    roleId: "877686012371951626",
    class: RoleType.GRAD,
  },
  {
    label: "CSCE 5300",
    description: "Introduction to Big Data and Data Science",
    roleId: "933091504262627368",
    class: RoleType.GRAD,
  },
].map((r) =>
  // value is always the label without a space
  ({ ...r, value: r.label.replace(" ", "") })
);

roles.reduce<string[]>((prev: string[], curr: Role) => {
  if (prev.includes(curr.roleId))
    throw new Error(`Duplicate role ID found! ${curr.roleId}`);
  prev.push(curr.roleId);
  return prev;
}, []);

const convertTag = (tag: Model<any, any>) => {
  const json = tag.toJSON();
  return {
    ...json,
    label: json.name,
    value: json.name.replaceAll(" ", ""),
  };
};

export const getStructuredRoles = async () => {
  // only need read access, unwrap into primitives.
  const freshmanCourses = await Tags.findAll({
    where: { class: "freshman" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const sophomoreCourses = await Tags.findAll({
    where: { class: "sophomore" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const juniorCourses = await Tags.findAll({
    where: { class: "junior" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const seniorCourses = await Tags.findAll({
    where: { class: "senior" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const gradCourses = await Tags.findAll({
    where: { class: "grad" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const pronouns = await Tags.findAll({
    where: { category: "pronoun" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));
  const other = await Tags.findAll({
    where: { category: "other" },
    order: [["name", "asc"]],
  }).then((tagsArray) => tagsArray.map(convertTag));

  return {
    [RoleType.FRESHMAN]: freshmanCourses,
    [RoleType.SOPHOMORE]: sophomoreCourses,
    [RoleType.JUNIOR]: juniorCourses,
    [RoleType.SENIOR]: seniorCourses,
    [RoleType.GRAD]: gradCourses,
    [RoleType.PRONOUN]: pronouns,
    [RoleType.OTHER]: other,
  };
};

export default roles;
