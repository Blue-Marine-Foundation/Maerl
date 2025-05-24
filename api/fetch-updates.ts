'use server';

import { createClient } from "@/utils/supabase/server";

export const fetchUpdates = async (dateRange: { from: string, to: string }, projectId?: number) => {
    const supabase = await createClient();

    let query = supabase
        .from('updates')
        .select('*')
        .gte("date", dateRange.from)
        .lte("date", dateRange.to)
    
    if (projectId !== undefined) {
        query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) {
        throw error;
    }

    return data;
}