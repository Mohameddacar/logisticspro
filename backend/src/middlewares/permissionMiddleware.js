const checkPermission = (permissionKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { role } = req.user;
    
    // Superadmin has all permissions
    if (role?.name === 'Superadmin') {
      return next();
    }

    // Check if user has the specific permission
    const hasPermission = role?.permissions?.some(rp => rp.permission.key === permissionKey);

    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        message: `Permission Denied: You do not have access to ${permissionKey}` 
      });
    }



    next();
  };
};

export default checkPermission;
