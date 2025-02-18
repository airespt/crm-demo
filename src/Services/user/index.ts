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
  getRoleById,
  createRole,
  updateRoles,
  deleteRole,
} from "./rolePermissions";

export const roleService = {
  list: listRoles,
  getById: getRoleById,
  create: createRole,
  update: updateRoles,
  delete: deleteRole,
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