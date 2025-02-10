import React from 'react';
import { BookOpen, Target, Users, Award } from 'lucide-react';
import { PageLayout } from '../components/ui/PageLayout';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';

export default function AboutPage() {
  return (
    <PageLayout>
      <Container>
        <Section>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">About TeacherMate</h1>
            
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                TeacherMate empowers Indian educators with AI-powered tools to create high-quality teaching materials aligned with NCERT guidelines and CBSE standards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <BookOpen className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">NCERT Aligned</h3>
                <p className="text-gray-600">
                  All content is carefully crafted to align with NCERT curriculum guidelines and textbooks.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Target className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
                <p className="text-gray-600">
                  Create custom content that meets your students' specific needs and learning styles.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Users className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Educator-First Approach</h4>
                    <p className="text-gray-600">We prioritize teachers' needs in every feature we develop.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Quality Education</h4>
                    <p className="text-gray-600">We maintain high standards in all our educational content.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-600">
                Have questions or feedback? We'd love to hear from you. Visit our <a href="/contact" className="text-indigo-600 hover:text-indigo-800">Contact page</a> to get in touch.
              </p>
            </div>
          </div>
        </Section>
      </Container>
    </PageLayout>
  );
}