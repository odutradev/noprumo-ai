import useGeneratorStore from "@stores/generator"

const useCustomField = () => {
  const custom = useGeneratorStore((state) => state.config.custom)
  const setCustom = useGeneratorStore((state) => state.setCustom)

  return (key: string) => ({
    customText: custom[key],
    onCustomChange: (text: string | undefined) => setCustom(key, text)
  })
}

export default useCustomField
