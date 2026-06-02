export type Difficulty = "Easy" | "Medium" | "Hard";
export type AttackVector = "urgency" | "authority" | "technical" | "social" | "process";

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
  timer: number;
  description: string;
  attackVector: AttackVector;
  redFlags: string[];
  realWorldExample: string;
  mitreId: string;
  cognitiveBias: string;
  manipulationTechnique: string;
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
    attackVector: "urgency",
    redFlags: [
      "Domain is 'secure-bank-verify.com' — not your bank's actual domain",
      "Threat of account suspension is engineered to trigger panic",
      "No personal greeting — mass phishing template sent to thousands",
    ],
    realWorldExample: "Mirrors the 2022 Chase Bank phishing campaign that harvested credentials from over 50,000 customers before detection.",
    mitreId: "T1566.002",
    cognitiveBias: "Loss Aversion + Availability Heuristic",
    manipulationTechnique: "Urgency engineering compresses decision time, suppressing analytical 'System 2' thinking in favour of reflexive 'System 1' reactions. The account-suspension threat exploits loss aversion — perceived losses feel twice as painful as equivalent gains, overriding rational verification.",
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
    attackVector: "authority",
    redFlags: [
      "Domain is 'company-corp-mail.com' — not the official company domain",
      "'Don't call' instruction deliberately removes your ability to verify",
      "No purchase order, reference number, or approval chain mentioned",
    ],
    realWorldExample: "Matches the 2016 Ubiquiti Networks BEC attack — attackers impersonated the CEO and stole $46.7 million in a single wire transfer.",
    mitreId: "T1534",
    cognitiveBias: "Authority Bias",
    manipulationTechnique: "Hierarchical deference is deeply wired in organizational culture. BEC attacks impersonate C-suite figures knowing most employees comply with leadership requests without independent verification — especially when the request includes an explicit instruction not to verify ('Don't call').",
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
    attackVector: "social",
    redFlags: [
      "Unknown physical media from an unverified source",
      "Label 'Salaries 2025' is crafted to trigger curiosity and override caution",
      "Found in an uncontrolled area — classic baiting placement",
    ],
    realWorldExample: "This exact technique was used in the 2008 US DoD breach (Operation Buckshot Yankee) — infected drives left in Pentagon parking lots compromised classified networks.",
    mitreId: "T1091",
    cognitiveBias: "Curiosity Gap",
    manipulationTechnique: "The label 'Salaries 2025' creates an information gap the brain is compelled to close. Baiting exploits intrinsic curiosity as a social engineering vector — the more taboo or desirable the label, the stronger the urge to override caution.",
    preview: { type: "device", body: "USB drive found near the building entrance. Label reads: 'Salaries 2025 — Confidential'." },
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
    attackVector: "technical",
    redFlags: [
      "Domain is 'accounts-google.secure-login-portal.io' — not google.com",
      "Password manager refused to auto-fill — it matched the exact domain and found no credentials",
      "Arrived via a paid search ad, not a trusted bookmark or direct navigation",
    ],
    realWorldExample: "This technique was used in the 2022 Twilio and Cloudflare attacks — employees were lured to pixel-perfect fake login pages that harvested credentials in real time.",
    mitreId: "T1566.002",
    cognitiveBias: "Pattern Recognition Failure",
    manipulationTechnique: "The human visual cortex processes logos, colours, and layout as a holistic pattern. Pixel-perfect clones satisfy this Gestalt pattern match while the subdomain difference evades conscious scrutiny — especially under the cognitive load of a normal workday.",
    preview: {
      type: "url",
      url: "https://accounts-google.secure-login-portal.io/signin",
      body: "Standard-looking Google sign-in page requesting your email and password. Your password manager shows no saved credentials for this site.",
    },
    choices: [
      { id: "a", label: "Enter credentials — page looks normal", correct: false, explanation: "The domain is not google.com. Your password manager refusing to fill is a strong signal." },
      { id: "b", label: "Close the tab and navigate to the real site directly", correct: true, explanation: "Always type known URLs or use bookmarks for sensitive logins." },
      { id: "c", label: "Use your work password instead", correct: false, explanation: "Reusing or substituting passwords on suspicious sites still leaks credentials." },
      { id: "d", label: "Sign in with Google SSO popup on the page", correct: false, explanation: "Fake SSO popups are common phishing payloads." },
    ],
    bestPractice: "Trust your password manager — it matches by exact domain. When it won't fill, stop.",
  },
  {
    id: "s5",
    title: "IT Support Caller",
    category: "Vishing",
    difficulty: "Medium",
    timer: 40,
    description: "Someone calls claiming to be IT, asking for your password to fix a 'critical issue'.",
    attackVector: "authority",
    redFlags: [
      "Legitimate IT teams never ask for your password — ever",
      "Unknown number not listed in the company directory",
      "'Before EOD' deadline is designed to prevent you from thinking clearly",
    ],
    realWorldExample: "This vishing technique was central to the 2020 Twitter hack — attackers called Twitter staff impersonating IT to gain access to internal tools, then hijacked accounts of Obama, Biden, and Elon Musk.",
    mitreId: "T1598",
    cognitiveBias: "Authority Bias + Social Compliance",
    manipulationTechnique: "Vishing layers two of Cialdini's six influence principles — authority (IT department) and urgency (EOD deadline). Phone channels feel more immediate and credible than email, and the social norm of being helpful to colleagues suppresses the instinct to challenge the caller.",
    preview: {
      type: "message",
      from: "+1 (555) 010-9921",
      body: "Hi, this is Mike from IT. We detected malware on your machine. I need your login password to remediate before EOD. Please share it now.",
    },
    choices: [
      { id: "a", label: "Give them the password to be safe", correct: false, explanation: "IT never asks for your password. Ever." },
      { id: "b", label: "Ask for their employee ID and email it to them", correct: false, explanation: "Attackers easily fake IDs. This doesn't verify anything." },
      { id: "c", label: "Hang up and contact IT through the official internal channel", correct: true, explanation: "Verify through known internal directories or ticketing systems." },
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
    attackVector: "process",
    redFlags: [
      "File is '.docm' — a macro-enabled Word document, a top malware delivery vector",
      "'Enable macros to view' is a classic social engineering prompt used by malware",
      "Sender domain 'acmme-supplies.com' has a doubled letter — a deliberate typosquat",
    ],
    realWorldExample: "Emotet, the most destructive malware of 2017–2020, was delivered almost exclusively through macro-enabled Office documents sent as fake invoices like this one.",
    mitreId: "T1566.001",
    cognitiveBias: "Familiarity Bias",
    manipulationTechnique: "Embedding malware in familiar business workflows (invoices) reduces vigilance by satisfying schema expectations. The 'enable macros to view secure content' prompt is designed to frame a security bypass as a security feature — inverting the actual risk.",
    preview: {
      type: "email",
      from: "billing@acmme-supplies.com",
      subject: "Invoice #INV-99812 — Past Due",
      body: "Please find attached invoice INV-99812.docm. Open and enable macros to view the secure content. Payment is overdue — please action urgently.",
    },
    choices: [
      { id: "a", label: "Open the file and enable macros", correct: false, explanation: "Macro-enabled docs are a top malware delivery method." },
      { id: "b", label: "Save the file and scan with antivirus before opening", correct: false, explanation: "AV may miss novel malware. Best not to open unsolicited attachments at all." },
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
    attackVector: "process",
    redFlags: [
      "Open network with no password — no encryption on your traffic",
      "Generic SSID 'Free_Airport_WiFi' is commonly spoofed by rogue access points",
      "No captive portal or certificate to verify the network's legitimacy",
    ],
    realWorldExample: "Rogue AP attacks are demonstrated annually at DEF CON. In 2017, researchers intercepted unencrypted credentials from hundreds of conference attendees within minutes of setting up a fake AP.",
    mitreId: "T1557",
    cognitiveBias: "Optimism Bias",
    manipulationTechnique: "People systematically underestimate personal risk while accurately estimating population risk — 'this won't happen to me.' Open Wi-Fi feels safe because it is common and familiar. The combination of convenience and optimism bias overrides known security training.",
    preview: {
      type: "message",
      from: "Available networks",
      body: "Free_Airport_WiFi (open) — Strong signal. No password required. 412 users connected.",
    },
    choices: [
      { id: "a", label: "Connect and access banking — it's quick", correct: false, explanation: "Open networks expose all traffic to interception and rogue APs." },
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
    attackVector: "technical",
    redFlags: [
      "Browsers update themselves — they never prompt via web page popups",
      "Offers a downloadable .exe file from a random website",
      "Appeared on a third-party news site — content injection or malvertising vector",
    ],
    realWorldExample: "FakeUpdates (SocGholish) — active since 2018 and still among the top malware campaigns — uses fake browser update overlays to deliver remote access trojans to tens of thousands of victims.",
    mitreId: "T1189",
    cognitiveBias: "Automation Bias",
    manipulationTechnique: "Repeated legitimate interactions with browser update prompts create conditioned trust in the UI pattern. Fake overlays exploit this automation bias — users respond to the familiar visual template without evaluating its source, treating the pop-up as a trusted system message.",
    preview: {
      type: "popup",
      body: "⚠ Your Chrome browser is critically out of date! A security update is required immediately. Click Install to download ChromeUpdate.exe and protect your system.",
    },
    choices: [
      { id: "a", label: "Download and run the updater", correct: false, explanation: "Browsers update themselves — popups offering downloads deliver malware." },
      { id: "b", label: "Close the popup and update Chrome from chrome://settings/help", correct: true, explanation: "Always update software from inside the application or the vendor's official site." },
      { id: "c", label: "Allow notifications to receive the update", correct: false, explanation: "Allowing notifications opens further phishing and push-notification attack vectors." },
      { id: "d", label: "Click 'Remind me later'", correct: false, explanation: "Buttons in malicious popups can trigger downloads regardless of which button you click." },
    ],
    bestPractice: "Updates come from inside the software itself — never from web page popups.",
  },
  {
    id: "s9",
    title: "QR Code Parking Meter",
    category: "Quishing",
    difficulty: "Hard",
    timer: 35,
    description: "A QR code sticker on a parking meter promises 'Quick mobile pay'.",
    attackVector: "technical",
    redFlags: [
      "Sticker appears to be placed over original meter signage — check for physical tampering",
      "Domain 'parkpay-secure.app' is not an official city or known parking service",
      "No official city branding or seal on the sticker",
    ],
    realWorldExample: "In 2022, the FBI issued a public alert after attackers planted fake QR code stickers on parking meters across Austin, San Antonio, and Houston — harvesting payment data from hundreds of victims.",
    mitreId: "T1566.002",
    cognitiveBias: "Convenience Bias + Trust by Proximity",
    manipulationTechnique: "QR codes are opaque to pre-screening — their destination is hidden until scanned. The physical context of an official meter transfers legitimacy to the fraudulent code. Convenience eliminates the pause needed for verification.",
    preview: {
      type: "url",
      url: "https://parkpay-secure.app/pay?meter=3321",
      body: "A sticker placed on the meter reads: 'Scan to Pay — Quick Mobile Payment'. The linked URL is unfamiliar and not associated with the city's official parking service.",
    },
    choices: [
      { id: "a", label: "Scan and pay — convenient", correct: false, explanation: "Quishing: attackers paste fake QR codes over legitimate ones to harvest payment info." },
      { id: "b", label: "Use the city's official parking app or pay at the meter directly", correct: true, explanation: "Use known apps from official sources only. Verify QR code origins before scanning." },
      { id: "c", label: "Scan and check the URL before doing anything", correct: false, explanation: "Look-alike URLs are deceptive — many users miss subtle differences under time pressure." },
      { id: "d", label: "Scan and enter test info first", correct: false, explanation: "Even visiting the page may load tracking scripts or exploit kits." },
    ],
    bestPractice: "Treat unexpected QR codes like unknown links. Check for physical tampering and prefer official apps.",
  },
  {
    id: "s10",
    title: "Slack Reset Request",
    category: "Credential Phishing",
    difficulty: "Hard",
    timer: 30,
    description: "An unexpected Slack message lands in your DMs.",
    attackVector: "technical",
    redFlags: [
      "Domain is 'helpdesk-portal.co' — not slack.com",
      "Real Slackbot never sends DM password reset links — resets always come via email",
      "Unsolicited security notice you did not trigger yourself",
    ],
    realWorldExample: "Slack bot impersonation was used in the 2022 Rockstar Games breach — attackers used this technique to access GTA VI development footage and source code, causing hundreds of millions in damages.",
    mitreId: "T1566.002",
    cognitiveBias: "Conditioned Response + Fear of Loss",
    manipulationTechnique: "Legitimate platforms have trained users to react quickly to security alerts — a conditioned Pavlovian response. Platform impersonation hijacks this conditioned reflex, pairing the fear of account compromise with a fraudulent action that serves the attacker.",
    preview: {
      type: "message",
      from: "Slackbot (impersonator)",
      body: "Security notice: We detected an unusual login attempt on your account. Reset your password immediately to secure your workspace: https://slack-account-reset.helpdesk-portal.co/u/9981",
    },
    choices: [
      { id: "a", label: "Click and reset password to be safe", correct: false, explanation: "Domain is not slack.com. Real Slackbot never DMs password reset links." },
      { id: "b", label: "Open Slack settings directly and review active sessions", correct: true, explanation: "Manage account security from inside the app you trust, not from inbound links." },
      { id: "c", label: "Reply 'who is this?'", correct: false, explanation: "Engaging the attacker confirms you're a live target and keeps the conversation open." },
      { id: "d", label: "Click the link but don't enter your password", correct: false, explanation: "Just visiting the page can fingerprint your device or trigger drive-by exploit kits." },
    ],
    bestPractice: "Manage account security from inside the official app — never from unsolicited inbound links.",
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
