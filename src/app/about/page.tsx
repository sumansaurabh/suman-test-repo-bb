import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">About Me</h1>
      <div className="max-w-3xl mx-auto text-lg leading-relaxed">
        <p className="mb-4">
          Hello! I'm a passionate software engineer with a knack for building robust and scalable applications.
          My journey in the world of technology began with a curiosity for how things work, which quickly evolved
          into a dedication to creating meaningful solutions.
        </p>
        <p className="mb-4">
          I specialize in full-stack development, with a strong emphasis on front-end technologies like React and Next.js,
          and back-end frameworks such as Node.js (Express) and Python (FastAPI). I thrive in environments where
          I can continuously learn and apply new skills to solve complex problems.
        </p>
        <p className="mb-4">
          Beyond coding, I enjoy exploring new programming paradigms, contributing to open-source projects,
          and staying up-to-date with the latest industry trends. When I'm not at the keyboard,
          you can find me hiking, reading, or experimenting with new recipes in the kitchen.
        </p>
        <p>
          I am always open to collaborating on exciting projects and connecting with fellow enthusiasts.
          Feel free to explore my work in the portfolio section or reach out through the contact page!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;