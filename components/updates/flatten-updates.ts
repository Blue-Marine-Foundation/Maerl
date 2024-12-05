import { Update } from '@/utils/types';

export const flattenUpdates = (updates: Update[]) => {
  return updates.map((update) => {
    const update_id = update.id;
    const project = update.projects?.name ?? '';
    const maerl_slug = update.projects?.slug ?? '';
    const impact_indicator = update.impact_indicators?.indicator_code ?? '';
    const posted_by =
      `${update.users?.first_name ?? ''} ${update.users?.last_name ?? ''}`.trim();
    return {
      update_id,
      created_at: update.created_at,
      update_date: update.date ?? '',
      maerl_slug,
      project,
      output_indicator_code: update.output_measurables?.code ?? '',
      output_indicator_description:
        update.output_measurables?.description ?? '',
      impact_indicator,
      update_type: update.type,
      description: update.description,
      value: update.value,
      link: update.link ?? '',
      posted_by,
    };
  });
};
