import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Twitter, Linkedin, Github, Youtube } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Documentation", "API"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Contact"],
    },
    {
      title: "Resources",
      links: ["Knowledge Base", "Support", "FAQs", "Community"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Compliance", "Security"],
    },
  ];

  const socialLinks = [
    {
      icon: <Twitter size={20} />,
      href: "https://twitter.com/biochartrack",
      label: "Twitter",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://linkedin.com/company/biochartrack",
      label: "LinkedIn",
    },
    {
      icon: <Github size={20} />,
      href: "https://github.com/biochartrack",
      label: "GitHub",
    },
    {
      icon: <Youtube size={20} />,
      href: "https://youtube.com/biochartrack",
      label: "YouTube",
    },
  ];

  return (
    <footer className="border-t border-gray-800 py-16 bg-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Logo and Description Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-400/10 rounded-lg">
                <Leaf className="h-6 w-6 text-green-400" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                BIOCHAR TRACK
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Revolutionizing agriculture through smart biochar production
              tracking. Join us in building a sustainable future for modern
              farming.
            </p>

            {/* Social Links for Mobile */}
            <div className="flex items-center gap-4 mt-6 lg:hidden">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-green-400 hover:bg-gray-800 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 text-gray-100 text-sm tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-400 hover:text-green-400 transition-colors text-sm group flex items-center gap-2"
                    >
                      <span className="h-1 w-1 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright and Legal Links */}
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} BIOCHAR TRACK. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-gray-400">
                {["Terms", "Privacy", "Cookies"].map((item, i) => (
                  <Link
                    key={i}
                    href={`/${item.toLowerCase()}`}
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Links for Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-green-400 hover:bg-gray-800 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
