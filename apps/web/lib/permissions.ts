import { USER_ROLES } from './constants'

type UserRole = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'CUSTOMER'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 4,
  MANAGER: 3,
  EDITOR: 2,
  CUSTOMER: 1,
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === USER_ROLES.ADMIN
}

export function isManager(userRole: UserRole): boolean {
  return hasRole(userRole, USER_ROLES.MANAGER)
}

export function isEditor(userRole: UserRole): boolean {
  return hasRole(userRole, USER_ROLES.EDITOR)
}

export function canManageProducts(userRole: UserRole): boolean {
  return hasRole(userRole, USER_ROLES.EDITOR)
}

export function canManageOrders(userRole: UserRole): boolean {
  return hasRole(userRole, USER_ROLES.MANAGER)
}

export function canManageUsers(userRole: UserRole): boolean {
  return isAdmin(userRole)
}

export function canManageContent(userRole: UserRole): boolean {
  return hasRole(userRole, USER_ROLES.EDITOR)
}

export function canViewAnalytics(userRole: UserRole): boolean {
  return hasRole(userRole, USER_ROLES.MANAGER)
}
