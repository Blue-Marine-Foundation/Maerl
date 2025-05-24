import { createClient } from "@/utils/supabase/server";

export const fetchUpdates = async (projectId?: number) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('project_id', projectId)
}