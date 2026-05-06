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

export interface PriceDriftAlert {
  provider: string;
  service: string;
  instanceType: string;
  oldPrice: number;
  newPrice: number;
  pctChange: number;
}

export interface StaleDataAlert {
  provider: string;
  service: string;
  dataSource: string;
  lastUpdated: Date;
  daysSinceUpdate: number;
}

export async function sendPriceDriftEmail(alerts: PriceDriftAlert[]): Promise<void> {
  if (alerts.length === 0) return;

  const rows = alerts
    .map(a =>
      `  • ${a.provider} / ${a.service} / ${a.instanceType}: ` +
      `$${a.oldPrice.toFixed(4)} → $${a.newPrice.toFixed(4)} ` +
      `(${a.pctChange > 0 ? '+' : ''}${a.pctChange.toFixed(1)}%)`
    )
    .join('\n');

  const body =
    `The following instances changed price by more than 20% during the last pricing fetch:\n\n` +
    `${rows}\n\n` +
    `These are likely static-config entries that need manual review. ` +
    `Open the relevant config file and update the prices, or check if a live API adapter is now available.`;

  if (!isMailerConfigured()) {
    console.warn('⚠️  SMTP not configured — price drift alert (not sent):\n' + body);
    return;
  }

  await createTransport().sendMail({
    from: ALERT_FROM,
    to: ALERT_TO,
    subject: `[CCC] Price drift detected — ${alerts.length} instance(s) changed >20%`,
    text: body,
  });
  console.log(`📧 Price drift email sent (${alerts.length} instances)`);
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
