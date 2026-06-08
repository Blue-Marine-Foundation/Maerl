import { NextResponse } from 'next/server';
import { fetchActivityHeatmap } from '@/components/overview/activity-heatmap-server-actions';

function parseYear(value: string | null): number | undefined {
  if (!value) return undefined;

  const year = Number(value);
  if (!Number.isInteger(year)) return undefined;

  return year;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseYear(searchParams.get('year'));

  try {
    const data = await fetchActivityHeatmap(year);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load weekly activity';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
