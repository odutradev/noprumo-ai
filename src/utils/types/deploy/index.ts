export type NginxMode = "none" | "spa" | "gateway" | "reverseProxy"

export interface DeployApp {
  kind: "api" | "web"
  folder: string
  service: string
}
