import { createClient } from '@/utils/supabase/server';
import UnitUpdatesDataTable from '@/components/units/unit-updates-data-table';
import FeatureCard from '@/components/ui/feature-card';
import { Update, ProjectMetadata } from '@/utils/types';

export type UnitUpdate = {
  id: number;
  created_at: string;
  edited_at: string;
  date: string;
  type: string;
  description: string;
  value: number;
  link: string;
  posted_by: string;
  year: number;
  update_impact_indicator_id: number;
  source: string;
  duplicate: boolean;
  verified: boolean;
  valid: boolean;
  unit_id: number;
  unit_name: string;
  unit_slug: string;
  project_id: number;
  project_name: string;
  project_slug: string;
  output_measurable_id: number;
  output_measurable_code: string;
  output_measurable_description: string;
  output_measurable_unit: string;
  output_measurable_target: number;
  output_measurable_value: number;
  impact_indicator_id: number;
  indicator_code: string;
  indicator_title: string;
  indicator_unit: string;
  first_name: string;
  last_name: string;
};

export default async function UnitUpdatesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unit_contribution_updates')
    .select('*')
    .eq('unit_slug', slug)
    .order('date', { ascending: false });

  if (error) {
    return (
      <div className='flex flex-col gap-4'>
        <p>Error fetching updates: {error.message}</p>
      </div>
    );
  }

  const parsedData = data.map(
    (update: UnitUpdate): Update => ({
      id: update.id,
      created_at: update.created_at,
      edited_at: update.edited_at,
      date: update.date,
      project_id: update.project_id,
      output_measurable_id: update.output_measurable_id,
      type: update.type,
      description: update.description,
      value: update.value,
      link: update.link,
      posted_by: update.posted_by,
      year: update.year,
      impact_indicator_id: update.impact_indicator_id,
      source: update.source,
      duplicate: update.duplicate,
      verified: update.verified,
      valid: update.valid,
      projects: {
        id: update.project_id,
        name: update.project_name,
        slug: update.project_slug,
        pm: null,
        support: null,
        start_date: null,
        last_updated: null,
        project_status: null,
        project_tier: null,
        project_type: null,
        project_country: null,
        regional_strategy: null,
        unit_requirements: null,
        pillars: null,
        local_contacts: [],
        highlights: null,
        current_issues: null,
        proposed_solutions: null,
        board_intervention_required: null,
        users: [],
      } as ProjectMetadata,
      output_measurables: {
        id: update.output_measurable_id,
        assumptions: '',
        code: update.output_measurable_code,
        description: update.output_measurable_description,
        impact_indicator_id: update.impact_indicator_id,
        output_id: 0,
        project_id: update.project_id,
        target: update.output_measurable_target,
        unit: update.output_measurable_unit,
        verification: '',
        archived: false,
      },
      impact_indicators: {
        id: update.impact_indicator_id,
        created_at: '',
        indicator_code: update.indicator_code,
        indicator_title: update.indicator_title,
        indicator_unit: update.indicator_unit,
      },
      users: {
        id: update.posted_by,
        first_name: update.first_name,
        last_name: update.last_name,
      },
    }),
  );

  return (
    <div className='flex flex-col gap-6'>
      <FeatureCard>
        <UnitUpdatesDataTable data={parsedData} />
      </FeatureCard>
    </div>
  );
}
