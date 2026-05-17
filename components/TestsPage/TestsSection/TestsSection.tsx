import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import TestsSectionClient from './TestSection.Client';
import { getTestsByTheme } from '@/lib/api';
import { themeIds } from '@/types/tests';

export default async function TestsSection() {
    const queryClient = new QueryClient();

    await Promise.all(
        themeIds.map((id) =>
            queryClient.prefetchQuery({
                queryKey: ["tests", id],
                queryFn: () => getTestsByTheme(id),
            })
        )
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TestsSectionClient />
        </HydrationBoundary>
    );
}