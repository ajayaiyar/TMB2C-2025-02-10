import React from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';

export default function TermsPage() {
  return (
    <PageLayout>
      <Container>
        <Section>
          <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
          
          <div className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using TeacherMate, you agree to be bound by these Terms and Conditions.</p>

            <h2>2. User Rights and Responsibilities</h2>
            <ul>
              <li>Users must be authorized educators or educational administrators</li>
              <li>Users are responsible for maintaining account security</li>
              <li>Content generated must be used for educational purposes only</li>
            </ul>

            <h2>3. Usage Limitations</h2>
            <ul>
              <li>Commercial use or resale of generated content is prohibited</li>
              <li>Users may not share account credentials</li>
              <li>Bulk content generation may be rate-limited</li>
            </ul>

            <h2>4. Content Guidelines</h2>
            <ul>
              <li>Generated content must align with educational standards</li>
              <li>Users must review and verify AI-generated content</li>
              <li>Inappropriate or harmful content generation is prohibited</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <p>Users retain rights to their generated content while TeacherMate maintains rights to the platform and technology.</p>

            <h2>6. Dispute Resolution</h2>
            <p>Any disputes will be resolved through arbitration following applicable education sector regulations.</p>

            <h2>7. Modifications</h2>
            <p>TeacherMate reserves the right to modify these terms with notice to users.</p>
          </div>
        </Section>
      </Container>
    </PageLayout>
  );
}