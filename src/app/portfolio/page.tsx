import React from 'react';
import ProjectCard from '../../components/portfolio/ProjectCard';
import { projects } from '../../lib/portfolio-data';

const PortfolioPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Portfolio</h1>
      <p className="text-center text-lg mb-12">Welcome to my portfolio! Check out some of my projects below.</p>
      <div className="flex flex-wrap justify-center">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            imageUrl={project.imageUrl}
            projectUrl={project.projectUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;