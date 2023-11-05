export interface Params {
  slug: string;
}

export interface ProjectDetails {
  slug: string;
  title: string;
  date: string;
}

export interface Project {
  id: number;
  created_at: string;
  name: string;
  operator: string;
}

export interface Measurable {
  code: string;
  description: string;
  verification: string;
}
