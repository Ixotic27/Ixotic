"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  topics: string[];
  html_url: string;
  homepage?: string;
  pushedYear: string;
  index: number;
}

export default function ProjectCard({
  name,
  description,
  topics,
  html_url,
  homepage,
  pushedYear,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: 30 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 80 }}
      whileHover={{ scale: 1.02, y: -5, rotateY: -5 }}
      className="group relative flex flex-col justify-between p-6 bg-[#16161e] border border-[#2a2a35] rounded-xl hover:border-cyan-400/50 hover:shadow-lg transition-all h-[320px] overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 font-pixel text-xs text-purple-400 opacity-40 group-hover:opacity-100 transition-opacity">
        [{pushedYear}]
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-text-primary group-hover:text-cyan-400 transition-colors line-clamp-2">
          {name.replace(/-/g, " ")}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-4">
          {description || "No description provided."}
        </p>
      </div>

      <div className="space-y-4 mt-auto">
        <div className="flex flex-wrap gap-2">
          {topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-1 bg-cyan-400/10 text-cyan-400 rounded-md"
            >
              #{topic}
            </span>
          ))}
          {topics.length > 3 && (
            <span className="text-xs px-2 py-1 text-text-secondary">
              +{topics.length - 3}
            </span>
          )}
        </div>

        <div className="flex gap-4 pt-4 border-t border-[#2a2a35]">
          <a
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-white transition-colors"
          >
            <Github size={20} />
          </a>
          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-white transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
