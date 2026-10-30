import { createFileRoute } from '@tanstack/react-router'

import { ContentLayout } from '@/layouts/global/content-layout'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <ContentLayout>
      <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8">
        <h1 className="text-2xl font-semibold">storybook</h1>
        <p>部品は Storybook で確認する（bun run storybook）。</p>
      </main>
    </ContentLayout>
  )
}
