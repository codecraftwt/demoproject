// In costCodeUtils.ts
export const getCostCodeVerificationContent = (parsedCostCodes: any) => {
  // Function to create a formatted string representation of a code and its children
  const formatCodeHierarchy = (code: any, indent: string = '') => {
    let result = `${indent}${code.code}: ${code.description}`
    if (code.budgetedHours) {
      result += ` (${code.budgetedHours} hours)`
    }
    result += '\n'

    if (code.children && code.children.length > 0) {
      code.children.forEach((child: any) => {
        result += formatCodeHierarchy(child, indent + '  ')
      })
    }
    return result
  }

  // Select a sample of top-level cost codes (e.g., first two)
  const sampleCodes = parsedCostCodes.slice(0, 2)

  // Create a formatted string representation of the sample codes with their hierarchy
  const sampleCodeString = sampleCodes
    .map((code: any) => formatCodeHierarchy(code))
    .join('\n')

  // Calculate max depth
  const getDepth = (code: any): number => {
    if (!code.children || code.children.length === 0) return 1
    return 1 + Math.max(...code.children.map(getDepth))
  }
  const maxDepth = Math.max(...parsedCostCodes.map(getDepth))

  return {
    sampleHierarchy: sampleCodeString,
    totalTopLevelCodes: parsedCostCodes.length,
    maxDepth: maxDepth,
  }
}
