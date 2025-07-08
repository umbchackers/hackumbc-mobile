import { UserRole } from "@/types";

export const validateRoles = (allowedRoles: UserRole[], userRoles: UserRole[] | null): boolean => {
    if (userRoles === null || userRoles.length === 0) return false;
    const userRolesSet = new Set<UserRole>(userRoles);
    return allowedRoles.some((role) => userRolesSet.has(role));
};

export const serializeRoles = (userRoles: UserRole[] | null): string => {
    if (userRoles === null || userRoles.length === 0) return 'null';
    return userRoles.join('|');
};

export const deserializeRoles = (serializedRoles: string): UserRole[] | null => {
    if (serializedRoles === 'null' || serializedRoles === '') return null;
    const roles = serializedRoles.split('|').filter(role => role.length > 0);
    return roles.length > 0 ? roles as UserRole[] : null;
};