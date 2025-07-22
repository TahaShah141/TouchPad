
export const getMacIP = async (): Promise<string> => {
  const response = await fetch('https://redirects-141.vercel.app/api/ip')
  
  if (!response.ok) throw Error("Error Fetching Mac IP");

  const { node } = await response.json()

  return node.value
}