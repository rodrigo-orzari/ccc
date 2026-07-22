# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filters.spec.ts >> Dashboard Filter Validation >> Networking: Loads successfully without empty state
- Location: tests/filters.spec.ts:75:3

# Error details

```
Error: locator.click: Error: strict mode violation: locator('nav a').filter({ hasText: 'Networking' }) resolved to 2 elements:
    1) <a href="/?product=networking" class="flex items-center gap-3 rounded px-2.5 py-2 text-xs font-bold transition-all border border-transparent text-[#737373] hover:text-black dark:hover:text-[#f7f8ff] opacity-70 hover:opacity-100 ">…</a> aka locator('a').filter({ hasText: 'Networking' }).first()
    2) <a href="/?product=networking" class="flex items-center gap-3 rounded px-2.5 py-2 text-xs font-bold transition-all border border-transparent text-[#737373] hover:text-black dark:hover:text-[#f7f8ff] opacity-70 hover:opacity-100 ">…</a> aka getByRole('link', { name: 'Networking' })

Call log:
  - waiting for locator('nav a').filter({ hasText: 'Networking' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "Compare Cloud Costs - AWS, Azure, Google Cloud Pricing" [level=1] [ref=e3]
    - complementary [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]: Categories
        - button "Collapse sidebar" [expanded] [ref=e7]:
          - img [ref=e8]
      - navigation [ref=e11]:
        - link "Artificial Intelligence" [ref=e12] [cursor=pointer]:
          - /url: /?product=ai
          - img [ref=e13]
          - generic [ref=e21]: Artificial Intelligence
        - link "App Hosting" [ref=e22] [cursor=pointer]:
          - /url: /?product=app-hosting
          - img [ref=e23]
          - generic [ref=e28]: App Hosting
        - link "Containers" [ref=e29] [cursor=pointer]:
          - /url: /?product=containers
          - img [ref=e30]
          - generic [ref=e34]: Containers
        - link "Data & Analytics" [ref=e35] [cursor=pointer]:
          - /url: /?product=data-analytics
          - img [ref=e36]
          - generic [ref=e38]: Data & Analytics
        - link "Databases" [ref=e39] [cursor=pointer]:
          - /url: /?product=database
          - img [ref=e40]
          - generic [ref=e44]: Databases
        - link "GPU" [ref=e45] [cursor=pointer]:
          - /url: /?product=gpu
          - img [ref=e46]
          - generic [ref=e49]: GPU
        - link "Integration" [ref=e50] [cursor=pointer]:
          - /url: /?product=integration
          - img [ref=e51]
          - generic [ref=e53]: Integration
        - link "Networking" [ref=e54] [cursor=pointer]:
          - /url: /?product=networking
          - img [ref=e55]
          - generic [ref=e60]: Networking
        - link "Security & Identity" [ref=e61] [cursor=pointer]:
          - /url: /?product=security
          - img [ref=e62]
          - generic [ref=e65]: Security & Identity
        - link "Serverless" [ref=e66] [cursor=pointer]:
          - /url: /?product=serverless
          - img [ref=e67]
          - generic [ref=e69]: Serverless
        - link "Storage" [ref=e70] [cursor=pointer]:
          - /url: /?product=storage
          - img [ref=e71]
          - generic [ref=e73]: Storage
        - link "Virtual Machines" [ref=e74] [cursor=pointer]:
          - /url: /?product=compute
          - img [ref=e75]
          - generic [ref=e78]: Virtual Machines
        - link "Workloads" [ref=e79] [cursor=pointer]:
          - /url: /workloads
          - img [ref=e80]
          - generic [ref=e84]: Workloads
        - link "Compliance" [ref=e85] [cursor=pointer]:
          - /url: /certifications
          - img [ref=e86]
          - generic [ref=e89]: Compliance
        - link "Datacenters" [ref=e90] [cursor=pointer]:
          - /url: /datacenters
          - img [ref=e91]
          - generic [ref=e95]: Datacenters
        - link "Bring your Bill Soon" [ref=e96] [cursor=pointer]:
          - /url: /bill
          - img [ref=e97]
          - generic [ref=e100]: Bring your Bill
          - generic [ref=e101]: Soon
        - link "Contact" [ref=e102] [cursor=pointer]:
          - /url: mailto:hello@comparecloudcosts.com
          - img [ref=e103]
          - generic [ref=e106]: Contact
        - link "Documentation" [ref=e107] [cursor=pointer]:
          - /url: /docs
          - img [ref=e108]
          - generic [ref=e110]: Documentation
        - link "GitHub" [ref=e111] [cursor=pointer]:
          - /url: https://github.com/rodrigo-orzari/ccc
          - img [ref=e112]
          - generic [ref=e115]: GitHub
        - link "Privacy" [ref=e116] [cursor=pointer]:
          - /url: /privacy
          - img [ref=e117]
          - generic [ref=e120]: Privacy
        - link "Sponsors" [ref=e121] [cursor=pointer]:
          - /url: /sponsors
          - img [ref=e122]
          - generic [ref=e127]: Sponsors
        - link "Status" [ref=e128] [cursor=pointer]:
          - /url: /status
          - img [ref=e129]
          - generic [ref=e131]: Status
        - link "Terms" [ref=e132] [cursor=pointer]:
          - /url: /terms
          - img [ref=e133]
          - generic [ref=e137]: Terms
    - generic [ref=e138]:
      - generic [ref=e139]:
        - complementary [ref=e140]:
          - generic [ref=e141]:
            - paragraph [ref=e142]: Compare AI and machine-learning pricing across providers — foundation models and inference endpoints. Filter by service type, model tier, context window, and multimodal support to compare input and output token pricing across model families side by side. Double-click to isolate one.
            - generic [ref=e143]:
              - generic [ref=e144]:
                - heading "Provider" [level=2] [ref=e145]:
                  - button "Provider" [ref=e146]:
                    - img [ref=e147]
                    - text: Provider
                    - img [ref=e150]
                - button "Clear All" [ref=e152]
              - generic [ref=e153]:
                - generic [ref=e154]:
                  - generic [ref=e155]: Cloud Platforms
                  - generic [ref=e156]:
                    - button "AWS" [ref=e157]
                    - button "Azure" [ref=e158]
                    - button "Google" [ref=e159]
                    - button "Oracle" [ref=e160]
                    - button "DigitalOcean" [ref=e161]
                    - button "Alibaba" [ref=e162]
                - generic [ref=e163]:
                  - generic [ref=e164]: Specialized Providers
                  - generic [ref=e165]:
                    - button "OpenAI" [ref=e166]
                    - button "Anthropic" [ref=e167]
            - generic [ref=e168]:
              - generic [ref=e169]:
                - heading "Service Type" [level=2] [ref=e170]:
                  - button "Service Type" [ref=e171]:
                    - img [ref=e172]
                    - text: Service Type
                    - img [ref=e175]
                - button "Clear All" [ref=e177]
              - generic [ref=e178]:
                - button "Foundational Models" [ref=e179]
                - button "Embeddings" [ref=e180]
            - generic [ref=e182]:
              - generic [ref=e183]:
                - heading "Model Tier" [level=2] [ref=e184]:
                  - button "Model Tier" [ref=e185]:
                    - img [ref=e186]
                    - text: Model Tier
                    - img [ref=e189]
                - button "Clear All" [ref=e191]
              - generic [ref=e192]:
                - button "Frontier" [ref=e193]
                - button "Standard" [ref=e194]
                - button "Efficient" [ref=e195]
            - generic [ref=e197]:
              - generic [ref=e198]:
                - heading "Context Window" [level=2] [ref=e199]:
                  - button "Context Window" [ref=e200]:
                    - img [ref=e201]
                    - text: Context Window
                    - img [ref=e204]
                - button "Clear All" [ref=e206]
              - generic [ref=e207]:
                - button "< 32K" [ref=e208]
                - button "32K - 128K" [ref=e209]
                - button "> 128K" [ref=e210]
                - button "1M+" [ref=e211]
            - generic [ref=e213]:
              - generic [ref=e214]:
                - heading "Multimodal" [level=2] [ref=e215]:
                  - button "Multimodal" [ref=e216]:
                    - img [ref=e217]
                    - text: Multimodal
                    - img [ref=e220]
                - button "Clear All" [ref=e222]
              - generic [ref=e223]:
                - button "Yes" [ref=e224]
                - button "No" [ref=e225]
            - generic [ref=e227]:
              - generic [ref=e228]:
                - heading "Price" [level=2] [ref=e229]:
                  - button "Price" [ref=e230]:
                    - img [ref=e231]
                    - text: Price
                    - img [ref=e234]
                - button "Clear All" [ref=e236]
              - generic [ref=e237]:
                - generic [ref=e238]:
                  - generic [ref=e239]: Input Price ($/1M Tokens)
                  - generic [ref=e240]:
                    - generic [ref=e241]:
                      - generic [ref=e242]:
                        - text: Min
                        - generic [ref=e243]: $0
                      - generic [ref=e244]:
                        - text: Max
                        - generic [ref=e245]: $100
                    - generic [ref=e246]:
                      - slider: "0"
                      - slider: "100"
                - generic [ref=e248]:
                  - generic [ref=e249]: Output Price ($/1M Tokens)
                  - generic [ref=e250]:
                    - generic [ref=e251]:
                      - generic [ref=e252]:
                        - text: Min
                        - generic [ref=e253]: $0
                      - generic [ref=e254]:
                        - text: Max
                        - generic [ref=e255]: $100
                    - generic [ref=e256]:
                      - slider: "0"
                      - slider: "100"
        - main [ref=e258]:
          - generic [ref=e260]:
            - button "Alibaba 0" [ref=e261] [cursor=pointer]:
              - generic [ref=e262]:
                - generic [ref=e263]: Alibaba
                - generic [ref=e264]: "0"
            - button "Anthropic 0" [ref=e265] [cursor=pointer]:
              - generic [ref=e266]:
                - generic [ref=e267]: Anthropic
                - generic [ref=e268]: "0"
            - button "AWS 0" [ref=e269] [cursor=pointer]:
              - generic [ref=e270]:
                - generic [ref=e271]: AWS
                - generic [ref=e272]: "0"
            - button "Azure 0" [ref=e273] [cursor=pointer]:
              - generic [ref=e274]:
                - generic [ref=e275]: Azure
                - generic [ref=e276]: "0"
            - button "DigitalOcean 0" [ref=e277] [cursor=pointer]:
              - generic [ref=e278]:
                - generic [ref=e279]: DigitalOcean
                - generic [ref=e280]: "0"
            - button "Google 0" [ref=e281] [cursor=pointer]:
              - generic [ref=e282]:
                - generic [ref=e283]: Google
                - generic [ref=e284]: "0"
            - button "OpenAI 0" [ref=e285] [cursor=pointer]:
              - generic [ref=e286]:
                - generic [ref=e287]: OpenAI
                - generic [ref=e288]: "0"
            - button "Oracle 0" [ref=e289] [cursor=pointer]:
              - generic [ref=e290]:
                - generic [ref=e291]: Oracle
                - generic [ref=e292]: "0"
          - generic [ref=e294]:
            - generic [ref=e295]: "0"
            - generic [ref=e296]:
              - img [ref=e297]
              - textbox "Search..." [ref=e300]
            - generic [ref=e301]:
              - generic [ref=e303]: Click a column header to sort
              - generic [ref=e304]:
                - button "🗄️ Table" [ref=e305]
                - button "📊 Charts" [ref=e306]
              - generic [ref=e307]:
                - generic "Price increased since last ingest" [ref=e308]: ▲
                - generic "Price decreased since last ingest" [ref=e309]: ▼
                - generic "Price unchanged since last ingest" [ref=e310]: ●
                - generic [ref=e311]: vs last ingest
              - button "Export" [disabled] [ref=e312]:
                - img [ref=e313]
                - text: Export
          - table [ref=e318]:
            - rowgroup [ref=e328]:
              - row "Provider ↕ Product ⓘ ↕ Service ↕ Model Tier ↕ Context Window ↕ Multimodal ↕ Input Price ↑ Output Price ↕" [ref=e329]:
                - columnheader "Provider ↕" [ref=e330] [cursor=pointer]:
                  - generic [ref=e331]:
                    - text: Provider
                    - generic [ref=e332]: ↕
                - columnheader "Product ⓘ ↕" [ref=e334] [cursor=pointer]:
                  - generic [ref=e335]:
                    - generic "Provider instance/model identifier — searchable in the provider's catalog." [ref=e336]: Product ⓘ
                    - generic [ref=e337]: ↕
                - columnheader "Service ↕" [ref=e339] [cursor=pointer]:
                  - generic [ref=e340]:
                    - text: Service
                    - generic [ref=e341]: ↕
                - columnheader "Model Tier ↕" [ref=e343] [cursor=pointer]:
                  - generic [ref=e344]:
                    - generic [ref=e345]:
                      - generic [ref=e346]: Model
                      - generic [ref=e347]: Tier
                    - generic [ref=e348]: ↕
                - columnheader "Context Window ↕" [ref=e350] [cursor=pointer]:
                  - generic [ref=e351]:
                    - text: Context
                    - text: Window
                    - generic [ref=e352]: ↕
                - columnheader "Multimodal ↕" [ref=e354] [cursor=pointer]:
                  - generic [ref=e355]:
                    - text: Multimodal
                    - generic [ref=e356]: ↕
                - columnheader "Input Price ↑" [ref=e358] [cursor=pointer]:
                  - generic [ref=e359]:
                    - text: Input
                    - text: Price
                    - generic [ref=e360]: ↑
                - columnheader "Output Price ↕" [ref=e362] [cursor=pointer]:
                  - generic [ref=e363]:
                    - text: Output
                    - text: Price
                    - generic [ref=e364]: ↕
            - rowgroup [ref=e366]:
              - row [ref=e367]:
                - cell [ref=e368]
                - cell [ref=e370]
                - cell [ref=e372]
                - cell [ref=e374]
                - cell [ref=e376]
                - cell [ref=e378]
                - cell [ref=e380]
                - cell [ref=e382]
              - row [ref=e384]:
                - cell [ref=e385]
                - cell [ref=e387]
                - cell [ref=e389]
                - cell [ref=e391]
                - cell [ref=e393]
                - cell [ref=e395]
                - cell [ref=e397]
                - cell [ref=e399]
              - row [ref=e401]:
                - cell [ref=e402]
                - cell [ref=e404]
                - cell [ref=e406]
                - cell [ref=e408]
                - cell [ref=e410]
                - cell [ref=e412]
                - cell [ref=e414]
                - cell [ref=e416]
              - row [ref=e418]:
                - cell [ref=e419]
                - cell [ref=e421]
                - cell [ref=e423]
                - cell [ref=e425]
                - cell [ref=e427]
                - cell [ref=e429]
                - cell [ref=e431]
                - cell [ref=e433]
              - row [ref=e435]:
                - cell [ref=e436]
                - cell [ref=e438]
                - cell [ref=e440]
                - cell [ref=e442]
                - cell [ref=e444]
                - cell [ref=e446]
                - cell [ref=e448]
                - cell [ref=e450]
              - row [ref=e452]:
                - cell [ref=e453]
                - cell [ref=e455]
                - cell [ref=e457]
                - cell [ref=e459]
                - cell [ref=e461]
                - cell [ref=e463]
                - cell [ref=e465]
                - cell [ref=e467]
              - row [ref=e469]:
                - cell [ref=e470]
                - cell [ref=e472]
                - cell [ref=e474]
                - cell [ref=e476]
                - cell [ref=e478]
                - cell [ref=e480]
                - cell [ref=e482]
                - cell [ref=e484]
              - row [ref=e486]:
                - cell [ref=e487]
                - cell [ref=e489]
                - cell [ref=e491]
                - cell [ref=e493]
                - cell [ref=e495]
                - cell [ref=e497]
                - cell [ref=e499]
                - cell [ref=e501]
              - row [ref=e503]:
                - cell [ref=e504]
                - cell [ref=e506]
                - cell [ref=e508]
                - cell [ref=e510]
                - cell [ref=e512]
                - cell [ref=e514]
                - cell [ref=e516]
                - cell [ref=e518]
              - row [ref=e520]:
                - cell [ref=e521]
                - cell [ref=e523]
                - cell [ref=e525]
                - cell [ref=e527]
                - cell [ref=e529]
                - cell [ref=e531]
                - cell [ref=e533]
                - cell [ref=e535]
              - row [ref=e537]:
                - cell [ref=e538]
                - cell [ref=e540]
                - cell [ref=e542]
                - cell [ref=e544]
                - cell [ref=e546]
                - cell [ref=e548]
                - cell [ref=e550]
                - cell [ref=e552]
              - row [ref=e554]:
                - cell [ref=e555]
                - cell [ref=e557]
                - cell [ref=e559]
                - cell [ref=e561]
                - cell [ref=e563]
                - cell [ref=e565]
                - cell [ref=e567]
                - cell [ref=e569]
              - row [ref=e571]:
                - cell [ref=e572]
                - cell [ref=e574]
                - cell [ref=e576]
                - cell [ref=e578]
                - cell [ref=e580]
                - cell [ref=e582]
                - cell [ref=e584]
                - cell [ref=e586]
              - row [ref=e588]:
                - cell [ref=e589]
                - cell [ref=e591]
                - cell [ref=e593]
                - cell [ref=e595]
                - cell [ref=e597]
                - cell [ref=e599]
                - cell [ref=e601]
                - cell [ref=e603]
              - row [ref=e605]:
                - cell [ref=e606]
                - cell [ref=e608]
                - cell [ref=e610]
                - cell [ref=e612]
                - cell [ref=e614]
                - cell [ref=e616]
                - cell [ref=e618]
                - cell [ref=e620]
      - contentinfo [ref=e622]:
        - generic [ref=e623]:
          - link "Buy me a coffee ☕" [ref=e625] [cursor=pointer]:
            - /url: https://connect.intuit.com/pay/comparecloudcosts/scs-v1-824a8961cf5a42edb4a9669eadc326d633c0e43cb25c449994ebf699ef3f754543e8bdeece91480e82e233bb2fd5f5c5-0
          - generic [ref=e626]: © 2026 Co-Sell Plus LLC. Compare Cloud Costs is a Co-Sell Plus LLC product.
  - alert [ref=e627]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Dashboard Filter Validation', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Navigate to the dashboard
  6   |     await page.goto('/');
  7   |     // Wait for initial data load (loading indicator goes away)
  8   |     await page.waitForFunction(() => !document.querySelector('.animate-spin'));
  9   |   });
  10  | 
  11  |   test('VMs: Default counts display properly', async ({ page }) => {
  12  |     // Assert AWS tile is visible and has a count
  13  |     const awsTile = page.locator('div', { hasText: 'AWS' }).locator('xpath=ancestor::div[contains(@class, "group")]').first();
  14  |     await expect(awsTile).toBeVisible();
  15  | 
  16  |     // Verify it doesn't say 0 OF 0 initially
  17  |     const countText = await awsTile.innerText();
  18  |     expect(countText).not.toContain('0 OF 0');
  19  |   });
  20  | 
  21  |   test('Serverless: Clearing all languages forces 0 results', async ({ page }) => {
  22  |     // Click Serverless tab
  23  |     await page.locator('nav a', { hasText: 'Serverless' }).click();
  24  |     await page.waitForFunction(() => !document.querySelector('.animate-spin'));
  25  | 
  26  |     const awsTile = page.locator('div:has-text("AWS")').filter({ has: page.locator('span:has-text("OF")') }).first();
  27  |     const initialText = await awsTile.innerText();
  28  |     expect(initialText).not.toContain('0 OF'); // Initially it should have full counts
  29  | 
  30  |     // Expand language support section if needed
  31  |     const langHeader = page.locator('button', { hasText: 'Language Support' });
  32  |     if (await langHeader.isVisible()) {
  33  |       await langHeader.click();
  34  |     }
  35  | 
  36  |     // Click 'Clear All' next to Language Support
  37  |     const clearAllBtn = page.locator('h2', { hasText: 'Language Support' })
  38  |       .locator('xpath=following-sibling::button')
  39  |       .filter({ hasText: 'Clear All' });
  40  |       
  41  |     if (await clearAllBtn.isVisible()) {
  42  |       await clearAllBtn.click();
  43  |       await page.waitForTimeout(500); // give React state time to update
  44  | 
  45  |       // The count should now be 0 OF [Total]
  46  |       const clearedText = await awsTile.innerText();
  47  |       expect(clearedText).toContain('0 OF');
  48  | 
  49  |       // The table should be empty
  50  |       const emptyState = page.getByText('No matches for your filters.');
  51  |       await expect(emptyState).toBeVisible();
  52  |     }
  53  |   });
  54  | 
  55  |   test('Database: Provider selection updates total items', async ({ page }) => {
  56  |     // Click Databases tab
  57  |     await page.locator('nav a', { hasText: 'Databases' }).click();
  58  |     await page.waitForFunction(() => !document.querySelector('.animate-spin'));
  59  | 
  60  |     // Check table has rows
  61  |     const rows = page.locator('table tbody tr');
  62  |     const initialRowCount = await rows.count();
  63  |     expect(initialRowCount).toBeGreaterThan(0);
  64  | 
  65  |     // Click AWS provider to toggle it off
  66  |     const awsTile = page.locator('div:has-text("AWS")').filter({ has: page.locator('span:has-text("OF")') }).first();
  67  |     await awsTile.click();
  68  |     await page.waitForTimeout(500);
  69  | 
  70  |     // Row count should be different if AWS was removed
  71  |     const newRowCount = await rows.count();
  72  |     expect(newRowCount).not.toEqual(initialRowCount);
  73  |   });
  74  | 
  75  |   test('Networking: Loads successfully without empty state', async ({ page }) => {
  76  |     // Click Networking tab
> 77  |     await page.locator('nav a', { hasText: 'Networking' }).click();
      |                                                            ^ Error: locator.click: Error: strict mode violation: locator('nav a').filter({ hasText: 'Networking' }) resolved to 2 elements:
  78  |     await page.waitForFunction(() => !document.querySelector('.animate-spin'));
  79  | 
  80  |     // The table should have rows, not "No matches for your filters"
  81  |     const emptyState = page.getByText('No matches for your filters.');
  82  |     await expect(emptyState).toBeHidden();
  83  | 
  84  |     const rows = page.locator('table tbody tr');
  85  |     expect(await rows.count()).toBeGreaterThan(0);
  86  |   });
  87  | 
  88  |   test('Data & Analytics: Loads successfully without database empty warning', async ({ page }) => {
  89  |     // Click Data & Analytics tab
  90  |     await page.locator('nav a', { hasText: 'Data & Analytics' }).click();
  91  |     await page.waitForFunction(() => !document.querySelector('.animate-spin'));
  92  | 
  93  |     // Should NOT show the Database is empty warning box
  94  |     const databaseEmptyWarning = page.getByText('Database is empty');
  95  |     await expect(databaseEmptyWarning).toBeHidden();
  96  | 
  97  |     // The table should have actual rows
  98  |     const rows = page.locator('table tbody tr');
  99  |     expect(await rows.count()).toBeGreaterThan(0);
  100 |   });
  101 | });
  102 | 
```