import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    console.warn(`[Auth] No token found for ${req.method} ${req.originalUrl}`);
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      expires: new Date(0),
    });
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, session expired or missing' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
      console.error(`[Auth] User not found for ID: ${decoded.userId}`);
      res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        expires: new Date(0),
      });
      return res.status(401).json({ 
        success: false, 
        message: 'User account no longer exists' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`[Auth] Token verification failed: ${error.message}`);
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      expires: new Date(0),
    });
    res.status(401).json({ 
      success: false, 
      message: 'Session invalid, please log in again' 
    });
  }
};

export default protect;
