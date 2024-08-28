

export const checkUserRoles = (requisiteRoles: any[], userRoles: any) => {
  if (!userRoles) return false
  return requisiteRoles.some((role: any) => userRoles.includes(role))
}