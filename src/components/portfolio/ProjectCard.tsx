import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  projectUrl,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <Image 
        className="w-full h-48 object-cover"
        src={imageUrl}
        alt={title}
        width={400} 
        height={250}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      {projectUrl && (
        <div className="px-6 pt-4 pb-2">
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Project
          </a>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;