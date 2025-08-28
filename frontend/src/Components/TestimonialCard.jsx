import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = React.memo(({ name, role, content }) => {
  return (
    <div 
      className="glass-card p-8 md:p-10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
      role="article"
      aria-labelledby="testimonial-author"
    >
      {/* Quote icon */}
      <div className="flex justify-end mb-5">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Quote className="w-5 h-5 text-white/60" aria-hidden="true" />
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center mb-5" role="img" aria-label="Avaliação de 5 estrelas">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current mr-1" 
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Content */}
      <blockquote className="text-white/80 mb-6 italic text-base md:text-lg leading-relaxed font-light">
        <p className="relative">
          <span className="text-3xl text-white/20 absolute -left-2 -top-2">"</span>
          {content}
          <span className="text-3xl text-white/20 absolute -right-2 -bottom-2">"</span>
        </p>
      </blockquote>

      {/* Author */}
      <footer className="flex items-center justify-between">
        <div>
          <p 
            id="testimonial-author"
            className="font-semibold text-base md:text-lg text-white tracking-wide mb-1"
          >
            {name}
          </p>
          <p className="text-white/60 text-sm font-light">
            {role}
          </p>
        </div>
        
        {/* Decorative element */}
        <div className="w-10 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
      </footer>
    </div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;
