export enum RoleClass {
  FRESHMAN,
  SOPHOMORE,
  JUNIOR,
  SENIOR,
  GRAD,
}

export interface Role {
  label: string;
  description?: string;
  value: string;
  emoji?: string;
  roleId: string;
  class: RoleClass;
}

const roles: Role[] = [
  {
    label: "CSCE 1030",
    description: "Computer Science I",
    emoji: "798231901487104030",
    roleId: "878366832803868732",
    class: RoleClass.FRESHMAN,
  },
  {
    label: "CSCE 1040",
    description: "Computer Science II",
    emoji: "798231901487104030",
    roleId: "878366576015978567",
    class: RoleClass.FRESHMAN,
  },
  {
    label: "CSCE 2100",
    description: "Foundations of Computing I",
    emoji: "798233981069164565",
    roleId: "877428932192923668",
    class: RoleClass.SOPHOMORE,
  },
  {
    label: "CSCE 2110",
    description: "Foundations of Computing II",
    emoji: "798232774741852260",
    roleId: "877428881496358933",
    class: RoleClass.SOPHOMORE,
  },
  {
    label: "CSCE 2610",
    description: "Assembly Language and Computer Organization",
    roleId: "877429109817479178",
    class: RoleClass.SOPHOMORE,
  },
  {
    label: "CSCE 3010",
    description: "Signals and Systems",
    roleId: "877687039414378506",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3020",
    description: "Communications Systems",
    roleId: "932742231696240670",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3055",
    description: "IT Project Management",
    roleId: "877429156277813259",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3110",
    description: "Data Structures and Algorithms",
    roleId: "877428618140196904",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3220",
    description: "Human Computer Interfaces",
    roleId: "879761357686321162",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3420",
    description: "Internet Programming",
    roleId: "878397213884174436",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3444",
    description: "Software Engineering",
    roleId: "877687688659099658",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3530",
    description: "Introduction to Computer Networks",
    roleId: "932451719395307520",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3550",
    description: "Introduction to Computer Security",
    roleId: "932451378540990487",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3560",
    description: "Computer Systems Security",
    roleId: "932451512687427634",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3600",
    description: "Systems Programming",
    roleId: "877428672435482676",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3612",
    description: "Embedded Systems Design",
    roleId: "933035616965361724",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 3615",
    description: "Enterprise Systems Architecture and Design",
    roleId: "877687758972411914",
    class: RoleClass.JUNIOR,
  },
  {
    label: "CSCE 4010/4011",
    description: "Social Issues in Computing/Engineering Ethics",
    roleId: "932403691871420426",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4110",
    description: "Algorithms",
    roleId: "932458219085889627",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4115",
    description: "Formal Languages, Automata, and Computability",
    roleId: "879133115434561547",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4210",
    description: "Game Programming I",
    roleId: "878392459590262856",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4220",
    description: "Game Programming II",
    roleId: "932451921439096862",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4350",
    description: "Introduction to Database Systems Design",
    roleId: "877429373928615956",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4355",
    description: "Database Administration",
    roleId: "935247116689895434",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4430",
    description: "Programming Languages",
    roleId: "877683860702371841",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4460/5460",
    description: "Software Testing and Empirical Methodologies",
    roleId: "933031548029120522",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4600",
    description: "Introduction to Operating Systems",
    roleId: "932452099239850014",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 4999",
    description: "Senior Thesis",
    roleId: "963440784898662480",
    class: RoleClass.SENIOR,
  },
  {
    label: "CSCE 5150",
    description: "Analysis of Computer Algorithms",
    roleId: "932462093544857620",
    class: RoleClass.GRAD,
  },
  {
    label: "CSCE 5210",
    description: "Artificial Intelligence",
    roleId: "877686012371951626",
    class: RoleClass.GRAD,
  },
  {
    label: "CSCE 5300",
    description: "Introduction to Big Data and Data Science",
    roleId: "933091504262627368",
    class: RoleClass.GRAD,
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

export default roles;
