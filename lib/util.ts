import { UserRole } from "@/types";

export const validateRoles = ((allowedRoles: UserRole[], userRoles: UserRole[] | null): boolean => {
    const userRolesSet = new Set<UserRole>(userRoles);
    return userRoles !== null && allowedRoles.some((role) => userRolesSet.has(role));
});

export const serializeRoles = ((userRoles: UserRole[] | null): string => {
    if (userRoles === null) return 'null';
    return userRoles.join('|');
});

export const deserializeRoles = ((serializedRoles: string): UserRole[] | null => {
    if (serializedRoles === 'null') return null;
    return serializedRoles.split('|') as UserRole[];
});