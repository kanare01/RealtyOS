import React from 'react';

interface TechItemProps {
  category: string;
  name: string;
  description: string;
  logo: React.ReactElement;
}

const TechItem: React.FC<TechItemProps> = ({ category, name, description, logo }) => (
  <div className="bg-gray-800 border border-gray-600/50 rounded-lg p-6 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:-translate-y-1">
    <div className="w-16 h-16 mb-4 flex items-center justify-center">{logo}</div>
    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">{category}</span>
    <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const TechStack: React.FC = () => {
    const techList: TechItemProps[] = [
    {
      category: 'Frontend',
      name: 'React & TypeScript',
      description: 'A component-based UI library with static typing for building robust, scalable user interfaces.',
      logo: <svg className="w-12 h-12 text-blue-400" viewBox="0 0 128 128"><path fill="currentColor" d="M115.3 64c0-9.6-3.3-18.4-8.8-25.2c-5.1-6.4-12-11.2-19.9-13.9L32.2 6.5C30.6 6 29 6.2 27.9 7.3L9.2 26.1c-1.1 1.1-1.3 2.7-.4 4.1l11.4 17.8c-2.9 6.3-4.6 13.3-4.6 20.7c0 23.3 15.1 43.1 36.4 49.3l-1.6 4.9c-.4 1.3.4 2.7 1.7 3.1l17.7 5.7c1.3.4 2.7-.4 3.1-1.7l5.7-17.7c.4-1.3-.4-2.7-1.7-3.1l-4.9-1.6c18.5-4.8 32-20.9 32-40.1zm-51.3-33.1L96.8 41c-6.8-2-14.1-1.3-20.5 2.2c-10.4 5.7-17.4 16.5-17.4 28.1c0 2.2.2 4.4.7 6.5l-19-11.8c2.9-6.3 7.8-11.7 14.1-15.3c6.9-3.9 14.9-5.1 22.4-3.6zM37.1 64c0-10.6 6.1-19.8 15-24.1c11.7-5.7 25.8-2.6 34.3 6.9c7.2 8.1 10.2 18.9 8.3 28.9c-1.7 8.9-6.8 16.6-14 21.6c-11.7 8.1-27.2 6.6-36.9-3.3c-7.2-7.2-11-17.1-11-27.6c0-1.1 0-2.2.1-3.3z"></path></svg>,
    },
    {
      category: 'Backend',
      name: 'Django & Python',
      description: 'A high-level Python web framework that encourages rapid development and clean, pragmatic design.',
      logo: <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-2-12h4v2h-4v-2zm0 4h4v2h-4v-2zm0 4h4v2h-4v-2z"></path></svg>,
    },
     {
      category: 'Database',
      name: 'PostgreSQL',
      description: 'A powerful, open-source object-relational database system with a strong reputation for reliability.',
      logo: <svg className="w-12 h-12 text-indigo-400" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-12h2v8h-2v-8zm-4 4h2v4h-2v-4z"></path></svg>,
    },
    {
      category: 'API',
      name: 'GraphQL',
      description: 'A query language for APIs providing a more efficient, powerful and flexible alternative to REST.',
      logo: <svg className="w-12 h-12 text-pink-500" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-5-8h10v2H7v-2z"></path></svg>,
    },
    {
      category: 'Background Jobs',
      name: 'Celery & RabbitMQ',
      description: 'Distributed task queue for executing asynchronous tasks, paired with a robust message broker.',
      logo: <svg className="w-12 h-12 text-orange-500" viewBox="0 0 24 24"><path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>,
    },
    {
      category: 'DevOps & CI/CD',
      name: 'Docker & GitHub Actions',
      description: 'Containerization for consistent environments and automated workflows for building, testing, and deploying code.',
      logo: <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z M11 7h2v2h-2V7zm0 4h2v6h-2v-6z"></path></svg>,
    },
  ];

  return (
    <div>
      <div className="text-left mb-8">
        <h2 className="text-3xl font-extrabold text-white mb-2">Core Technology Stack</h2>
        <p className="text-gray-400">The foundational technologies chosen to build, run, and scale the RealtyOS platform.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {techList.map(tech => <TechItem key={tech.name} {...tech} />)}
      </div>
    </div>
  );
};

export default TechStack;
