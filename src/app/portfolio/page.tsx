import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PortfolioPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">My Portfolio</h1>
      <section id="about" className="my-12">
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Welcome to my portfolio! I am a software engineer with a passion for building robust and scalable applications.
              I specialize in full-stack development with a focus on modern web technologies.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="projects" className="my-12">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project cards will go here */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold mb-2">Currency Converter</h3>
                <p className="text-gray-400 mb-4">A real-time currency conversion application built with Next.js and Tailwind CSS.</p>
                <a href="/currency-converter" className="text-blue-400 hover:underline">View Project</a>
              </Card>
              {/* Add more project cards as needed */}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="skills" className="my-12">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2">
              <li>JavaScript (ES6+)</li>
              <li>TypeScript</li>
              <li>React.js</li>
              <li>Next.js</li>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>Python</li>
              <li>SQL (PostgreSQL, MySQL)</li>
              <li>NoSQL (MongoDB)</li>
              <li>RESTful APIs</li>
              <li>Git/GitHub</li>
              <li>AWS</li>
              <li>Docker</li>
              <li>Tailwind CSS</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="contact" className="my-12">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Feel free to reach out to me via email at <a href="mailto:your.email@example.com" className="text-blue-400 hover:underline">your.email@example.com</a> or connect with me on <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">LinkedIn</a>.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default PortfolioPage;
