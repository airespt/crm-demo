// USERS
import {
  getAllUsers,
  getUserBy,
  createUser,
} from "./users"

export const usersRepo = {
  getAll: getAllUsers,
  getBy: getUserBy,
  create: createUser,
}


//  USER ROLES PERMISSIONS
import {
  getAllRoles,
  getRoleBy,
  createRole,
} from "./rolePermissions";

export const rolesRepo = {
  getAll: getAllRoles,
  getBy: getRoleBy,
  create: createRole,
}

import {
  getSessionByKey,
  createSession,
  refreshSession,
  deleteSession,
  deleteExpiredSessions,
} from "./sessions";


// SESSIONS
export const sessionsRepo = {
  getByKey: getSessionByKey,
  create: createSession,
  refresh: refreshSession,
  delete: deleteSession,
  deleteExpired: deleteExpiredSessions,
}
