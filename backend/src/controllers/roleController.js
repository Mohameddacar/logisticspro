import prisma from '../config/db.js';

export const getRoles = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
    res.json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

export const getPermissions = async (req, res, next) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json({ success: true, data: permissions });
  } catch (error) {
    next(error);
  }
};

export const updateRolePermissions = async (req, res, next) => {
  try {
    const { roleId, permissionIds } = req.body;

    // Delete existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId }
    });

    // Add new permissions
    const data = permissionIds.map(id => ({
      roleId,
      permissionId: id
    }));

    await prisma.rolePermission.createMany({
      data
    });

    const updatedRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    res.json({ success: true, data: updatedRole });
  } catch (error) {
    next(error);
  }
};
