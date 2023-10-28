require("dotenv").config();
const jwt = require("jsonwebtoken");

// TODO: Middleware  functions:
// // * checkRole: checks that the user making the request has the right role
// // * validation: makes sure that info being passed to database is correct

// authentication: verifies the request is coming from the user
const verifyToken = (req, res, next) => {
  console.log("Verify Token being called")
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// authorization: verifies user's id
const verifyUser = (req, res, next) => {
  console.log("Verify User being called")
    const userId = req.user.roleId;
    const studentId = req.params.id;

    if (userId !== studentId) {
        return res.status(403).json({ message: 'You are not authorized to access this data' })
    }
    next();
}

// FIXME: currently doesnt work when changing to the url teacher-home, but it should since it should be only getting teacher information
const verifyRole = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role
  
  if (allowedRoles.includes(userRole)) {
    next();
  } else {
    res.status(403).json({message: "You are not authorized to access this information"})
  }
}

const setCacheControlHeader = (req, res, next) => {
  // Set cache control headers to allow client-side caching for a reasonable duration
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Example: Cache for 1 hour
  next();
}

// TODO:
// only the student who is the owner of the data can access it. If you have different authorization levels (e.g., admin, teacher, etc.), you might need to extend your authorization logic accordingly.

// FIXME: not configured yet
// // can make special permissions file, or an Access Control List (ACL)
// // Example:
// const acl = {
//   students: {
//     admin: ['read', 'create', 'update', 'delete'],
//     teacher: ['read', 'update'],
//     student: ['read'],
//   },
//   courses: {
//     admin: ['read', 'create', 'update', 'delete'],
//     teacher: ['read', 'update'],
//     student: ['read'],
//   },
//   grades: {
//     admin: ['read', 'create', 'update', 'delete'],
//     teacher: ['read', 'update'],
//     student: ['read'],
//   },
// };

// FIXME: not tested yet
// const checkPermission = (resourceType, action) => (req, res, next) => {
//   const userRole = req.user.role; // Get the user's role from the token

//   // Check if the user's role is allowed to perform the specified action on the resource type
//   if (acl[resourceType] && acl[resourceType][userRole] && acl[resourceType][userRole].includes(action)) {
//     next(); // User is authorized
//   } else {
//     res.status(403).json({ message: 'You are not authorized to perform this action on this resource.' });
//   }
// };


module.exports = {
    verifyToken,
    verifyUser,
    verifyRole,
    setCacheControlHeader
}