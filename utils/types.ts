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
