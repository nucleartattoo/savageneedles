import { createServerFn } from '@tanstack/react-start'

export interface SaleorServerGraphQLRequest {
  query: string
  variables?: Record<string, unknown>
  endpointOverride?: string
  channelOverride?: string
  tokenOverride?: string
}

/**
 * Server-only helper to resolve Saleor credentials from environment or local .env
 * Never bundled into client code.
 */
async function resolveServerSaleorEnv(): Promise<{
  endpoint: string
  channel: string
  token: string
}> {
  let endpoint = process.env.SALEOR_API_ENDPOINT || 'http://127.0.0.1:8005/graphql/'
  let channel = process.env.SALEOR_CHANNEL || 'default-channel'
  let token = process.env.SALEOR_APP_TOKEN || ''

  // Fallback to reading .env on server if SALEOR_APP_TOKEN was not injected into process.env
  if (!token) {
    try {
      const fs = await import('node:fs/promises')
      const path = await import('node:path')
      const envPath = path.join(process.cwd(), '.env')
      const content = await fs.readFile(envPath, 'utf-8')
      for (const rawLine of content.split('\n')) {
        const line = rawLine.trim()
        if (!line || line.startsWith('#') || !line.includes('=')) continue
        const [k, ...rest] = line.split('=')
        const key = k.trim()
        const val = rest
          .join('=')
          .trim()
          .replace(/^['"]|['"]$/g, '')
        if (key === 'SALEOR_APP_TOKEN' && !token) token = val
        if (key === 'SALEOR_API_ENDPOINT' && !process.env.SALEOR_API_ENDPOINT) endpoint = val
        if (key === 'SALEOR_CHANNEL' && !process.env.SALEOR_CHANNEL) channel = val
      }
    } catch {
      // Ignore if .env does not exist in container
    }
  }

  return { endpoint, channel, token }
}

/**
 * TanStack Start Server Function for executing Saleor GraphQL queries & mutations.
 * Keeps SALEOR_APP_TOKEN strictly on the server (Safety Boundary compliant).
 */
export const executeSaleorGraphQLServerFn = createServerFn({
  method: 'POST',
  strict: false,
})
  .validator((data: SaleorServerGraphQLRequest) => data)
  .handler(async ({ data }) => {
    const serverEnv = await resolveServerSaleorEnv()

    let targetEndpoint = data.endpointOverride || serverEnv.endpoint
    // Inside Apple Container, rewrite localhost:8005 to the container's configured host gateway endpoint
    if (
      (targetEndpoint.includes('localhost:8005') || targetEndpoint.includes('127.0.0.1:8005')) &&
      serverEnv.endpoint &&
      !serverEnv.endpoint.includes('localhost:8005')
    ) {
      targetEndpoint = serverEnv.endpoint
    }

    const channel = data.channelOverride || serverEnv.channel
    const token = data.tokenOverride || serverEnv.token

    try {
      const res = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: data.query,
          variables: {
            channel,
            ...(data.variables || {}),
          },
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        return {
          errors: [{ message: `HTTP ${res.status}: ${errorText}` }],
        }
      }

      return (await res.json()) as {
        data?: unknown
        errors?: Array<{ message: string }>
      }
    } catch (error) {
      return {
        errors: [{ message: (error as Error).message }],
      }
    }
  })
