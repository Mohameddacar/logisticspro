import prisma from '../config/db.js';
import bcrypt from 'bcrypt';

export const getUserProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });
};


export const updateUserProfile = async (userId, data) => {
  const { fullName, email } = data;
  return await prisma.user.update({
    where: { id: userId },
    data: { fullName, email },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Invalid current password');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: {
      role: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const updateUserRole = async (userId, roleId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { roleId },
    include: { role: true },
  });
};

export const toggleUserStatus = async (userId, status) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

export const deleteUser = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};
