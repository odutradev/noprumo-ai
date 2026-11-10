import { z } from "zod"

export const skillMetadataSchema = z.object({
  skillName: z.string().trim().min(1, "Dê um nome para a skill").max(64, "Use até 64 caracteres"),
  skillDescription: z.string().trim().min(1, "Descreva quando o Claude deve usar a skill").max(1024, "Use até 1024 caracteres")
})

export const validateSkillMetadata = (data: z.input<typeof skillMetadataSchema>) => {
  const result = skillMetadataSchema.safeParse(data)
  return result.success ? {} : z.flattenError(result.error).fieldErrors
}
