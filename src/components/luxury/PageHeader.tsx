import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb: { label: string; link?: string }[];
}

export default function PageHeader({ title, subtitle, breadcrumb }: PageHeaderProps) {
  return (
    <section className="bg-[#F8F5F0] border-b border-[#E8E1D5] pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="global-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Breadcrumb */}
          <nav className="flex text-[10px] uppercase tracking-[0.3em] font-bold text-secondary/60">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {item.link ? (
                  <Link to={item.link} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-primary">{item.label}</span>
                )}
                {index < breadcrumb.length - 1 && <span className="mx-2">/</span>}
              </React.Fragment>
            ))}
          </nav>

          {/* Title Area */}
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight">
              {title}
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-3 left-0 h-[2px] bg-[#C5A47E]"
            />
          </div>

          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground/80 font-light italic pt-2 max-w-2xl">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
