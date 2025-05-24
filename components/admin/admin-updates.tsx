'use client';

import { useUpdates } from "@/hooks/use-updates";
import { ErrorStateCard, LoadingStateCard } from "../base-states/base-states";

export default function AdminUpdates() {
    
    const { updates, isLoading, error } = useUpdates();

    if (isLoading) {
        return <LoadingStateCard title="Loading updates" description="How's the weather?" />
    }

    if (error) {
        return <ErrorStateCard title="Error loading updates" errorMessage={error.message} description="Sometimes refreshing the page can resolve the error." />
    }

    return (
        <div>
            <p>Updates: {updates.length}</p>
        </div>
    )
}