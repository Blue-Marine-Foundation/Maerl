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
}

export interface Update {
  id: number;
  project_id: number;
  date: string;
  output_measurable_id: string;
  type: string;
  description: string;
  value: number;
  link: string;
}

export interface Project {
  id: number;
  created_at: string;
  name: string;
  operator: string;
  outputs?: Output[];
  updates?: Update[];
}

export interface Measurable {
  code: string;
  description: string;
  verification: string;
}
