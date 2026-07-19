import nodemailer from 'nodemailer';

const ALERT_TO = 'hello@comparecloudcosts.com';
const ALERT_FROM = process.env.SMTP_FROM || ALERT_TO;

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

function isMailerConfigured(): boolean {
  return !!process.env.SMTP_HOST;
}

export interface StaleDataAlert {
  provider: string;
  service: string;
  dataSource: string;
  lastUpdated: Date;
  daysSinceUpdate: number;
}

export async function sendStalenessEmail(alerts: StaleDataAlert[]): Promise<void> {
  if (alerts.length === 0) return;

  const rows = alerts
    .map(a =>
      `  • ${a.provider} / ${a.service} (${a.dataSource}): ` +
      `last updated ${a.daysSinceUpdate} day(s) ago (${a.lastUpdated.toISOString().slice(0, 10)})`
    )
    .join('\n');

  const body =
    `The following services have not had their pricing data refreshed in more than 7 days:\n\n` +
    `${rows}\n\n` +
    `These are static-config entries — provider pricing may have changed. ` +
    `Verify the prices at the provider's pricing page and update the config files in src/config/.`;

  if (!isMailerConfigured()) {
    console.warn('⚠️  SMTP not configured — staleness alert (not sent):\n' + body);
    return;
  }

  await createTransport().sendMail({
    from: ALERT_FROM,
    to: ALERT_TO,
    subject: `[CCC] Stale pricing data — ${alerts.length} service(s) not refreshed in >7 days`,
    text: body,
  });
  console.log(`📧 Staleness email sent (${alerts.length} services)`);
}

export interface DataQualityAlert {
  severity: 'error' | 'warn';
  kind: string;
  detail: string;
}

export async function sendDataQualityEmail(alerts: DataQualityAlert[]): Promise<void> {
  if (alerts.length === 0) return;

  const fmt = (sev: string) =>
    alerts.filter(a => a.severity === sev).map(a => `  • [${a.kind}] ${a.detail}`).join('\n');
  const errors = alerts.filter(a => a.severity === 'error');
  const body =
    `Automated data-quality checks found ${alerts.length} catalog issue(s) that can make ` +
    `workload comparisons show false "N/A" values:\n\n` +
    (errors.length ? `ERRORS (${errors.length}):\n${fmt('error')}\n\n` : '') +
    (alerts.length - errors.length ? `WARNINGS (${alerts.length - errors.length}):\n${fmt('warn')}\n\n` : '') +
    `Most issues are resolved by re-ingesting the affected pipeline ` +
    `(POST /api/admin/fetch-pricing?type=<pipeline>) or fixing the provider's config in src/config/.`;

  if (!isMailerConfigured()) {
    console.warn('⚠️  SMTP not configured — data-quality alert (not sent):\n' + body);
    return;
  }

  await createTransport().sendMail({
    from: ALERT_FROM,
    to: ALERT_TO,
    subject: `[CCC] Data-quality issues — ${errors.length} error(s), ${alerts.length - errors.length} warning(s)`,
    text: body,
  });
  console.log(`📧 Data-quality email sent (${alerts.length} issues)`);
}
