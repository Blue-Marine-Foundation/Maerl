import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

// Always provision a disposable database. No application credentials are read.
const directory = mkdtempSync('/tmp/maerl-db-tests-');
const data = join(directory, 'data');
const binary = (name) =>
  process.env.POSTGRES_BIN ? join(process.env.POSTGRES_BIN, name) : name;
const run = (name, args) =>
  execFileSync(binary(name), args, { encoding: 'utf8', stdio: 'pipe' });
let started = false;
try {
  run('initdb', ['-D', data, '-A', 'trust', '--no-locale', '-E', 'UTF8']);
  run('pg_ctl', [
    '-D',
    data,
    '-l',
    join(directory, 'postgres.log'),
    '-o',
    `-k ${directory} -p 55472 -h ''`,
    'start',
  ]);
  started = true;
  const sql = (file) =>
    run('psql', [
      '-h',
      directory,
      '-p',
      '55472',
      '-d',
      'postgres',
      '-v',
      'ON_ERROR_STOP=1',
      '-f',
      resolve(file),
    ]);
  sql('tests/database/fixture.sql');
  sql('supabase/migrations/20260907090000_outcome_indicator_updates.sql');
  sql('supabase/migrations/20261013090000_progress_only_outcome_indicators.sql');
  sql('supabase/migrations/20261030090000_reviewed_impact_does_not_require_verification.sql');
  sql('supabase/migrations/20261126130000_allow_output_indicator_remap_sync.sql');
  const files = process.argv.slice(2).length
    ? process.argv.slice(2)
    : readdirSync('tests/database')
        .filter((name) => name.endsWith('.sql') && name !== 'fixture.sql')
        .map((name) => `tests/database/${name}`);
  for (const file of files) {
    sql(file);
    console.log(`PASS ${file}`);
  }
} catch (error) {
  console.error(error.stderr?.toString() || error.message);
  process.exitCode = 1;
} finally {
  if (started) run('pg_ctl', ['-D', data, '-m', 'fast', 'stop']);
  rmSync(directory, { recursive: true, force: true });
}
