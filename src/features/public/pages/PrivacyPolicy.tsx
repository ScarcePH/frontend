const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'We collect information you provide when you browse, create an account, place an order, contact us, or interact with Scarce PH online.',
    ],
    list: [
      'Contact details, such as your name, email address, phone number, and shipping address.',
      'Order details, such as selected products, sizes, quantities, payment status, delivery details, and purchase history.',
      'Account details, such as login credentials and authentication information.',
      'Messages and support requests you send through email, social media, or other contact channels.',
      'Technical information, such as device, browser, IP address, pages visited, and basic usage data.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'We use your information to operate the store, fulfill orders, support customers, and improve the Scarce PH shopping experience.',
    ],
    list: [
      'Process purchases, payments, reservations, deliveries, returns, and customer requests.',
      'Confirm orders, send transaction updates, and provide customer support.',
      'Maintain account access, authentication, security, and fraud prevention.',
      'Improve our website, product offerings, inventory planning, and customer service.',
      'Send relevant store updates, drop announcements, or promotional messages when allowed by law.',
    ],
  },
  {
    title: '3. Payment Information',
    body: [
      'Payment information may be processed through third-party payment providers. Scarce PH does not intentionally store complete card, bank, wallet, or payment credential details unless required for order verification, accounting, dispute resolution, or legal compliance.',
    ],
  },
  {
    title: '4. Sharing of Information',
    body: [
      'We do not sell your personal information. We may share only the information needed to operate the store and complete transactions.',
    ],
    list: [
      'Delivery, logistics, and courier partners.',
      'Payment processors and financial service providers.',
      'Website hosting, analytics, security, and technical service providers.',
      'Government authorities, regulators, or law enforcement when legally required.',
    ],
  },
  {
    title: '5. Cookies and Similar Technologies',
    body: [
      'Our website may use cookies, local storage, analytics tools, and similar technologies to keep the site functional, remember preferences, understand usage, and improve performance. You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.',
    ],
  },
  {
    title: '6. Data Retention',
    body: [
      'We keep personal information only for as long as necessary for the purposes described in this Privacy Policy, including order fulfillment, customer support, accounting, security, dispute resolution, and legal compliance.',
    ],
  },
  {
    title: '7. Data Security',
    body: [
      'We use reasonable administrative, technical, and organizational measures to protect personal information. However, no online system is completely secure, and we cannot guarantee absolute protection against unauthorized access, disclosure, alteration, or loss.',
    ],
  },
  {
    title: '8. Your Rights',
    body: [
      'Depending on applicable law, you may request access to, correction of, deletion of, or restrictions on the use of your personal information. You may also object to certain processing or withdraw consent where processing is based on consent.',
    ],
  },
  {
    title: '9. Third-Party Links',
    body: [
      'Our website and social pages may link to third-party websites or services. We are not responsible for the privacy practices, content, or security of third-party platforms. Please review their privacy policies before providing personal information.',
    ],
  },
  {
    title: '10. Children\'s Privacy',
    body: [
      'Scarce PH is not intended for children under the age required by applicable law to provide consent. We do not knowingly collect personal information from children without proper consent from a parent or guardian.',
    ],
  },
  {
    title: '11. Changes to This Privacy Policy',
    body: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of the website after changes are posted means you acknowledge the updated policy.',
    ],
  },
]

export function PrivacyPolicy() {
  return (
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <article className="mx-auto w-full max-w-3xl">
        <header className="border-b pb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Scarce PH
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Effective Date: May 20, 2026
          </p>
        </header>

        <div className="space-y-9 py-8 text-base leading-7 text-foreground">
          <p>
            This Privacy Policy explains how Scarce PH collects, uses, stores,
            shares, and protects personal information when you visit our website,
            place an order, create an account, contact us, or interact with our
            online store and social media pages.
          </p>

          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>

              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground">
                  {paragraph}
                </p>
              ))}

              {section.list ? (
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="space-y-3 border-t pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              12. Contact Us
            </h2>
            <p className="text-muted-foreground">
              For questions, requests, or concerns about this Privacy Policy or
              how your personal information is handled, contact Scarce PH at{' '}
              <a
                href="mailto:marionrosete1@gmail.com"
                className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                marionrosete1@gmail.com
              </a>{' '}
              or through our{' '}
              <a
                href="https://facebook.com/scarceph"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                Facebook page
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
