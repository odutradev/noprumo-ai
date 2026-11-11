import { Alert, Flex, Grid, Input, Switch } from "enchase"
import { useMemo } from "react"

import { containerServiceOptions, fullstackNginxOptions } from "@assets/data/generator/deployOptions"
import { buildDeployFiles, getNginxMode } from "@utils/functions/generator/deploy"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import CheckCard from "@components/checkCard"
import CodeBlock from "@components/codeBlock"
import styles from "./styles.module.css"

const nginxHelp = {
  none: "",
  spa: "Serve a build do frontend com gzip, cache e fallback de SPA.",
  gateway: "Serve o frontend e repassa /api para a API.",
  reverseProxy: "Fica na frente da API como proxy reverso."
}

const DeployStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const set = useGeneratorStore((state) => state.updateDeploy)
  const toggleService = useGeneratorStore((state) => state.toggleService)
  const { deploy } = config
  const isFullstack = config.projectType === "fullstack"
  const files = useMemo(() => buildDeployFiles(config), [config])
  const mode = getNginxMode(config)
  const nginxDefault = config.projectType === "backend" ? "Proxy reverso na frente da API." : "Serve a build do frontend com gzip, cache e fallback de SPA."

  return (
    <Flex direction="column" gap="var(--enchase-space-xl)">
      <StepHeader title="Docker e deploy" description="Escolha se o projeto roda em container, com docker-compose e nginx. A skill passa a seguir esses arquivos como padrão." />

      <div className={styles.switchRow}>
        <Switch label="Dockerfile" checked={deploy.hasDocker} onChange={(event) => set("hasDocker", event.target.checked)} helperText={isFullstack ? "Um Dockerfile multi-stage por app, com builder e runner." : "Dockerfile multi-stage com builder e runner."} />
        {deploy.hasDocker && <Input label="Imagem base do Node" value={deploy.nodeImage} onChange={(event) => set("nodeImage", event.target.value)} helperText="Usada nos estágios Node. Padrão: node:22-alpine" fullWidth />}
      </div>

      <div className={styles.switchRow}>
        <Switch
          label="docker-compose"
          checked={deploy.hasCompose}
          onChange={(event) => set("hasCompose", event.target.checked)}
          helperText={deploy.hasDocker ? "Sobe os apps e os serviços de apoio na mesma rede." : "Sem Dockerfile, o compose sobe só os serviços de apoio do desenvolvimento."}
        />
        {deploy.hasCompose && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Serviços de apoio</legend>
            <Grid minColumnWidth="13rem" gap="var(--enchase-space-sm)">
              {containerServiceOptions.map((service) => (
                <CheckCard key={service.value} label={service.label} description={service.description} isChecked={deploy.services.includes(service.value)} onToggle={() => toggleService(service.value)} />
              ))}
            </Grid>
          </fieldset>
        )}
      </div>

      <div className={styles.switchRow}>
        <Switch label="Nginx" checked={deploy.hasNginx} onChange={(event) => set("hasNginx", event.target.checked)} helperText={mode === "none" ? nginxDefault : nginxHelp[mode]} />
        {deploy.hasNginx && isFullstack && (
          <ChoiceCards legend="Papel do nginx" options={fullstackNginxOptions} value={deploy.fullstackNginx} onChange={(value) => set("fullstackNginx", value)} {...custom("deploy.fullstackNginx")} />
        )}
      </div>

      {files.length ? (
        <div className={styles.files}>
          {files.map((file) => (
            <CodeBlock key={file.path} code={file.code} title={file.path} isCopyable maxHeight="24rem" />
          ))}
        </div>
      ) : (
        <Alert variant="info" title="Sem Docker, compose e nginx">
          A skill vai proibir criar esses arquivos sem pedido.
        </Alert>
      )}
    </Flex>
  )
}

export default DeployStep
