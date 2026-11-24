import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import OutcomeIndicatorsTable from '@/components/logframe/outcome-indicators-table';
import OutputIndicatorsTable from '@/components/logframe/output-indicators-table';
import type { OutcomeMeasurable, OutputMeasurable } from '@/utils/types';

vi.mock('@/components/logframe/outcome-measurable-form', () => ({
  default: () => null,
}));
vi.mock('@/components/updates/update-form', () => ({
  default: () => <textarea aria-label='Description' defaultValue='' />,
}));
vi.mock('@/components/logframe/output-measurable-form', () => ({
  default: () => null,
}));
vi.mock('@/components/archive-toggle/archive-toggle', () => ({
  default: () => null,
}));
afterEach(cleanup);
const measurable = {
  id: 10,
  outcome_id: 2,
  project_id: 1,
  code: 'OC.0.1',
  description: 'Community understanding',
  impact_indicator_id: 533,
  impact_indicators: { id: 533, indicator_code: '5.3.3' },
  updates: [],
} as unknown as OutcomeMeasurable;

test('an open outcome update and its draft survive a parent refresh', () => {
  const props = {
    measurables: [measurable],
    outcomeId: 2,
    projectId: 1,
    canEdit: true,
  };
  const { rerender } = render(<OutcomeIndicatorsTable {...props} />);
  fireEvent.click(screen.getByRole('button', { name: 'Add update' }));
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: 'Unsaved draft' },
  });
  rerender(
    <OutcomeIndicatorsTable {...props} measurables={[{ ...measurable }]} />,
  );
  expect(screen.queryByRole('dialog')).not.toBeNull();
  expect(
    (screen.getByLabelText('Description') as HTMLTextAreaElement).value,
  ).toBe('Unsaved draft');
});

test('an open output update and its draft survive a parent refresh', () => {
  const output = { ...measurable, output_id: 3 } as unknown as OutputMeasurable;
  const props = {
    measurables: [output],
    outputId: 3,
    projectId: 1,
    outputCode: 'O.1',
  };
  const { rerender } = render(<OutputIndicatorsTable {...props} />);
  fireEvent.click(screen.getByRole('button', { name: 'Add update' }));
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: 'Output draft' },
  });
  rerender(<OutputIndicatorsTable {...props} measurables={[{ ...output }]} />);
  expect(screen.queryByRole('dialog')).not.toBeNull();
  expect(
    (screen.getByLabelText('Description') as HTMLTextAreaElement).value,
  ).toBe('Output draft');
});

test('a confirmed Progress-only outcome opens the update form without an Impact mapping', () => {
  render(
    <OutcomeIndicatorsTable
      measurables={[
        {
          ...measurable,
          impact_indicator_id: null,
          impact_indicators: null,
          progress_only: true,
        },
      ]}
      outcomeId={2}
      projectId={1}
      canEdit
    />,
  );
  expect(screen.getByText('Progress only')).not.toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Add update' }));
  expect(screen.getByLabelText('Description')).not.toBeNull();
});

test('an unresolved unmapped outcome still requires a mapping before adding updates', () => {
  render(
    <OutcomeIndicatorsTable
      measurables={[
        { ...measurable, impact_indicator_id: null, impact_indicators: null },
      ]}
      outcomeId={2}
      projectId={1}
      canEdit
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Add update' }));
  expect(
    screen.getByText(/An admin must map this Outcome Indicator/),
  ).not.toBeNull();
  expect(screen.queryByLabelText('Description')).toBeNull();
});
