export type Difficulty = "Easy" | "Medium" | "Hard";

export type Choice = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
};

export type Scenario = {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  timer: number; // seconds
  description: string;
  preview: {
    type: "email" | "message" | "popup" | "url" | "device";
    from?: string;
    subject?: string;
    body: string;
    url?: string;
  };
  choices: Choice[];
  bestPractice: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    title: "Urgent Bank Notice",
    category: "Phishing Email",
    difficulty: "Easy",
    timer: 45,
    description: "You received this email claiming to be from your bank.",
    preview: {
      type: "email",
      from: "support@secure-bank-verify.com",
      subject: "URGENT: Your account will be suspended in 24h",
      body: "Dear customer, suspicious activity detected. Click here to verify your identity immediately or your account will be permanently disabled: http://secure-bank-verify.com/login",
    },
    choices: [
      { id: "a", label: "Click the link and log in to verify", correct: false, explanation: "Never click links in urgency emails. The domain is not your bank's official domain." },
      { id: "b", label: "Reply asking for confirmation", correct: false, explanation: "Replying confirms your address is active and invites further attacks." },
      { id: "c", label: "Delete the email and contact the bank using the official app/website", correct: true, explanation: "Always verify through trusted channels you initiate yourself." },
      { id: "d", label: "Forward it to all coworkers as warning", correct: false, explanation: "Spreads risk. Report to IT/security team instead." },
    ],
    bestPractice: "Hover over links to inspect URLs. Banks never ask you to verify credentials via email links.",
  },
  {
    id: "s2",
    title: "CEO Wire Transfer",
    category: "Business Email Compromise",
    difficulty: "Medium",
    timer: 40,
    description: "You receive this from someone claiming to be your CEO.",
    preview: {
      type: "email",
      from: "ceo.johnson@company-corp-mail.com",
      subject: "Quick favor — need this done now",
      body: "Hi, I'm in a meeting. Please process a wire transfer of $24,500 to vendor account 8821-7733. Don't call, just confirm by reply. Thanks.",
    },
    choices: [
      { id: "a", label: "Process immediately — it's the CEO", correct: false, explanation: "Classic BEC attack. Urgency + secrecy + money = red flag." },
      { id: "b", label: "Verify by phone using a known number, not the email", correct: true, explanation: "Out-of-band verification stops impersonation attempts." },
      { id: "c", label: "Reply asking for more details", correct: false, explanation: "The attacker controls the inbox. Replies reach them, not the CEO." },
      { id: "d", label: "Ignore it", correct: false, explanation: "Ignoring it leaves the threat live for others. Always report." },
    ],
    bestPractice: "Always verify financial requests via a second trusted channel (phone, in-person).",
  },
  {
    id: "s3",
    title: "Free USB Drive",
    category: "Social Engineering",
    difficulty: "Easy",
    timer: 30,
    description: "You find a USB drive labeled 'Salaries 2025' in the office parking lot.",
    preview: { type: "device", body: "Unlabeled USB stick found near the entrance. Curiosity is high." },
    choices: [
      { id: "a", label: "Plug it in to find the owner", correct: false, explanation: "USB drops are a common attack to deliver malware on insertion." },
      { id: "b", label: "Take it home and check on personal laptop", correct: false, explanation: "Same risk, just on a different device." },
      { id: "c", label: "Hand it to IT/Security without plugging it in", correct: true, explanation: "Security can analyze it safely in a sandboxed environment." },
      { id: "d", label: "Throw it away", correct: false, explanation: "Better than plugging in, but IT should investigate the threat." },
    ],
    bestPractice: "Never plug in unknown USB devices. They can auto-execute malware via HID emulation.",
  },
  {
    id: "s4",
    title: "Look-alike Login Page",
    category: "Fake Login",
    difficulty: "Medium",
    timer: 35,
    description: "A link from a search ad opens this URL. Your password manager doesn't auto-fill.",
    preview: {
      type: "url",
      url: "https://accounts-google.secure-login-portal.io/signin",
      body: "Standard-looking Google sign-in page asking for your email and password.",
    },
    choices: [
      { id: "a", label: "Enter credentials — page looks normal", correct: false, explanation: "The domain is not google.com. Your password manager refusing to fill is a strong signal." },
      { id: "b", label: "Close the tab and navigate to the real site directly", correct: true, explanation: "Always type known URLs or use bookmarks for sensitive logins." },
      { id: "c", label: "Use your work password instead", correct: false, explanation: "Reusing or substituting passwords on suspicious sites still leaks credentials." },
      { id: "d", label: "Sign in with Google SSO popup on the page", correct: false, explanation: "Fake SSO popups are common phishing payloads." },
    ],
    bestPractice: "Trust your password manager — it matches by exact domain. Anomalies mean stop.",
  },
  {
    id: "s5",
    title: "IT Support Caller",
    category: "Vishing",
    difficulty: "Medium",
    timer: 40,
    description: "Someone calls claiming to be IT, asking for your password to fix a 'critical issue'.",
    preview: {
      type: "message",
      from: "+1 (555) 010-9921",
      body: "Hi, this is Mike from IT. We detected malware on your machine. I need your login password to remediate before EOD. Please share it now.",
    },
    choices: [
      { id: "a", label: "Give them the password to be safe", correct: false, explanation: "IT never asks for your password. Ever." },
      { id: "b", label: "Ask for their employee ID and email it to them", correct: false, explanation: "Attackers easily fake IDs." },
      { id: "c", label: "Hang up and contact IT through the official internal channel", correct: true, explanation: "Verify through known internal directories or ticketing." },
      { id: "d", label: "Put them on hold while you check Slack", correct: false, explanation: "Better, but hanging up is safest. Don't keep social engineers on the line." },
    ],
    bestPractice: "Legitimate IT teams never request your password. Always verify via internal channels.",
  },
  {
    id: "s6",
    title: "Invoice Attachment",
    category: "Malicious Attachment",
    difficulty: "Medium",
    timer: 35,
    description: "An unexpected email with an attached invoice arrives.",
    preview: {
      type: "email",
      from: "billing@acmme-supplies.com",
      subject: "Invoice #INV-99812 — Past Due",
      body: "Please find attached invoice INV-99812.docm. Open and enable macros to view the secure content.",
    },
    choices: [
      { id: "a", label: "Open the file and enable macros", correct: false, explanation: "Macro-enabled docs are a top malware delivery method." },
      { id: "b", label: "Save the file and scan with antivirus before opening", correct: false, explanation: "AV may miss novel malware. Best to not open unsolicited attachments." },
      { id: "c", label: "Verify with the supposed sender via a known contact, then report to IT", correct: true, explanation: "Confirm legitimacy out-of-band; report unsolicited attachments." },
      { id: "d", label: "Forward to your manager to decide", correct: false, explanation: "Spreads risk to others. Report through proper channels first." },
    ],
    bestPractice: "Never enable macros on documents from unknown or unverified senders.",
  },
  {
    id: "s7",
    title: "Public Wi-Fi at the Airport",
    category: "Network Security",
    difficulty: "Easy",
    timer: 30,
    description: "You need to check your bank balance while waiting for a flight.",
    preview: {
      type: "message",
      from: "Available networks",
      body: "Free_Airport_WiFi (open) — Strong signal. No password required.",
    },
    choices: [
      { id: "a", label: "Connect and access banking — it's quick", correct: false, explanation: "Open networks expose traffic to interception and rogue APs." },
      { id: "b", label: "Use cellular data or a trusted VPN before logging in", correct: true, explanation: "Cellular or VPN encrypts traffic and prevents man-in-the-middle attacks." },
      { id: "c", label: "Connect, but use HTTP only", correct: false, explanation: "HTTP transmits data in plaintext — worse, not better." },
      { id: "d", label: "Connect and disable firewall to speed up", correct: false, explanation: "Disabling defenses on a hostile network is dangerous." },
    ],
    bestPractice: "Avoid sensitive activities on open Wi-Fi. Use a reputable VPN or mobile data.",
  },
  {
    id: "s8",
    title: "Browser Update Popup",
    category: "Malware",
    difficulty: "Hard",
    timer: 30,
    description: "A popup appears while browsing a news site.",
    preview: {
      type: "popup",
      body: "Your Chrome is out of date! Critical security update required. Click here to install ChromeUpdate.exe immediately.",
    },
    choices: [
      { id: "a", label: "Download and run the updater", correct: false, explanation: "Browsers update themselves — popups offering downloads deliver malware." },
      { id: "b", label: "Close the popup and update Chrome from chrome://settings/help", correct: true, explanation: "Always update software from inside the application or vendor site." },
      { id: "c", label: "Allow notifications to receive the update", correct: false, explanation: "Allowing notifications opens further phishing vectors." },
      { id: "d", label: "Click 'Remind me later'", correct: false, explanation: "Buttons in malicious popups can trigger downloads regardless of label." },
    ],
    bestPractice: "Updates come from the software itself, never from random popups.",
  },
  {
    id: "s9",
    title: "QR Code Parking Meter",
    category: "Quishing",
    difficulty: "Hard",
    timer: 35,
    description: "A QR code sticker on a parking meter promises 'Quick mobile pay'.",
    preview: {
      type: "url",
      url: "https://parkpay-secure.app/pay?meter=3321",
      body: "Sticker placed over the original meter signage. The URL is unfamiliar.",
    },
    choices: [
      { id: "a", label: "Scan and pay — convenient", correct: false, explanation: "Quishing: attackers paste fake QR codes over legitimate ones to harvest payment info." },
      { id: "b", label: "Use the city's official parking app or pay at the meter directly", correct: true, explanation: "Use known apps from official sources only." },
      { id: "c", label: "Scan and check the URL only", correct: false, explanation: "The URL look-alike is deceptive; many users miss subtle differences." },
      { id: "d", label: "Scan and enter test info first", correct: false, explanation: "Even visiting the page may load tracking or exploit kits." },
    ],
    bestPractice: "Treat unexpected QR codes like unknown links. Prefer official apps.",
  },
  {
    id: "s10",
    title: "Slack Reset Request",
    category: "Credential Phishing",
    difficulty: "Hard",
    timer: 30,
    description: "An unexpected Slack message lands in your DMs.",
    preview: {
      type: "message",
      from: "Slackbot (impersonator)",
      body: "Security notice: We detected an unusual login. Reset your password here: https://slack-account-reset.helpdesk-portal.co/u/9981",
    },
    choices: [
      { id: "a", label: "Click and reset password to be safe", correct: false, explanation: "Domain is not slack.com. Real Slackbot doesn't DM password reset links." },
      { id: "b", label: "Open Slack settings directly and review active sessions", correct: true, explanation: "Manage account security from inside the app you trust." },
      { id: "c", label: "Reply 'who is this?'", correct: false, explanation: "Engaging the attacker confirms you're a live target." },
      { id: "d", label: "Click the link but don't enter password", correct: false, explanation: "Just visiting can fingerprint your device or trigger drive-by exploits." },
    ],
    bestPractice: "Manage account security from inside the official app, not from inbound links.",
  },
];

export type LevelDef = { name: string; min: number };
export const LEVELS: LevelDef[] = [
  { name: "Beginner", min: 0 },
  { name: "Aware User", min: 30 },
  { name: "Security Analyst", min: 70 },
  { name: "Cyber Defender", min: 110 },
];

export function getLevel(xp: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) current = l;
  const next = LEVELS.find((l) => l.min > xp);
  return { current, next };
}
