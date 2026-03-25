const BRAND = {
  primary: '#0f172a',
  teal: '#06b6d4',
  text: '#334155',
  muted: '#94a3b8',
  bg: '#f8fafc',
}

function wrapper(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:20px;font-weight:700;color:${BRAND.primary};margin:0;">The Human Factor</h1>
      <p style="font-size:11px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;margin:4px 0 0;">System Improvement & AI Integration</p>
    </div>
    <div style="background:white;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
      ${content}
    </div>
    <div style="text-align:center;margin-top:24px;font-size:12px;color:${BRAND.muted};">
      <p>&copy; ${new Date().getFullYear()} The Human Factor. Waterloo, Ontario.</p>
      <p><a href="https://thehumanfactor.ca" style="color:${BRAND.teal};text-decoration:none;">thehumanfactor.ca</a></p>
    </div>
  </div>
</body>
</html>`
}

export function contactConfirmationEmail(name: string) {
  return wrapper(`
    <h2 style="font-size:22px;font-weight:700;color:${BRAND.primary};margin:0 0 16px;">Thank you, ${name}.</h2>
    <p style="font-size:15px;color:${BRAND.text};line-height:1.7;margin:0 0 16px;">
      We have received your message and will get back to you within 24 hours.
    </p>
    <p style="font-size:15px;color:${BRAND.text};line-height:1.7;margin:0 0 24px;">
      In the meantime, you may find our AI Readiness Assessment helpful — it takes about 5 minutes
      and gives you a personalized report on your organization's readiness.
    </p>
    <a href="https://thehumanfactor.ca/assessment" style="display:inline-block;padding:12px 28px;background:${BRAND.teal};color:white;border-radius:8px;font-weight:600;text-decoration:none;font-size:14px;">
      Take the Assessment
    </a>
  `)
}

export function contactNotificationEmail(contact: {
  name: string
  email: string
  organization?: string
  message?: string
}) {
  return wrapper(`
    <h2 style="font-size:18px;font-weight:700;color:${BRAND.primary};margin:0 0 16px;">New Contact Submission</h2>
    <table style="width:100%;font-size:14px;color:${BRAND.text};">
      <tr><td style="padding:8px 0;font-weight:600;width:120px;">Name</td><td>${contact.name}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;">Email</td><td><a href="mailto:${contact.email}" style="color:${BRAND.teal};">${contact.email}</a></td></tr>
      ${contact.organization ? `<tr><td style="padding:8px 0;font-weight:600;">Organization</td><td>${contact.organization}</td></tr>` : ''}
    </table>
    ${contact.message ? `<div style="margin-top:16px;padding:16px;background:${BRAND.bg};border-radius:8px;font-size:14px;color:${BRAND.text};line-height:1.6;">${contact.message}</div>` : ''}
    <p style="margin-top:20px;font-size:13px;color:${BRAND.muted};">
      <a href="https://thehumanfactor.ca/admin/contacts" style="color:${BRAND.teal};text-decoration:none;">View in Admin &rarr;</a>
    </p>
  `)
}

export function quizResultsEmail(
  name: string,
  overallScore: number,
  dimensionScores: Record<string, { pct: number }>
) {
  const level =
    overallScore >= 78 ? 'Implementation Ready' :
    overallScore >= 56 ? 'Ready for Assessment' :
    overallScore >= 34 ? 'Getting Ready' :
    'Foundation Building'

  const levelColor =
    overallScore >= 78 ? '#16a34a' :
    overallScore >= 56 ? '#3b82f6' :
    overallScore >= 34 ? '#d97706' :
    '#dc2626'

  const dims = Object.entries(dimensionScores)
    .map(([key, val]) => `<tr><td style="padding:6px 0;font-size:14px;color:${BRAND.text};text-transform:capitalize;">${key}</td><td style="text-align:right;font-weight:600;color:${BRAND.primary};">${val.pct}%</td></tr>`)
    .join('')

  return wrapper(`
    <h2 style="font-size:22px;font-weight:700;color:${BRAND.primary};margin:0 0 8px;">Your AI Readiness Results</h2>
    <p style="font-size:14px;color:${BRAND.muted};margin:0 0 24px;">Hi ${name}, here is a summary of your assessment.</p>

    <div style="text-align:center;padding:24px;background:${BRAND.bg};border-radius:12px;margin-bottom:24px;">
      <div style="font-size:48px;font-weight:700;color:${levelColor};">${overallScore}%</div>
      <div style="display:inline-block;padding:4px 16px;background:${levelColor};color:white;border-radius:16px;font-size:13px;font-weight:600;margin-top:8px;">${level}</div>
    </div>

    <h3 style="font-size:16px;font-weight:600;color:${BRAND.primary};margin:0 0 12px;">Dimension Scores</h3>
    <table style="width:100%;border-collapse:collapse;">${dims}</table>

    <div style="margin-top:24px;text-align:center;">
      <p style="font-size:14px;color:${BRAND.text};margin-bottom:16px;">Want a deeper analysis? We can help identify your highest-value opportunities.</p>
      <a href="https://thehumanfactor.ca/contact" style="display:inline-block;padding:12px 28px;background:${BRAND.teal};color:white;border-radius:8px;font-weight:600;text-decoration:none;font-size:14px;">
        Book a Free Conversation
      </a>
    </div>
  `)
}
