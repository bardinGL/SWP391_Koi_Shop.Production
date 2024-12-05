import { ThemeProvider } from '@/lib/theme-provider'
import TanstackQueryProvider from '@/lib/tanstack-query-provider'

import '@/app/globals.css'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'jotai'

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>
          <TanstackQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster />
            </ThemeProvider>
          </TanstackQueryProvider>
        </Provider>
      </body>
    </html>
  )
}
