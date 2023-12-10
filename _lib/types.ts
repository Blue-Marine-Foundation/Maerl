export interface Params {
  slug: string;
}

export interface ProjectDetails {
  slug: string;
  title: string;
  date: string;
}

export interface Output {
  length: any;
  id: number;
  project_id: number;
  outcome_measurable_id: number;
  code: string;
  description: string;
  percentage_complete: string;
  status: string;
  output_measurables?: Measurable[];
}

export interface Update {
  id: number;
  project_id: number;
  date: string;
  output_measurable_id: string | number | undefined;
  type: string;
  description: string;
  value: number | null;
  link: string | null;
  projects?: Project;
  output_measurables?: Measurable;
}

export interface FlatUpdate {
  id: number;
  created_at: string;
  date: string;
  project_id: number;
  output_measurable_id: number;
  type: string;
  description: string;
  value: number | null;
  link: string | null;
  project_created_at: string;
  project_name: string;
  project_organisation_id: number;
  project_operator: string;
  project_highlight_color: string;
  project_project_manager_id: string;
  project_start_date: string;
  output_id: number;
  output_created_at: string;
  output_project_id: number;
  output_output_id: number;
  output_code: string;
  output_description: string;
  output_unit: string;
  output_impact_indicator: number;
  output_target: number;
  output_verification: string;
  output_assumptions: string;
  output_value: number;
  output_progress_updates: number | null;
  output_impact_updates: number | null;
  output_percentage_complete: number;
  impact_id?: number;
  impact_created_at?: string;
  impact_updated_at?: string | null;
  impact_indicator_code?: string;
  impact_indicator_title?: string;
  impact_indicator_unit?: string;
}

export interface Measurable {
  [x: string]: any; // Index signature
  id: number;
  project_id: number;
  output_id: number;
  code: string;
  description: string;
  unit: string;
  impact_indicator: number;
  target: number;
  verification: string;
  assumptions: string;
  value: number;
  progress_updates: number;
  impact_updates: number;
  percentage_complete: number;
}

export interface Project {
  id: number;
  created_at: string;
  name: string;
  operator: string;
  highlight_color: string;
  outputs?: Output[];
  output_measurables?: Measurable[];
  updates?: Update[];
}
