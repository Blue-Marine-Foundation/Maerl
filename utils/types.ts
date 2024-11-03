export type ProjectMetadata = {
  id: number;
  name: string;
  slug: string;
  pm: string | null;
  support: string | null;
  start_date: string | null;
  project_status: string | null;
  project_type: string | null;
  regional_strategy: string | null;
  unit_requirements: string | null;
  pillars: string | null;
  local_contacts: {
    name: string;
    organisation: string;
  }[];
  highlights: string | null;
  current_issues: string | null;
  proposed_solutions: string | null;
  board_intervention_required: string | null;
  users: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
  }[];
};

export type ImpactIndicator = {
  id: number;
  created_at: string;
  indicator_code: string;
  indicator_title: string;
  indicator_unit: string;
};

export type Impact = {
  id: number;
  created_at: string;
  project_id: number;
  title: string;
};

export type Outcome = {
  id: number;
  project_id: number;
  description: string;
  code: string;
  outcome_measurables: OutcomeMeasurable[];
};

export interface OutcomeMeasurable {
  id?: number;
  outcome_id: number;
  project_id: number;
  code: string;
  description: string;
  verification: string;
  assumptions: string;
  outputs?: Output[];
}

export interface Output {
  id: number;
  project_id: number;
  outcome_measurable_id: number;
  code: string;
  description: string;
  status: string;
  output_measurables?: OutputMeasurable[];
}

export interface OutputMeasurable {
  id?: number;
  project_id: number;
  output_id: number;
  code: string;
  description: string;
  impact_indicator_id: number | null;
  target: number | null;
  unit: string;
  verification: string;
  assumptions: string;
}
