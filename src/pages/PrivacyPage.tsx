import React from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';

export default function PrivacyPage() {
  return (
    <PageLayout>
      <Container>
        <Section>
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <h2>1. Data Collection</h2>
            <p>We collect the following information:</p>
            <ul>
              <li>Account information (name, email, school)</li>
              <li>Usage data and content generation history</li>
              <li>Technical information (device, browser type)</li>
            </ul>

            <h2>2. Data Storage and Protection</h2>
            <ul>
              <li>Data is encrypted at rest and in transit</li>
              <li>Regular security audits and updates</li>
              <li>Limited employee access to user data</li>
            </ul>

            <h2>3. Third-Party Sharing</h2>
            <p>We share data with:</p>
            <ul>
              <li>OpenAI (for content generation)</li>
              <li>Supabase (for data storage)</li>
              <li>Analytics providers (anonymized data only)</li>
            </ul>

            <h2>4. Cookie Policy</h2>
            <p>We use cookies for:</p>
            <ul>
              <li>Authentication and session management</li>
              <li>User preferences</li>
              <li>Analytics and performance monitoring</li>
            </ul>

            <h2>5. GDPR Compliance</h2>
            <ul>
              <li>Right to access your data</li>
              <li>Right to data portability</li>
              <li>Right to be forgotten</li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>User data is retained for the duration of account activity plus 30 days after account deletion.</p>
          </div>
        </Section>
      </Container>
    </PageLayout>
  );
}