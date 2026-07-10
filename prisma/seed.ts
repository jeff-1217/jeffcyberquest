import { db } from "../src/lib/db";

type RawQuestion = {
  text: string;
  explanation: string;
  difficulty: string;
  options: { text: string; isCorrect: boolean }[];
};

type RawTest = {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  durationMin: number;
  passingScore: number;
  tags: string;
  categorySlug: string;
  questions: RawQuestion[];
};

const categories = [
  {
    name: "Network Security",
    slug: "network-security",
    description: "Firewalls, protocols, network attacks, segmentation, and perimeter defense.",
    icon: "shield",
    color: "#10b981",
  },
  {
    name: "Cryptography",
    slug: "cryptography",
    description: "Encryption, hashing, digital signatures, PKI, and key management.",
    icon: "key-round",
    color: "#a855f7",
  },
  {
    name: "Web Application Security",
    slug: "web-security",
    description: "OWASP Top 10, XSS, SQL injection, CSRF, and secure coding.",
    icon: "globe",
    color: "#f43f5e",
  },
  {
    name: "Malware & Threats",
    slug: "malware-threats",
    description: "Viruses, ransomware, Trojans, APTs, and threat actor tactics.",
    icon: "bug",
    color: "#ef4444",
  },
  {
    name: "Identity & Access Management",
    slug: "iam",
    description: "Authentication, authorization, MFA, SSO, and zero trust.",
    icon: "fingerprint",
    color: "#06b6d4",
  },
  {
    name: "Security Operations",
    slug: "security-operations",
    description: "SOC, SIEM, incident response, logging, and threat hunting.",
    icon: "activity",
    color: "#f97316",
  },
  {
    name: "Cloud Security",
    slug: "cloud-security",
    description: "Shared responsibility, IAM, container, and multi-cloud security.",
    icon: "cloud",
    color: "#14b8a6",
  },
  {
    name: "Ethical Hacking",
    slug: "ethical-hacking",
    description: "Penetration testing, reconnaissance, exploitation, and reporting.",
    icon: "terminal",
    color: "#84cc16",
  },
];

const tests: RawTest[] = [
  // ----------------------- NETWORK SECURITY -----------------------
  {
    title: "Network Security Fundamentals",
    slug: "network-security-fundamentals",
    description: "Core concepts of firewalls, protocols, ports, and common network attacks.",
    difficulty: "Beginner",
    durationMin: 15,
    passingScore: 70,
    tags: "firewall,tcp/ip,ports,ddos,vpn",
    categorySlug: "network-security",
    questions: [
      {
        text: "Which port does HTTPS use by default?",
        explanation: "HTTPS (HTTP over TLS) uses port 443 by default, while plain HTTP uses port 80.",
        difficulty: "Beginner",
        options: [
          { text: "80", isCorrect: false },
          { text: "443", isCorrect: true },
          { text: "22", isCorrect: false },
          { text: "8080", isCorrect: false },
        ],
      },
      {
        text: "What is the primary purpose of a firewall?",
        explanation: "A firewall monitors and filters incoming/outgoing network traffic based on predetermined security rules to block unauthorized access.",
        difficulty: "Beginner",
        options: [
          { text: "Speed up network traffic", isCorrect: false },
          { text: "Encrypt all network data", isCorrect: false },
          { text: "Filter traffic based on security rules", isCorrect: true },
          { text: "Assign IP addresses", isCorrect: false },
        ],
      },
      {
        text: "Which type of attack floods a network with overwhelming traffic to disrupt service?",
        explanation: "A Denial of Service (DoS) or Distributed DoS (DDoS) attack overwhelms a target with traffic, making it unavailable to legitimate users.",
        difficulty: "Beginner",
        options: [
          { text: "Phishing", isCorrect: false },
          { text: "DDoS", isCorrect: true },
          { text: "SQL Injection", isCorrect: false },
          { text: "Man-in-the-Middle", isCorrect: false },
        ],
      },
      {
        text: "What does VPN stand for?",
        explanation: "VPN stands for Virtual Private Network, which creates an encrypted tunnel over a public network.",
        difficulty: "Beginner",
        options: [
          { text: "Virtual Private Network", isCorrect: true },
          { text: "Very Protected Node", isCorrect: false },
          { text: "Verified Public Network", isCorrect: false },
          { text: "Virtual Protocol Node", isCorrect: false },
        ],
      },
      {
        text: "Which OSI layer is responsible for routing and IP addressing?",
        explanation: "Layer 3, the Network layer, handles logical addressing (IP) and routing of packets between networks.",
        difficulty: "Intermediate",
        options: [
          { text: "Layer 2 - Data Link", isCorrect: false },
          { text: "Layer 3 - Network", isCorrect: true },
          { text: "Layer 4 - Transport", isCorrect: false },
          { text: "Layer 7 - Application", isCorrect: false },
        ],
      },
      {
        text: "Which protocol is connection-oriented and ensures reliable delivery?",
        explanation: "TCP is connection-oriented, using handshakes and acknowledgments to guarantee reliable, ordered delivery. UDP is connectionless.",
        difficulty: "Intermediate",
        options: [
          { text: "UDP", isCorrect: false },
          { text: "TCP", isCorrect: true },
          { text: "ICMP", isCorrect: false },
          { text: "ARP", isCorrect: false },
        ],
      },
      {
        text: "What is network segmentation primarily used for?",
        explanation: "Segmentation divides a network into smaller zones to contain breaches, limit lateral movement, and reduce the attack surface.",
        difficulty: "Intermediate",
        options: [
          { text: "Increase network speed", isCorrect: false },
          { text: "Contain breaches and limit lateral movement", isCorrect: true },
          { text: "Reduce hardware costs", isCorrect: false },
          { text: "Simplify IP addressing", isCorrect: false },
        ],
      },
      {
        text: "Which attack intercepts communications between two parties without their knowledge?",
        explanation: "A Man-in-the-Middle (MitM) attack secretly relays and possibly alters communication between two parties who believe they are talking directly.",
        difficulty: "Intermediate",
        options: [
          { text: "Man-in-the-Middle", isCorrect: true },
          { text: "Brute Force", isCorrect: false },
          { text: "DNS Poisoning", isCorrect: false },
          { text: "Cross-site Scripting", isCorrect: false },
        ],
      },
      {
        text: "What is a DMZ in network architecture?",
        explanation: "A Demilitarized Zone is a perimeter subnetwork that exposes an organization's external-facing services to an untrusted network (the internet) while isolating the internal LAN.",
        difficulty: "Intermediate",
        options: [
          { text: "A backup network for disasters", isCorrect: false },
          { text: "A buffer zone between the internet and internal LAN", isCorrect: true },
          { text: "An encrypted internal network", isCorrect: false },
          { text: "A type of malware sandbox", isCorrect: false },
        ],
      },
      {
        text: "Which port is used by SSH for secure remote login?",
        explanation: "SSH (Secure Shell) uses port 22 by default for encrypted remote login and command execution.",
        difficulty: "Beginner",
        options: [
          { text: "21", isCorrect: false },
          { text: "22", isCorrect: true },
          { text: "23", isCorrect: false },
          { text: "25", isCorrect: false },
        ],
      },
      {
        text: "What does IDS stand for in network security?",
        explanation: "IDS stands for Intrusion Detection System, which monitors network traffic for suspicious activity and raises alerts (unlike an IPS which also blocks).",
        difficulty: "Intermediate",
        options: [
          { text: "Intrusion Detection System", isCorrect: true },
          { text: "Internet Defense Standard", isCorrect: false },
          { text: "Internal Data Security", isCorrect: false },
          { text: "Integrated Defense Service", isCorrect: false },
        ],
      },
      {
        text: "What is ARP spoofing?",
        explanation: "ARP spoofing sends forged ARP messages to link the attacker's MAC address with a legitimate IP, enabling MitM attacks on a local network.",
        difficulty: "Advanced",
        options: [
          { text: "Sending fake ARP messages to hijack LAN traffic", isCorrect: true },
          { text: "Flooding a server with HTTP requests", isCorrect: false },
          { text: "Cracking Wi-Fi WPA2 passwords", isCorrect: false },
          { text: "Spoofing DNS responses globally", isCorrect: false },
        ],
      },
    ],
  },

  // ----------------------- CRYPTOGRAPHY -----------------------
  {
    title: "Cryptography Essentials",
    slug: "cryptography-essentials",
    description: "Symmetric/asymmetric encryption, hashing, digital signatures, and PKI fundamentals.",
    difficulty: "Intermediate",
    durationMin: 18,
    passingScore: 70,
    tags: "encryption,hashing,pki,digital-signature,aes,rsa",
    categorySlug: "cryptography",
    questions: [
      {
        text: "Which encryption algorithm is symmetric?",
        explanation: "AES (Advanced Encryption Standard) is symmetric, using the same key for encryption and decryption. RSA and ECC are asymmetric; SHA is a hash.",
        difficulty: "Beginner",
        options: [
          { text: "RSA", isCorrect: false },
          { text: "AES", isCorrect: true },
          { text: "SHA-256", isCorrect: false },
          { text: "ECC", isCorrect: false },
        ],
      },
      {
        text: "What is the main difference between symmetric and asymmetric encryption?",
        explanation: "Symmetric encryption uses one shared key for both encryption and decryption; asymmetric uses a public/private key pair.",
        difficulty: "Beginner",
        options: [
          { text: "Symmetric uses a key pair; asymmetric uses one key", isCorrect: false },
          { text: "Symmetric uses one shared key; asymmetric uses a public/private pair", isCorrect: true },
          { text: "Symmetric is only for hashing", isCorrect: false },
          { text: "There is no difference", isCorrect: false },
        ],
      },
      {
        text: "Which property ensures a hash cannot be reversed to obtain the original input?",
        explanation: "One-way (preimage resistance) means a hash function cannot be practically inverted to recover the input from its digest.",
        difficulty: "Intermediate",
        options: [
          { text: "Reversibility", isCorrect: false },
          { text: "One-way (preimage resistance)", isCorrect: true },
          { text: "Determinism", isCorrect: false },
          { text: "Collision-prone", isCorrect: false },
        ],
      },
      {
        text: "What does a digital signature provide?",
        explanation: "Digital signatures provide authentication, integrity, and non-repudiation by signing a hash with the sender's private key.",
        difficulty: "Intermediate",
        options: [
          { text: "Confidentiality only", isCorrect: false },
          { text: "Authentication, integrity, and non-repudiation", isCorrect: true },
          { text: "Encryption of the message", isCorrect: false },
          { text: "Anonymity for the sender", isCorrect: false },
        ],
      },
      {
        text: "Which is a common use of a salt in password storage?",
        explanation: "A salt is random data added to a password before hashing to defeat rainbow tables and ensure identical passwords produce different hashes.",
        difficulty: "Intermediate",
        options: [
          { text: "Encrypt the password", isCorrect: false },
          { text: "Defeat rainbow tables and make hashes unique", isCorrect: true },
          { text: "Compress the password", isCorrect: false },
          { text: "Store the password in plaintext safely", isCorrect: false },
        ],
      },
      {
        text: "What is a Certificate Authority (CA) responsible for in PKI?",
        explanation: "A CA issues and digitally signs digital certificates that bind a public key to an identity, establishing trust.",
        difficulty: "Intermediate",
        options: [
          { text: "Generating user passwords", isCorrect: false },
          { text: "Issuing and signing digital certificates", isCorrect: true },
          { text: "Encrypting all web traffic", isCorrect: false },
          { text: "Hosting private keys", isCorrect: false },
        ],
      },
      {
        text: "Which attack targets the mathematical relationship of a hash to find two inputs with the same output?",
        explanation: "A collision attack seeks two distinct inputs producing the same hash digest, exploiting weak collision resistance.",
        difficulty: "Advanced",
        options: [
          { text: "Brute force attack", isCorrect: false },
          { text: "Collision attack", isCorrect: true },
          { text: "Man-in-the-Middle", isCorrect: false },
          { text: "Side-channel attack", isCorrect: false },
        ],
      },
      {
        text: "Which algorithm is commonly used for secure key exchange over an insecure channel?",
        explanation: "Diffie-Hellman allows two parties to establish a shared secret over an insecure channel without prior shared secrets.",
        difficulty: "Advanced",
        options: [
          { text: "Diffie-Hellman", isCorrect: true },
          { text: "Caesar cipher", isCorrect: false },
          { text: "MD5", isCorrect: false },
          { text: "Base64", isCorrect: false },
        ],
      },
      {
        text: "Why is MD5 considered insecure for cryptographic purposes today?",
        explanation: "MD5 has known collision vulnerabilities that allow attackers to create different inputs with the same hash, breaking integrity guarantees.",
        difficulty: "Intermediate",
        options: [
          { text: "It is too slow", isCorrect: false },
          { text: "It has known collision vulnerabilities", isCorrect: true },
          { text: "It uses symmetric keys", isCorrect: false },
          { text: "It cannot hash large files", isCorrect: false },
        ],
      },
      {
        text: "What is forward secrecy?",
        explanation: "Forward secrecy ensures that compromise of long-term keys does not compromise past session keys, protecting previously transmitted data.",
        difficulty: "Advanced",
        options: [
          { text: "Encrypting data before sending it", isCorrect: false },
          { text: "Past sessions stay secure even if long-term keys are compromised", isCorrect: true },
          { text: "Sending keys forward to the recipient", isCorrect: false },
          { text: "Using the same key for every session", isCorrect: false },
        ],
      },
      {
        text: "In RSA, which key is used to decrypt a message?",
        explanation: "In RSA, the recipient decrypts with their private key; messages are encrypted with the recipient's public key.",
        difficulty: "Intermediate",
        options: [
          { text: "The sender's public key", isCorrect: false },
          { text: "The recipient's private key", isCorrect: true },
          { text: "A shared symmetric key", isCorrect: false },
          { text: "The CA's root key", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of a key rotation policy?",
        explanation: "Key rotation periodically replaces keys to limit the amount of data exposed if a key is compromised and to reduce the lifetime of any single key.",
        difficulty: "Advanced",
        options: [
          { text: "Reduce exposure if a key is compromised", isCorrect: true },
          { text: "Increase encryption speed", isCorrect: false },
          { text: "Avoid using certificates", isCorrect: false },
          { text: "Compress the keys", isCorrect: false },
        ],
      },
    ],
  },

  // ----------------------- WEB SECURITY -----------------------
  {
    title: "Web Security & OWASP Top 10",
    slug: "web-security-owasp",
    description: "OWASP Top 10 vulnerabilities, XSS, SQL injection, CSRF, and secure coding practices.",
    difficulty: "Intermediate",
    durationMin: 18,
    passingScore: 70,
    tags: "owasp,xss,sqli,csrf,web",
    categorySlug: "web-security",
    questions: [
      {
        text: "Which vulnerability allows an attacker to inject malicious scripts into web pages viewed by other users?",
        explanation: "Cross-Site Scripting (XSS) injects client-side scripts into content viewed by other users, executing in their browser context.",
        difficulty: "Beginner",
        options: [
          { text: "SQL Injection", isCorrect: false },
          { text: "Cross-Site Scripting (XSS)", isCorrect: true },
          { text: "CSRF", isCorrect: false },
          { text: "Buffer Overflow", isCorrect: false },
        ],
      },
      {
        text: "What is the best defense against SQL injection?",
        explanation: "Parameterized queries (prepared statements) separate code from data, preventing user input from being interpreted as SQL.",
        difficulty: "Intermediate",
        options: [
          { text: "Using client-side validation only", isCorrect: false },
          { text: "Parameterized queries (prepared statements)", isCorrect: true },
          { text: "Hiding database error messages", isCorrect: false },
          { text: "Storing passwords in plaintext", isCorrect: false },
        ],
      },
      {
        text: "What does CSRF stand for?",
        explanation: "CSRF is Cross-Site Request Forgery, where an attacker tricks an authenticated user into submitting unwanted actions.",
        difficulty: "Beginner",
        options: [
          { text: "Cross-Site Request Forgery", isCorrect: true },
          { text: "Client-Side Remote Function", isCorrect: false },
          { text: "Common Security Risk Flaw", isCorrect: false },
          { text: "Cross-Script Resource Fetch", isCorrect: false },
        ],
      },
      {
        text: "Which header helps prevent clickjacking by restricting page framing?",
        explanation: "The Content-Security-Policy 'frame-ancestors' directive (and legacy X-Frame-Options) controls who may embed a page in a frame, preventing clickjacking.",
        difficulty: "Advanced",
        options: [
          { text: "Content-Security-Policy frame-ancestors", isCorrect: true },
          { text: "X-Powered-By", isCorrect: false },
          { text: "Set-Cookie", isCorrect: false },
          { text: "Server", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of the SameSite cookie attribute?",
        explanation: "SameSite restricts when cookies are sent with cross-site requests, mitigating CSRF by controlling cookie attachment.",
        difficulty: "Intermediate",
        options: [
          { text: "Encrypt the cookie value", isCorrect: false },
          { text: "Restrict cookies in cross-site requests to mitigate CSRF", isCorrect: true },
          { text: "Set cookie expiration", isCorrect: false },
          { text: "Compress the cookie", isCorrect: false },
        ],
      },
      {
        text: "Which OWASP risk involves broken access control?",
        explanation: "Broken Access Control (OWASP #1 in 2021) allows users to act outside their intended permissions, accessing unauthorized data or functions.",
        difficulty: "Intermediate",
        options: [
          { text: "Allowing users to access resources beyond their permissions", isCorrect: true },
          { text: "Slow page load times", isCorrect: false },
          { text: "Using HTTPS everywhere", isCorrect: false },
          { text: "Logging too many errors", isCorrect: false },
        ],
      },
      {
        text: "What does storing passwords in plaintext risk?",
        explanation: "Plaintext passwords expose all user credentials immediately if the database is breached, enabling credential stuffing and account takeover.",
        difficulty: "Beginner",
        options: [
          { text: "Faster login", isCorrect: false },
          { text: "Full credential exposure on a breach", isCorrect: true },
          { text: "Smaller database size", isCorrect: false },
          { text: "Better password recovery", isCorrect: false },
        ],
      },
      {
        text: "Which HTTP header enforces HTTPS connections?",
        explanation: "HTTP Strict Transport Security (HSTS) tells browsers to only connect over HTTPS, preventing protocol downgrade attacks.",
        difficulty: "Intermediate",
        options: [
          { text: "Strict-Transport-Security", isCorrect: true },
          { text: "X-Content-Type-Options", isCorrect: false },
          { text: "Access-Control-Allow-Origin", isCorrect: false },
          { text: "Referrer-Policy", isCorrect: false },
        ],
      },
      {
        text: "What is an SSRF vulnerability?",
        explanation: "Server-Side Request Forgery lets an attacker induce the server to make requests to unintended internal or external resources.",
        difficulty: "Advanced",
        options: [
          { text: "Server-Side Request Forgery", isCorrect: true },
          { text: "Secure Socket Request Format", isCorrect: false },
          { text: "Single Sign-On Request Flow", isCorrect: false },
          { text: "Session State Recovery Function", isCorrect: false },
        ],
      },
      {
        text: "Which is an effective mitigation for stored (persistent) XSS?",
        explanation: "Output encoding/escaping contextual to the output location neutralizes malicious scripts before rendering, preventing execution.",
        difficulty: "Advanced",
        options: [
          { text: "Relying solely on input validation", isCorrect: false },
          { text: "Contextual output encoding of user data", isCorrect: true },
          { text: "Disabling JavaScript entirely", isCorrect: false },
          { text: "Using HTTP instead of HTTPS", isCorrect: false },
        ],
      },
      {
        text: "What is the role of a Web Application Firewall (WAF)?",
        explanation: "A WAF inspects HTTP traffic and filters malicious requests based on rulesets to protect web apps from common attacks like SQLi and XSS.",
        difficulty: "Intermediate",
        options: [
          { text: "Filter and monitor HTTP traffic to web apps", isCorrect: true },
          { text: "Encrypt database contents", isCorrect: false },
          { text: "Manage DNS records", isCorrect: false },
          { text: "Issue TLS certificates", isCorrect: false },
        ],
      },
      {
        text: "Which security misconfiguration is leaving default admin credentials unchanged?",
        explanation: "Failing to change default credentials is a Security Misconfiguration flaw, allowing trivial unauthorized administrative access.",
        difficulty: "Beginner",
        options: [
          { text: "Security Misconfiguration", isCorrect: true },
          { text: "Cryptographic Failure", isCorrect: false },
          { text: "Injection", isCorrect: false },
          { text: "Insecure Design", isCorrect: false },
        ],
      },
    ],
  },

  // ----------------------- MALWARE & THREATS -----------------------
  {
    title: "Malware & Threat Analysis",
    slug: "malware-threat-analysis",
    description: "Malware types, ransomware, APTs, and the cyber kill chain.",
    difficulty: "Intermediate",
    durationMin: 15,
    passingScore: 70,
    tags: "malware,ransomware,apt,trojan,kill-chain",
    categorySlug: "malware-threats",
    questions: [
      {
        text: "Which type of malware encrypts a victim's files and demands payment to restore access?",
        explanation: "Ransomware encrypts files and demands a ransom (usually cryptocurrency) for the decryption key.",
        difficulty: "Beginner",
        options: [
          { text: "Ransomware", isCorrect: true },
          { text: "Adware", isCorrect: false },
          { text: "Rootkit", isCorrect: false },
          { text: "Keylogger", isCorrect: false },
        ],
      },
      {
        text: "What distinguishes a Trojan horse from a virus?",
        explanation: "A Trojan appears legitimate but carries a malicious payload and does not self-replicate; a virus self-replicates by attaching to host files.",
        difficulty: "Intermediate",
        options: [
          { text: "A Trojan self-replicates; a virus does not", isCorrect: false },
          { text: "A Trojan masquerades as legitimate and does not self-replicate", isCorrect: true },
          { text: "A Trojan only targets mobile devices", isCorrect: false },
          { text: "There is no difference", isCorrect: false },
        ],
      },
      {
        text: "What is a rootkit primarily designed to do?",
        explanation: "A rootkit maintains privileged (root) access while hiding its presence from the operating system and security tools.",
        difficulty: "Intermediate",
        options: [
          { text: "Maintain privileged, hidden access", isCorrect: true },
          { text: "Display advertisements", isCorrect: false },
          { text: "Speed up the computer", isCorrect: false },
          { text: "Compress files", isCorrect: false },
        ],
      },
      {
        text: "In the Cyber Kill Chain, what is the 'Delivery' stage?",
        explanation: "Delivery is how the attacker transmits the weaponized payload to the target, e.g., via email attachment, USB, or web download.",
        difficulty: "Advanced",
        options: [
          { text: "Transmitting the weaponized payload to the target", isCorrect: true },
          { text: "Building the malicious payload", isCorrect: false },
          { text: "Extracting stolen data", isCorrect: false },
          { text: "Reconnaissance of the target", isCorrect: false },
        ],
      },
      {
        text: "What does APT stand for in cybersecurity?",
        explanation: "APT stands for Advanced Persistent Threat — a stealthy, well-resourced adversary that maintains long-term access to a target.",
        difficulty: "Intermediate",
        options: [
          { text: "Advanced Persistent Threat", isCorrect: true },
          { text: "Automated Patch Tool", isCorrect: false },
          { text: "Application Policy Tester", isCorrect: false },
          { text: "Access Permission Token", isCorrect: false },
        ],
      },
      {
        text: "Which malware behavior captures keystrokes to steal credentials?",
        explanation: "A keylogger records keystrokes to capture passwords, credit card numbers, and other sensitive input.",
        difficulty: "Beginner",
        options: [
          { text: "Keylogger", isCorrect: true },
          { text: "Worm", isCorrect: false },
          { text: "Ransomware", isCorrect: false },
          { text: "Spyware blocker", isCorrect: false },
        ],
      },
      {
        text: "What is the goal of malware sandboxing?",
        explanation: "Sandboxing executes suspicious code in an isolated environment to observe behavior and determine if it is malicious, without risking the host.",
        difficulty: "Advanced",
        options: [
          { text: "Observe malware behavior in an isolated environment", isCorrect: true },
          { text: "Delete files automatically", isCorrect: false },
          { text: "Encrypt user documents", isCorrect: false },
          { text: "Speed up the network", isCorrect: false },
        ],
      },
      {
        text: "A worm differs from a virus in that it:",
        explanation: "A worm self-replicates and spreads across networks without needing to attach to a host file or user action.",
        difficulty: "Intermediate",
        options: [
          { text: "Spreads self-contained across networks without a host file", isCorrect: true },
          { text: "Requires a host file to spread", isCorrect: false },
          { text: "Cannot spread over a network", isCorrect: false },
          { text: "Only infects mobile devices", isCorrect: false },
        ],
      },
      {
        text: "What is a polymorphic virus?",
        explanation: "A polymorphic virus mutates its code/structure each time it infects a system to evade signature-based detection, while keeping its payload functional.",
        difficulty: "Advanced",
        options: [
          { text: "A virus that changes its signature to evade detection", isCorrect: true },
          { text: "A virus that only affects polymorphic code", isCorrect: false },
          { text: "A virus written in Python", isCorrect: false },
          { text: "A harmless test virus", isCorrect: false },
        ],
      },
      {
        text: "Which stage comes first in the Cyber Kill Chain?",
        explanation: "Reconnaissance is the first stage, where the adversary gathers information about the target before crafting an attack.",
        difficulty: "Intermediate",
        options: [
          { text: "Reconnaissance", isCorrect: true },
          { text: "Exploitation", isCorrect: false },
          { text: "Exfiltration", isCorrect: false },
          { text: "Actions on Objectives", isCorrect: false },
        ],
      },
    ],
  },

  // ----------------------- IAM -----------------------
  {
    title: "Identity & Access Management",
    slug: "identity-access-management",
    description: "Authentication, authorization, MFA, SSO, least privilege, and zero trust principles.",
    difficulty: "Beginner",
    durationMin: 14,
    passingScore: 70,
    tags: "mfa,sso,zero-trust,least-privilege,rbac",
    categorySlug: "iam",
    questions: [
      {
        text: "What is the principle of least privilege?",
        explanation: "Least privilege grants users only the minimum access required to perform their job, reducing risk from compromised or insider accounts.",
        difficulty: "Beginner",
        options: [
          { text: "Giving users only the minimum access needed", isCorrect: true },
          { text: "Giving everyone admin access", isCorrect: false },
          { text: "Removing all access controls", isCorrect: false },
          { text: "Sharing one password among a team", isCorrect: false },
        ],
      },
      {
        text: "What does MFA stand for?",
        explanation: "MFA is Multi-Factor Authentication, requiring two or more independent factors (something you know, have, or are).",
        difficulty: "Beginner",
        options: [
          { text: "Multi-Factor Authentication", isCorrect: true },
          { text: "Main Frame Access", isCorrect: false },
          { text: "Managed File Authorization", isCorrect: false },
          { text: "Multiple Firewall Actions", isCorrect: false },
        ],
      },
      {
        text: "Which authentication factor is a fingerprint?",
        explanation: "A fingerprint is 'something you are' — a biometric (inherence) factor.",
        difficulty: "Beginner",
        options: [
          { text: "Something you know", isCorrect: false },
          { text: "Something you have", isCorrect: false },
          { text: "Something you are", isCorrect: true },
          { text: "Somewhere you are", isCorrect: false },
        ],
      },
      {
        text: "What is the core idea of Zero Trust?",
        explanation: "Zero Trust assumes no implicit trust; it continuously verifies every access request based on identity, context, and policy, regardless of network location.",
        difficulty: "Intermediate",
        options: [
          { text: "Trust nothing, verify every request explicitly", isCorrect: true },
          { text: "Trust everything inside the network", isCorrect: false },
          { text: "Remove all authentication", isCorrect: false },
          { text: "Only verify once at login", isCorrect: false },
        ],
      },
      {
        text: "What does RBAC stand for?",
        explanation: "RBAC is Role-Based Access Control, assigning permissions to roles rather than individuals for easier, scalable management.",
        difficulty: "Beginner",
        options: [
          { text: "Role-Based Access Control", isCorrect: true },
          { text: "Random Block Access Code", isCorrect: false },
          { text: "Remote Backup Access Center", isCorrect: false },
          { text: "Rule-Based Audit Check", isCorrect: false },
        ],
      },
      {
        text: "What is the difference between authentication and authorization?",
        explanation: "Authentication verifies who a user is; authorization determines what they are allowed to do.",
        difficulty: "Beginner",
        options: [
          { text: "Authentication verifies identity; authorization grants permissions", isCorrect: true },
          { text: "They are the same thing", isCorrect: false },
          { text: "Authorization verifies identity; authentication grants permissions", isCorrect: false },
          { text: "Neither relates to access control", isCorrect: false },
        ],
      },
      {
        text: "What is a benefit of Single Sign-On (SSO)?",
        explanation: "SSO lets users authenticate once to access multiple applications, reducing password fatigue and improving usability and centralized control.",
        difficulty: "Intermediate",
        options: [
          { text: "One login for many applications", isCorrect: true },
          { text: "Stronger passwords automatically", isCorrect: false },
          { text: "No need for any authentication", isCorrect: false },
          { text: "Faster network speed", isCorrect: false },
        ],
      },
      {
        text: "Which protocol is commonly used for SSO in enterprise environments?",
        explanation: "SAML (Security Assertion Markup Language) is widely used for federated SSO between identity providers and service providers.",
        difficulty: "Advanced",
        options: [
          { text: "SAML", isCorrect: true },
          { text: "FTP", isCorrect: false },
          { text: "SMTP", isCorrect: false },
          { text: "DHCP", isCorrect: false },
        ],
      },
      {
        text: "What is privilege creep?",
        explanation: "Privilege creep is the gradual accumulation of access rights beyond what a user needs, usually as roles change without revoking old permissions.",
        difficulty: "Intermediate",
        options: [
          { text: "Accumulating unnecessary access over time", isCorrect: true },
          { text: "A type of malware", isCorrect: false },
          { text: "A network scanning technique", isCorrect: false },
          { text: "An encryption weakness", isCorrect: false },
        ],
      },
      {
        text: "Which is an example of 'something you have' as an authentication factor?",
        explanation: "A hardware security key or OTP token is 'something you have' — a physical possession factor.",
        difficulty: "Beginner",
        options: [
          { text: "A password", isCorrect: false },
          { text: "A hardware security key", isCorrect: true },
          { text: "A fingerprint", isCorrect: false },
          { text: "Your birthdate", isCorrect: false },
        ],
      },
    ],
  },

  // ----------------------- SECURITY OPERATIONS -----------------------
  {
    title: "Security Operations & Incident Response",
    slug: "security-ops-incident-response",
    description: "SOC, SIEM, the incident response lifecycle, logging, and threat hunting.",
    difficulty: "Advanced",
    durationMin: 16,
    passingScore: 70,
    tags: "soc,siem,incident-response,logging,threat-hunting",
    categorySlug: "security-operations",
    questions: [
      {
        text: "What is the primary function of a SIEM system?",
        explanation: "A SIEM (Security Information and Event Management) aggregates and correlates log data, providing real-time analysis and alerts for security events.",
        difficulty: "Intermediate",
        options: [
          { text: "Aggregate, correlate, and analyze security event logs", isCorrect: true },
          { text: "Block all network traffic", isCorrect: false },
          { text: "Encrypt hard drives", isCorrect: false },
          { text: "Manage user passwords", isCorrect: false },
        ],
      },
      {
        text: "What is the first phase of the incident response lifecycle?",
        explanation: "Preparation is the first phase — building the team, tools, runbooks, and communication plans before an incident occurs.",
        difficulty: "Intermediate",
        options: [
          { text: "Preparation", isCorrect: true },
          { text: "Eradication", isCorrect: false },
          { text: "Lessons Learned", isCorrect: false },
          { text: "Containment", isCorrect: false },
        ],
      },
      {
        text: "What does SOC stand for?",
        explanation: "SOC is Security Operations Center — a team that monitors, detects, investigates, and responds to cybersecurity incidents.",
        difficulty: "Beginner",
        options: [
          { text: "Security Operations Center", isCorrect: true },
          { text: "System Output Controller", isCorrect: false },
          { text: "Service Operations Council", isCorrect: false },
          { text: "Secure Object Cache", isCorrect: false },
        ],
      },
      {
        text: "Which metric measures the average time to detect a security incident?",
        explanation: "MTTD (Mean Time to Detect) measures the average time from an incident occurring to it being detected by the security team.",
        difficulty: "Advanced",
        options: [
          { text: "MTTD", isCorrect: true },
          { text: "MTBF", isCorrect: false },
          { text: "RPO", isCorrect: false },
          { text: "SLA", isCorrect: false },
        ],
      },
      {
        text: "What is the goal of the Containment phase in incident response?",
        explanation: "Containment limits the scope and impact of an incident, stopping it from spreading while preserving evidence for analysis.",
        difficulty: "Intermediate",
        options: [
          { text: "Limit the incident's scope and impact", isCorrect: true },
          { text: "Permanently delete all logs", isCorrect: false },
          { text: "Publicly announce the breach", isCorrect: false },
          { text: "Ignore the incident", isCorrect: false },
        ],
      },
      {
        text: "What is threat hunting?",
        explanation: "Threat hunting is proactively searching networks and endpoints for threats that evaded automated detection, using hypotheses and analytics.",
        difficulty: "Advanced",
        options: [
          { text: "Proactively searching for undetected threats", isCorrect: true },
          { text: "Waiting for alerts to arrive", isCorrect: false },
          { text: "Patching software vulnerabilities", isCorrect: false },
          { text: "Backing up data", isCorrect: false },
        ],
      },
      {
        text: "Which artifact is most valuable for forensic timeline reconstruction?",
        explanation: "Time-stamped logs (system, application, network) are essential to reconstruct the sequence and scope of an incident.",
        difficulty: "Advanced",
        options: [
          { text: "Time-stamped logs", isCorrect: true },
          { text: "The company logo", isCorrect: false },
          { text: "Marketing materials", isCorrect: false },
          { text: "Employee vacation schedules", isCorrect: false },
        ],
      },
      {
        text: "What is a false positive in security monitoring?",
        explanation: "A false positive is a benign event incorrectly flagged as malicious, wasting analyst time and causing alert fatigue.",
        difficulty: "Intermediate",
        options: [
          { text: "A benign event flagged as malicious", isCorrect: true },
          { text: "A real attack that was missed", isCorrect: false },
          { text: "A successful patch deployment", isCorrect: false },
          { text: "A scheduled backup", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of a chain of custody in digital forensics?",
        explanation: "Chain of custody documents the handling of evidence from collection to presentation, preserving integrity and admissibility in court.",
        difficulty: "Advanced",
        options: [
          { text: "Document evidence handling to preserve integrity", isCorrect: true },
          { text: "Speed up incident response", isCorrect: false },
          { text: "Encrypt log files", isCorrect: false },
          { text: "Block malicious IPs", isCorrect: false },
        ],
      },
      {
        text: "Which phase focuses on improving defenses after an incident?",
        explanation: "Lessons Learned (post-incident activity) reviews the incident to improve controls, runbooks, and prevent recurrence.",
        difficulty: "Intermediate",
        options: [
          { text: "Lessons Learned", isCorrect: true },
          { text: "Identification", isCorrect: false },
          { text: "Containment", isCorrect: false },
          { text: "Eradication", isCorrect: false },
        ],
      },
    ],
  },

  // ----------------------- CLOUD SECURITY -----------------------
  {
    title: "Cloud Security Basics",
    slug: "cloud-security-basics",
    description: "Shared responsibility, cloud IAM, container security, and multi-cloud risk management.",
    difficulty: "Intermediate",
    durationMin: 15,
    passingScore: 70,
    tags: "cloud,shared-responsibility,container,iam,misconfiguration",
    categorySlug: "cloud-security",
    questions: [
      {
        text: "What is the shared responsibility model in cloud computing?",
        explanation: "The cloud provider secures the infrastructure (the cloud), while the customer secures their data, configurations, and access (in the cloud).",
        difficulty: "Intermediate",
        options: [
          { text: "Provider secures infrastructure; customer secures their data and config", isCorrect: true },
          { text: "The provider secures everything", isCorrect: false },
          { text: "The customer secures everything", isCorrect: false },
          { text: "Neither party has responsibility", isCorrect: false },
        ],
      },
      {
        text: "Which is the most common cause of cloud data breaches?",
        explanation: "Misconfiguration (e.g., public S3 buckets, overly permissive IAM) is consistently the leading cause of cloud breaches.",
        difficulty: "Intermediate",
        options: [
          { text: "Cloud provider hacking", isCorrect: false },
          { text: "Customer misconfiguration", isCorrect: true },
          { text: "Power outages", isCorrect: false },
          { text: "Outdated keyboards", isCorrect: false },
        ],
      },
      {
        text: "What does IaaS stand for?",
        explanation: "IaaS is Infrastructure as a Service — virtualized computing resources (VMs, storage, networking) provided over the internet.",
        difficulty: "Beginner",
        options: [
          { text: "Infrastructure as a Service", isCorrect: true },
          { text: "Internet as a Service", isCorrect: false },
          { text: "Identity as a Service", isCorrect: false },
          { text: "Integration as a System", isCorrect: false },
        ],
      },
      {
        text: "In cloud security, what is the risk of an over-permissive IAM role?",
        explanation: "Over-permissive IAM roles grant excessive rights, so if compromised, attackers can move laterally, access data, or escalate privileges.",
        difficulty: "Advanced",
        options: [
          { text: "Expanded blast radius if compromised", isCorrect: true },
          { text: "Faster application performance", isCorrect: false },
          { text: "Lower cloud costs", isCorrect: false },
          { text: "Better user experience", isCorrect: false },
        ],
      },
      {
        text: "What is a key security benefit of container orchestration namespaces?",
        explanation: "Namespaces isolate workloads, limiting the blast radius and preventing containers from interfering with one another.",
        difficulty: "Advanced",
        options: [
          { text: "Workload isolation and reduced blast radius", isCorrect: true },
          { text: "Faster image pulls", isCorrect: false },
          { text: "Cheaper storage", isCorrect: false },
          { text: "Automatic backups", isCorrect: false },
        ],
      },
      {
        text: "Which practice helps secure cloud storage buckets?",
        explanation: "Applying least-privilege access policies and disabling public access prevents unintended exposure of stored objects.",
        difficulty: "Intermediate",
        options: [
          { text: "Making all buckets public for convenience", isCorrect: false },
          { text: "Applying least-privilege policies and blocking public access", isCorrect: true },
          { text: "Storing access keys in code", isCorrect: false },
          { text: "Disabling logging", isCorrect: false },
        ],
      },
      {
        text: "What is CSPM in cloud security?",
        explanation: "Cloud Security Posture Management continuously assesses cloud configurations against best practices to detect and remediate misconfigurations.",
        difficulty: "Advanced",
        options: [
          { text: "Cloud Security Posture Management", isCorrect: true },
          { text: "Cloud Service Provider Manager", isCorrect: false },
          { text: "Container Storage Policy Module", isCorrect: false },
          { text: "Centralized Security Process Monitor", isCorrect: false },
        ],
      },
      {
        text: "Why should cloud secrets/keys never be hardcoded in source code?",
        explanation: "Hardcoded secrets can leak via repos, logs, or builds, leading to credential theft and unauthorized cloud access.",
        difficulty: "Beginner",
        options: [
          { text: "They can leak and be exploited by attackers", isCorrect: true },
          { text: "It makes code run faster", isCorrect: false },
          { text: "It improves code readability", isCorrect: false },
          { text: "It is required by law", isCorrect: false },
        ],
      },
      {
        text: "What is the role of a cloud identity provider (IdP)?",
        explanation: "An IdP centrally manages identities and federates authentication to cloud apps, enabling SSO and consistent policy enforcement.",
        difficulty: "Intermediate",
        options: [
          { text: "Centrally manage identities and federate auth", isCorrect: true },
          { text: "Store application source code", isCorrect: false },
          { text: "Provide virtual machines", isCorrect: false },
          { text: "Route DNS traffic", isCorrect: false },
        ],
      },
      {
        text: "Which attack exploits a public cloud metadata service to steal credentials?",
        explanation: "SSRF against the cloud metadata endpoint (e.g., 169.254.169.254) can leak instance credentials; IMDSv2 mitigates this.",
        difficulty: "Advanced",
        options: [
          { text: "SSRF against the metadata service", isCorrect: true },
          { text: "DNS cache poisoning", isCorrect: false },
          { text: "Brute-forcing SSH", isCorrect: false },
          { text: "Buffer overflow in a browser", isCorrect: false },
        ],
      },
    ],
  },

  // ----------------------- ETHICAL HACKING -----------------------
  {
    title: "Ethical Hacking & Penetration Testing",
    slug: "ethical-hacking-pentest",
    description: "Pentest methodology, reconnaissance, exploitation tools, and responsible disclosure.",
    difficulty: "Advanced",
    durationMin: 18,
    passingScore: 70,
    tags: "pentest,nmap,metasploit,osint,recon",
    categorySlug: "ethical-hacking",
    questions: [
      {
        text: "What is the primary purpose of penetration testing?",
        explanation: "Penetration testing simulates real attacks to identify and help remediate exploitable vulnerabilities before adversaries do.",
        difficulty: "Beginner",
        options: [
          { text: "Identify exploitable vulnerabilities safely", isCorrect: true },
          { text: "Steal data for resale", isCorrect: false },
          { text: "Disrupt business operations", isCorrect: false },
          { text: "Deface websites", isCorrect: false },
        ],
      },
      {
        text: "Which phase of a pentest involves gathering public information about the target?",
        explanation: "Reconnaissance (information gathering) collects publicly available data (OSINT) before any active engagement.",
        difficulty: "Beginner",
        options: [
          { text: "Reconnaissance", isCorrect: true },
          { text: "Covering Tracks", isCorrect: false },
          { text: "Maintaining Access", isCorrect: false },
          { text: "Reporting", isCorrect: false },
        ],
      },
      {
        text: "What tool is most associated with network port scanning?",
        explanation: "Nmap (Network Mapper) is the standard tool for host discovery and port/service scanning.",
        difficulty: "Beginner",
        options: [
          { text: "Nmap", isCorrect: true },
          { text: "Wireshark", isCorrect: false },
          { text: "Burp Suite", isCorrect: false },
          { text: "John the Ripper", isCorrect: false },
        ],
      },
      {
        text: "What is a black-box penetration test?",
        explanation: "In black-box testing, the tester has no prior knowledge of the target internals, simulating an external attacker's perspective.",
        difficulty: "Intermediate",
        options: [
          { text: "Tester has no prior knowledge of the target", isCorrect: true },
          { text: "Tester has full knowledge of the internals", isCorrect: false },
          { text: "Tester is an employee", isCorrect: false },
          { text: "Testing is done at night", isCorrect: false },
        ],
      },
      {
        text: "Which framework is widely used to guide penetration testing methodology?",
        explanation: "The PTES (Penetration Testing Execution Standard) and OWASP Testing Guide provide structured methodologies; PTES is a recognized framework.",
        difficulty: "Advanced",
        options: [
          { text: "PTES", isCorrect: true },
          { text: "ITIL", isCorrect: false },
          { text: "Scrum", isCorrect: false },
          { text: "Kanban", isCorrect: false },
        ],
      },
      {
        text: "What is a pivot in the context of penetration testing?",
        explanation: "Pivoting uses a compromised host as a relay to reach otherwise inaccessible internal network segments.",
        difficulty: "Advanced",
        options: [
          { text: "Using a compromised host to access other internal networks", isCorrect: true },
          { text: "Reversing a hash", isCorrect: false },
          { text: "Writing the final report", isCorrect: false },
          { text: "Scanning public websites", isCorrect: false },
        ],
      },
      {
        text: "What is privilege escalation?",
        explanation: "Privilege escalation exploits a flaw or misconfiguration to gain higher permissions than initially obtained (vertical) or another user's rights (horizontal).",
        difficulty: "Intermediate",
        options: [
          { text: "Gaining higher permissions than initially obtained", isCorrect: true },
          { text: "Resetting a user's password legitimately", isCorrect: false },
          { text: "Documenting a finding", isCorrect: false },
          { text: "Closing an open port", isCorrect: false },
        ],
      },
      {
        text: "Which tool is commonly used for web application security testing?",
        explanation: "Burp Suite is a leading web application security testing platform for proxying, scanning, and exploiting web apps.",
        difficulty: "Intermediate",
        options: [
          { text: "Burp Suite", isCorrect: true },
          { text: "Ping", isCorrect: false },
          { text: "Excel", isCorrect: false },
          { text: "PowerPoint", isCorrect: false },
        ],
      },
      {
        text: "What is responsible disclosure?",
        explanation: "Responsible disclosure is privately reporting vulnerabilities to the vendor so they can be fixed before public disclosure, minimizing user risk.",
        difficulty: "Beginner",
        options: [
          { text: "Privately reporting bugs so they can be fixed before public disclosure", isCorrect: true },
          { text: "Posting exploits publicly immediately", isCorrect: false },
          { text: "Selling vulnerabilities to criminals", isCorrect: false },
          { text: "Ignoring discovered vulnerabilities", isCorrect: false },
        ],
      },
      {
        text: "Which type of pentest best simulates a malicious insider?",
        explanation: "A gray-box test, where the tester has partial knowledge/access akin to an authenticated insider, best simulates insider threats.",
        difficulty: "Advanced",
        options: [
          { text: "Gray-box testing", isCorrect: true },
          { text: "Black-box testing", isCorrect: false },
          { text: "White-box testing", isCorrect: false },
          { text: "No testing at all", isCorrect: false },
        ],
      },
      {
        text: "What is OSINT?",
        explanation: "OSINT (Open-Source Intelligence) is information gathered from publicly available sources during reconnaissance.",
        difficulty: "Beginner",
        options: [
          { text: "Open-Source Intelligence", isCorrect: true },
          { text: "Operating System Integrity Test", isCorrect: false },
          { text: "Online Security Incident Notice", isCorrect: false },
          { text: "Open Socket Interface", isCorrect: false },
        ],
      },
      {
        text: "What is the final and essential deliverable of a penetration test?",
        explanation: "A penetration test report documents findings, risk ratings, evidence, and remediation guidance — the key actionable deliverable for the client.",
        difficulty: "Intermediate",
        options: [
          { text: "A detailed report with findings and remediation guidance", isCorrect: true },
          { text: "A trophy from the compromised server", isCorrect: false },
          { text: "A copy of all stolen data", isCorrect: false },
          { text: "A press release", isCorrect: false },
        ],
      },
    ],
  },
];

// Standalone practice questions for the question bank (not tied to a test)
const practiceQuestions: { categorySlug: string; questions: RawQuestion[] }[] = [
  {
    categorySlug: "network-security",
    questions: [
      {
        text: "Which protocol operates at OSI Layer 7 and is used for secure web browsing?",
        explanation: "HTTPS is an application-layer (Layer 7) protocol combining HTTP with TLS for secure web browsing.",
        difficulty: "Beginner",
        options: [
          { text: "TCP", isCorrect: false },
          { text: "HTTPS", isCorrect: true },
          { text: "IP", isCorrect: false },
          { text: "Ethernet", isCorrect: false },
        ],
      },
      {
        text: "What does NAT do?",
        explanation: "Network Address Translation maps private IP addresses to a public one, conserving public IPs and hiding internal addressing.",
        difficulty: "Intermediate",
        options: [
          { text: "Maps private IPs to a public IP", isCorrect: true },
          { text: "Encrypts network packets", isCorrect: false },
          { text: "Blocks all incoming traffic", isCorrect: false },
          { text: "Assigns MAC addresses", isCorrect: false },
        ],
      },
      {
        text: "Which wireless security protocol is considered the most secure for home networks today?",
        explanation: "WPA3 is the most secure current standard, offering stronger encryption and protection against brute-force attacks than WPA2.",
        difficulty: "Intermediate",
        options: [
          { text: "WEP", isCorrect: false },
          { text: "WPA", isCorrect: false },
          { text: "WPA3", isCorrect: true },
          { text: "Open (no password)", isCorrect: false },
        ],
      },
    ],
  },
  {
    categorySlug: "cryptography",
    questions: [
      {
        text: "What is a nonce in cryptographic protocols?",
        explanation: "A nonce is a 'number used once' to prevent replay attacks and ensure freshness of messages in a protocol.",
        difficulty: "Advanced",
        options: [
          { text: "A random number used once to prevent replay", isCorrect: true },
          { text: "A type of hash function", isCorrect: false },
          { text: "An encryption key", isCorrect: false },
          { text: "A compression algorithm", isCorrect: false },
        ],
      },
      {
        text: "Which hash function produces a 256-bit output?",
        explanation: "SHA-256 produces a 256-bit (32-byte) digest and is part of the SHA-2 family.",
        difficulty: "Intermediate",
        options: [
          { text: "MD5", isCorrect: false },
          { text: "SHA-1", isCorrect: false },
          { text: "SHA-256", isCorrect: true },
          { text: "CRC32", isCorrect: false },
        ],
      },
    ],
  },
  {
    categorySlug: "web-security",
    questions: [
      {
        text: "What is an HTTP response splitting attack?",
        explanation: "HTTP response splitting injects CRLF sequences into headers to split the response, enabling cache poisoning or XSS.",
        difficulty: "Advanced",
        options: [
          { text: "Injecting CRLF to split and manipulate responses", isCorrect: true },
          { text: "Dividing a server into two", isCorrect: false },
          { text: "Splitting bandwidth costs", isCorrect: false },
          { text: "A load balancing technique", isCorrect: false },
        ],
      },
      {
        text: "Which attribute marks a cookie inaccessible to JavaScript, mitiguting XSS-based theft?",
        explanation: "The HttpOnly attribute prevents client-side scripts from accessing the cookie, reducing theft via XSS.",
        difficulty: "Intermediate",
        options: [
          { text: "HttpOnly", isCorrect: true },
          { text: "Public", isCorrect: false },
          { text: "JS-Enabled", isCorrect: false },
          { text: "Readable", isCorrect: false },
        ],
      },
    ],
  },
  {
    categorySlug: "malware-threats",
    questions: [
      {
        text: "What is fileless malware?",
        explanation: "Fileless malware resides in memory (e.g., via PowerShell/WMI) and avoids writing files to disk, evading traditional AV signatures.",
        difficulty: "Advanced",
        options: [
          { text: "Malware that runs in memory without files on disk", isCorrect: true },
          { text: "Malware that deletes all files", isCorrect: false },
          { text: "Malware disguised as images", isCorrect: false },
          { text: "Malware that only affects printers", isCorrect: false },
        ],
      },
      {
        text: "What is a command-and-control (C2) server?",
        explanation: "A C2 server is the attacker-controlled infrastructure used to send commands to and receive exfiltrated data from compromised hosts.",
        difficulty: "Intermediate",
        options: [
          { text: "Attacker infrastructure controlling compromised hosts", isCorrect: true },
          { text: "A legitimate backup server", isCorrect: false },
          { text: "A DNS resolver", isCorrect: false },
          { text: "A firewall management console", isCorrect: false },
        ],
      },
    ],
  },
  {
    categorySlug: "iam",
    questions: [
      {
        text: "What is passkey authentication?",
        explanation: "Passkeys use public-key cryptography (FIDO2/WebAuthn) tied to a device, replacing passwords with phishing-resistant credentials.",
        difficulty: "Advanced",
        options: [
          { text: "Phishing-resistant public-key credentials on a device", isCorrect: true },
          { text: "A longer text password", isCorrect: false },
          { text: "A shared team password", isCorrect: false },
          { text: "An emailed OTP", isCorrect: false },
        ],
      },
      {
        text: "Which access control model assigns permissions based on attributes and policies?",
        explanation: "ABAC (Attribute-Based Access Control) evaluates attributes of user, resource, and environment against policies for dynamic decisions.",
        difficulty: "Advanced",
        options: [
          { text: "ABAC", isCorrect: true },
          { text: "MAC", isCorrect: false },
          { text: "DAC", isCorrect: false },
          { text: "RBAC", isCorrect: false },
        ],
      },
    ],
  },
  {
    categorySlug: "security-operations",
    questions: [
      {
        text: "What is EDR?",
        explanation: "EDR (Endpoint Detection and Response) provides continuous monitoring and response on endpoints, detecting advanced threats beyond signatures.",
        difficulty: "Intermediate",
        options: [
          { text: "Endpoint Detection and Response", isCorrect: true },
          { text: "Event Data Repository", isCorrect: false },
          { text: "External Data Router", isCorrect: false },
          { text: "Encrypted Data Record", isCorrect: false },
        ],
      },
      {
        text: "What does an IoC represent in threat intelligence?",
        explanation: "An Indicator of Compromise is observable evidence (IP, hash, domain) that an intrusion or malicious activity has occurred.",
        difficulty: "Intermediate",
        options: [
          { text: "Indicator of Compromise", isCorrect: true },
          { text: "Internet of Computers", isCorrect: false },
          { text: "Internal Operations Center", isCorrect: false },
          { text: "Index of Compliance", isCorrect: false },
        ],
      },
    ],
  },
  {
    categorySlug: "cloud-security",
    questions: [
      {
        text: "What is the cloud 'blast radius'?",
        explanation: "Blast radius is the potential extent of damage if a cloud identity/resource is compromised; minimizing it limits impact.",
        difficulty: "Advanced",
        options: [
          { text: "The extent of damage if a cloud identity is compromised", isCorrect: true },
          { text: "The size of a cloud data center", isCorrect: false },
          { text: "The latency of cloud APIs", isCorrect: false },
          { text: "The cost of cloud storage", isCorrect: false },
        ],
      },
      {
        text: "What is the zero-trust principle applied to cloud workloads?",
        explanation: "Workload identity and micro-segmentation verify every request between services, assuming no implicit trust between workloads.",
        difficulty: "Advanced",
        options: [
          { text: "Verify every request between workloads, no implicit trust", isCorrect: true },
          { text: "Trust all internal traffic", isCorrect: false },
          { text: "Disable logging to save cost", isCorrect: false },
          { text: "Use a single shared credential", isCorrect: false },
        ],
      },
    ],
  },
  {
    categorySlug: "ethical-hacking",
    questions: [
      {
        text: "What is social engineering in the context of ethical hacking?",
        explanation: "Social engineering manipulates people into revealing information or performing actions, bypassing technical controls via human trust.",
        difficulty: "Beginner",
        options: [
          { text: "Manipulating people to reveal information or take actions", isCorrect: true },
          { text: "Reverse-engineering software", isCorrect: false },
          { text: "Optimizing social media", isCorrect: false },
          { text: "Engineering better passwords", isCorrect: false },
        ],
      },
      {
        text: "What is a buffer overflow vulnerability?",
        explanation: "A buffer overflow writes more data than a buffer can hold, overwriting adjacent memory and potentially allowing arbitrary code execution.",
        difficulty: "Advanced",
        options: [
          { text: "Writing past a buffer's bounds to corrupt memory", isCorrect: true },
          { text: "Overflowing a network queue", isCorrect: false },
          { text: "Too many login attempts", isCorrect: false },
          { text: "A database table growing large", isCorrect: false },
        ],
      },
      {
        text: "Which reconnaissance technique uses search engines to find sensitive exposed information?",
        explanation: "Google dorking uses advanced search operators to find exposed files, credentials, and misconfigurations indexed by search engines.",
        difficulty: "Intermediate",
        options: [
          { text: "Google dorking", isCorrect: true },
          { text: "Ping sweeping", isCorrect: false },
          { text: "Port scanning", isCorrect: false },
          { text: "Packet sniffing", isCorrect: false },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Clearing existing data...");
  await db.option.deleteMany();
  await db.attempt.deleteMany();
  await db.question.deleteMany();
  await db.test.deleteMany();
  await db.category.deleteMany();

  console.log("Creating categories...");
  const categoryMap: Record<string, string> = {};
  for (const c of categories) {
    const created = await db.category.create({ data: c });
    categoryMap[c.slug] = created.id;
  }

  console.log("Creating tests with questions...");
  for (const t of tests) {
    const categoryId = categoryMap[t.categorySlug];
    const test = await db.test.create({
      data: {
        title: t.title,
        slug: t.slug,
        description: t.description,
        difficulty: t.difficulty,
        durationMin: t.durationMin,
        passingScore: t.passingScore,
        tags: t.tags,
        categoryId,
      },
    });
    for (const q of t.questions) {
      await db.question.create({
        data: {
          text: q.text,
          explanation: q.explanation,
          difficulty: q.difficulty,
          testId: test.id,
          categoryId,
          options: { create: q.options },
        },
      });
    }
  }

  console.log("Creating standalone practice questions...");
  for (const group of practiceQuestions) {
    const categoryId = categoryMap[group.categorySlug];
    for (const q of group.questions) {
      await db.question.create({
        data: {
          text: q.text,
          explanation: q.explanation,
          difficulty: q.difficulty,
          testId: null,
          categoryId,
          options: { create: q.options },
        },
      });
    }
  }

  const counts = {
    categories: await db.category.count(),
    tests: await db.test.count(),
    questions: await db.question.count(),
    options: await db.option.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
