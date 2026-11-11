import { Alert, Button, Flex, Input } from "enchase"

import { devRunnerOptions, envLocationOptions } from "@assets/data/generator/deployOptions"
import { architectureInfo, frameworkOptions } from "@assets/data/generator/options"
import { frontendFrameworkOptions } from "@assets/data/generator/frontendOptions"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import styles from "./styles.module.css"

const labelOf = <T extends string>(options: { value: T; label: string }[], value: T) => options.find((option) => option.value === value)?.label ?? value

const WorkspaceStep = () => {
  const custom = useCustomField()
  const workspace = useGeneratorStore((state) => state.config.workspace)
  const configs = useGeneratorStore((state) => state.configs)
  const set = useGeneratorStore((state) => state.updateWorkspace)
  const editApp = useGeneratorStore((state) => state.editApp)
  const { backend, frontend } = configs

  return (
    <Flex direction="column" gap="var(--enchase-space-xl)">
      <StepHeader title="Monorepo" description="Como a API e o frontend convivem no mesmo repositório. Os padrões de código de cada app vêm das abas Backend e Frontend." />

      <div className={styles.inputs}>
        <Input label="Pasta da API" value={workspace.backendFolder} onChange={(event) => set("backendFolder", event.target.value)} helperText="Padrão: api" fullWidth />
        <Input label="Pasta do frontend" value={workspace.frontendFolder} onChange={(event) => set("frontendFolder", event.target.value)} helperText="Padrão: frontend" fullWidth />
      </div>

      <ChoiceCards legend="Scripts da raiz" description="Como o package.json da raiz sobe e builda os apps." options={devRunnerOptions} value={workspace.devRunner} onChange={(value) => set("devRunner", value)} {...custom("workspace.devRunner")} />
      <ChoiceCards legend="Variáveis de ambiente" options={envLocationOptions} value={workspace.envLocation} onChange={(value) => set("envLocation", value)} {...custom("workspace.envLocation")} />

      <div className={styles.apps}>
        <div className={styles.app}>
          <p className={styles.appTitle}>API · {workspace.backendFolder || "api"}/</p>
          <p className={styles.appSummary}>
            {labelOf(frameworkOptions, backend.framework)} · {architectureInfo[backend.architecture].label}
          </p>
          <Button variant="outline" size="sm" onClick={() => editApp("backend")}>
            Editar padrões do backend
          </Button>
        </div>
        <div className={styles.app}>
          <p className={styles.appTitle}>Frontend · {workspace.frontendFolder || "frontend"}/</p>
          <p className={styles.appSummary}>
            {labelOf(frontendFrameworkOptions, frontend.frontend.framework)} · {architectureInfo[frontend.architecture].label}
          </p>
          <Button variant="outline" size="sm" onClick={() => editApp("frontend")}>
            Editar padrões do frontend
          </Button>
        </div>
      </div>

      <Alert variant="info" title="Um guia por pasta">
        O resultado traz o guia da raiz e um guia para cada app, montados com as escolhas de Backend e Frontend. Ao concluir a edição de um deles, você volta direto para cá.
      </Alert>
    </Flex>
  )
}

export default WorkspaceStep
