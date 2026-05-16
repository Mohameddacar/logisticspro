import prisma from '../config/db.js';
import bcrypt from 'bcrypt';

export const registerUser = async (userData) => {
  const { fullName, username, password, companyName, phoneNumber } = userData;
  const email = userData.email.toLowerCase();

  // Check if email exists
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) {
    const error = new Error('Email already exists');
    error.statusCode = 400;
    throw error;
  }

  // Check if username exists
  const usernameExists = await prisma.user.findUnique({ where: { username } });
  if (usernameExists) {
    const error = new Error('Username already exists');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Find default role
  const defaultRole = await prisma.role.findUnique({ where: { name: 'Normal User' } });

  const user = await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      phoneNumber,
      companyName,
      password: hashedPassword,
      roleId: defaultRole?.id,
    },
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

  return user;
};

export const loginUser = async (identifier, password) => {
  const lowercaseIdentifier = identifier.toLowerCase();
  const user = await prisma.user.findFirst({ 
    where: {
      OR: [
        { email: lowercaseIdentifier },
        { username: identifier } // username might be case sensitive or not, usually we check both or just one
      ]
    },
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

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    return user;
  } else {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
};
