// USERS
import {
  authenticate,
  listUsers,
  getUserById,
} from "./users";


export const userService = {
  authenticate,
  list: listUsers,
  getById: getUserById,
  // create: createUser,
  // update: updateUser,
  // delete: deleteUser,
}


//  USER ROLES PERMISSIONS
import {
  listRoles,
  getRoleById
} from "./rolePermissions";

export const roleService = {
  list: listRoles,
  getById: getRoleById,
}


// SESSIONS
import {
  createSession,
  verifySession,
} from "./sessions";

export const sessionService = {
  create: createSession,
  verify: verifySession,

}