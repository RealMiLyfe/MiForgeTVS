export interface GridPosition {
  x: number;
  y: number;
  slug: string;
}

export interface GridLayout {
  columns: number;
  rows: number;
  positions: GridPosition[];
}

export function calculateGridLayout(
  agentSlugs: string[],
  viewportWidth: number
): GridLayout {
  const count = agentSlugs.length;
  let columns: number;

  if (viewportWidth < 768) columns = 1;
  else if (viewportWidth < 1200) columns = 2;
  else if (count <= 3) columns = count;
  else if (count <= 9) columns = 3;
  else columns = 4;

  const rows = Math.ceil(count / columns);
  const positions: GridPosition[] = agentSlugs.map((slug, i) => ({
    x: i % columns,
    y: Math.floor(i / columns),
    slug,
  }));

  return { columns, rows, positions };
}
