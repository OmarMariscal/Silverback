// frontend/src/types/roles.ts
// Este archivo contiene definiciones de tipos TypeScript para los roles de usuario en el sistema. Los tipos ayudan a garantizar que los datos que se manejan en la aplicación sean consistentes y correctos, proporcionando autocompletado y verificación de errores durante el desarrollo.
// En palabras sencillas: Este archivo es como un "manual de instrucciones" para los roles de usuario. Define qué roles existen y qué valores se esperan para cada uno. Esto ayuda a los desarrolladores a evitar errores al trabajar con estos datos en la aplicación.

export type RolUsuario = 'JEFA' | 'CONTRALOR' | 'AUDITOR';

export const rolesOperativos: RolUsuario[] = ['CONTRALOR', 'AUDITOR'];
