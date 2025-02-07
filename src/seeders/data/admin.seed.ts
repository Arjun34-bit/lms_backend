import { RoleEnum } from "@prisma/client";

export const adminSeedData = [
  {
    name: "PCC Admin",
    role: RoleEnum.admin,
    email: "pccadmin@duoples.com",
    password: "Pcc@admin21",
    verified: true,
  }
];
