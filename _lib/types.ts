export interface Params {
  slug: string;
}

export interface User {
  first_name: string;
  last_name: string;
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
  output_measurables: Measurable[];
}

export interface Update {
  id: number;
  project_id: number;
  slug: string;
  date: string;
  output_measurable_id: string | number | undefined;
  type: string;
  description: string;
  value: number | null;
  link: string | null;
  projects: Project;
  output_measurables: Measurable;
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
  slug: string;
  name: string;
  lead_partner: string;
  start_date: string;
  delivery_partners?: [
    {
      name: string;
    }
  ];
  funding_partner?: [
    {
      name: string;
    }
  ];
  funders?: [
    {
      name: string;
    }
  ];
  highlight_color: string;
  outputs?: Output[];
  output_measurables?: Measurable[];
  updates?: Update[];
}

export interface Project_W_Outputs {
  id: number;
  created_at: string;
  slug: string;
  name: string;
  lead_partner: string;
  start_date: string;
  delivery_partners?: [
    {
      name: string;
    }
  ];
  funding_partner?: [
    {
      name: string;
    }
  ];
  funders?: [
    {
      name: string;
    }
  ];
  highlight_color: string;
  outputs: Output[];
}
