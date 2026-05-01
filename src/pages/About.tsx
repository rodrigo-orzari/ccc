import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

const AboutPage: React.FC = () => {
  const content = `
**CompareCloudCosts.com** is an open-source tool designed to help developers and architects understand the real costs of cloud infrastructure.

## Contents

- [Why we built this](#why-we-built-this)
- [Features](#features)
- [Privacy Policy](#privacy-policy)

## Why we built this
Cloud providers often hide their pricing behind complex calculators and regional variations. We believe in transparency and simplicity.

## Features
- **Global Comparison**: See prices across different geographies.
- **Unified Filtering**: Filter by vCPU, Memory, OS, and Architecture regardless of the provider.
- **Real-time Data**: Directly synced with official price lists.

## Privacy Policy

_Last updated: 1 May 2026._

CompareCloudCosts.com is a free, public price-comparison tool. We aim to collect as little information about visitors as possible.

### Information we collect

- **No account required.** You can use the site without signing up or logging in.
- **No personal information stored.** We do not ask for your name, email, address, or any other identifying information.
- **Server logs.** Our hosting provider records standard request logs (IP address, user agent, timestamp, page requested) for operational and security purposes. These are retained briefly and never sold.

### Third-party advertising

This site displays advertisements served by Google AdSense. Google and its partners may use cookies and other identifiers to serve and personalise ads based on your browsing activity on this and other sites.

You can review Google's privacy practices at [policies.google.com/privacy](https://policies.google.com/privacy) and manage your ad preferences at [adssettings.google.com](https://adssettings.google.com). You can also opt out of personalised advertising at [aboutads.info/choices](https://www.aboutads.info/choices).

### Cookies

In addition to advertising cookies, the site may set minimal first-party cookies for basic functionality (e.g. remembering UI state). It does not use cookies for tracking or analytics tied to identity.

### Children

This site is not directed at children under 13 and we do not knowingly collect information from children.

### Changes to this policy

If we update this policy, we will revise the "Last updated" date at the top of this section. Continued use of the site constitutes acceptance of the updated policy.

### Contact

Questions about this policy? Email [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).
`;

  return <MarkdownPage title="What is CompareCloudCosts.com?" content={content} />;
};

export default AboutPage;
