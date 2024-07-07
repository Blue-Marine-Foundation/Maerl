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
  outputNumber?: number;
  funding_requests?: any[];
}

export interface ImpactIndicator {
  id: number;
  indicator_code: string;
  indicator_title: string;
  indicator_unit: string;
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
  impact_indicators: ImpactIndicator;
}

export interface UpdateNested {
  id: number;
  project_id: number;
  slug: string;
  date: string;
  output_measurable_id: string | number | undefined;
  type: string;
  description: string;
  value: number | null;
  link: string | null;
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
  funding_partner?: string;
  funders?: [
    {
      name: string;
    }
  ];
  highlight_color: string;
  outputs?: Output[];
  output_measurables?: Measurable[];
  updates?: Update[];
  stub: boolean;
}

export interface ProjectMetadata {
  id: number;
  created_at: string;
  name: string;
  organisation_id: number | null;
  lead_partner: string | null;
  highlight_color: string;
  project_manager_id: string | null;
  start_date: string | null;
  delivery_partners:
    | [
        {
          name: string;
        }
      ]
    | null;
  funding_partner: string | null;
  funders:
    | [
        {
          name: string;
        }
      ]
    | null;
  slug: string;
  stub: boolean;
  regional_strategy: string | null;
  pillars: string | null;
  project_contacts:
    | [
        {
          name: string;
          organisation: string | null;
        }
      ]
    | null;
  funding_status: string | null;
  unit_requirements: string | null;
  project_issues: string | null;
  exit_strategy: string | null;
  local_partners:
    | [
        {
          person: string;
          organisation: string | null;
        }
      ]
    | null;
  users?: {
    created_at: string;
    first_name: string;
    id: string;
    last_name: string;
    role: string;
  };
  impacts?: {
    created_at: string;
    id: number;
    project_id: number;
    title: string;
  }[];
  outcomes?: {
    code: string;
    created_at: string;
    description: string;
    id: number;
    project_id: number;
  }[];
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
