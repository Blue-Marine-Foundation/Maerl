export type ProjectMetadata = {
  id: number;
  name: string;
  slug: string;
  pm: string | null;
  support: string | null;
  start_date: string | null;
  last_updated: string | null;
  project_status: string | null;
  project_tier: 't1' | 't2' | 't3' | 't4' | null;
  project_type: string | null;
  project_country: string | null;
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

export type ImpactIndicatorSummary = {
  impact_indicator_id: number;
  indicator_code: string;
  indicator_title: string;
  indicator_unit: string;
  valid_updates: number;
  total_value: number;
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
  assumptions: string;
  code: string;
  description: string;
  impact_indicator_id: number | null;
  impact_indicators?: ImpactIndicator | null;
  outcome_id: number;
  outputs?: Output[];
  project_id: number;
  target: number | null;
  verification: string;
}

export interface Output {
  id: number;
  created_at: string;
  last_updated: string;
  project_id: number;
  outcome_measurable_id: number | null;
  code: string;
  description: string;
  status: string;
  output_measurables?: OutputMeasurable[];
  activities?: OutputActivity[];
}

export interface OutputMeasurable {
  id?: number;
  assumptions: string;
  code: string;
  description: string;
  impact_indicator_id: number | null;
  impact_indicators?: ImpactIndicator | null;
  /** count of the number of impact updates */
  impact_updates?: number | null;
  output_id: number;
  /** as a decimal, calculated as (value / target) */
  percentage_complete?: number | null;
  /** count of the number of progress updates */
  progress_updates?: number | null;
  project_id: number;
  target: number | null;
  unit: string;
  updates?: Update[];
  /** sum of the value of all updates matching the relevant output_measurable */
  value?: number | null;
  verification: string;
}

export type Update = {
  id: number;
  created_at: string;
  edited_at: string;
  date: string;
  project_id: number;
  output_measurable_id: number | null;
  type: string;
  description: string;
  value: number;
  link: string;
  posted_by: string;
  year: number;
  impact_indicator_id: number | null;
  source: string;
  original: boolean;
  duplicate: boolean;
  verified: boolean;
  valid: boolean;
  projects?: ProjectMetadata;
  output_measurables?: OutputMeasurable;
  impact_indicators?: ImpactIndicator;
  users?: User;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
};

export type OutputActivity = {
  id: number;
  activity_code: string;
  activity_description: string;
  activity_status: string;
  created_at: string;
  output_id: number;
  project_id: number;
};
