
import React from 'react';

const Testimonial = () => {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-white/70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
          
          <blockquote className="mt-6">
            <p className="text-xl md:text-2xl font-medium">
              "SkillTude's AI-powered recruitment platform transformed our hiring process. We reduced our time-to-hire by 47% while increasing the quality of our technical candidates. Their deep understanding of the tech industry made all the difference."
            </p>
          </blockquote>
          

        </div>
      </div>
    </section>
  );
};

export default Testimonial;
