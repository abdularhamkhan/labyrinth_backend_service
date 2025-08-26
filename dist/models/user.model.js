"use strict";
// import prisma from '../config/prisma'
// export const createUser = async (userData: any) => {
//   return await prisma.user.create({ data: userData });
// };
// export const findUserByEmailOrUsername = async (identifier: string) => {
//   return await prisma.user.findFirst({
//     where: {
//       OR: [{ email: identifier }, { username: identifier }],
//     },
//   });
// };
// export const findUserByEmail = async (email: string) => {
//   return await prisma.user.findUnique({ where: { email } });
// };
// export const verifyUser = async (email: string) => {
//   return await prisma.user.update({
//     where: { email },
//     data: { isVerified: true },
//   });
// };
// export const storeVerificationCode = async (email: string, code: string) => {
//   return await prisma.verificationCode.upsert({
//     where: { email },
//     update: { code, createdAt: new Date() },
//     create: { email, code },
//   });
// };
// export const getVerificationCode = async (email: string) => {
//   return await prisma.verificationCode.findUnique({ where: { email } });
// };
