'use client';

import { useUrlDates } from "@/hooks/use-url-dates";

export default function AdminUpdates() {
    const { from, to } = useUrlDates();

    return (
        <div>
            <p>Date range: {from} to {to}</p>
        </div>
    )
}