import * as z from "zod";

export const RoleFormSchema = z.object({
  name: z.string(),
});

export const UserFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  hashedPassword: z.string().min(8, { message: 'Be at least 8 characters long' })
  .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
  .regex(/[0-9]/, { message: 'Contain at least one number.' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Contain at least one special character.',
  }).trim(),
});

export const PermissionFormSchema = z.object({
  name: z.string(),
  description: z.string(),
});



export type RoleFormValue = z.infer<typeof RoleFormSchema>;
export type UserFormValue = z.infer<typeof UserFormSchema>;
export type PermissionFormValue = z.infer<typeof PermissionFormSchema>;