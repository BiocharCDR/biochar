"use client";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { animate, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart,
  ExternalLink,
  Leaf,
  Smartphone,
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 bg-gradient-to-br to-green-500/10 from-transparent ${
          scrolled
            ? "bg-gray-900/70 backdrop-blur-lg  border-gray-800/50"
            : "bg-transparent"
        }`}
      >
        <nav
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at center, rgba(52, 211, 153, 0.03) 0%, rgba(16, 185, 129, 0.01) 100%)",
          }}
        />
        <div className="relative container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Leaf className="h-6 w-6 text-green-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent ml-2 max-md:hidden font-mono">
                BIOCHAR dMRV
              </span>
            </motion.div>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border-transparent">
                  <div className="grid w-[600px] gap-3 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                    <Link
                      href="/features/furnace"
                      className="block p-4 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-6 w-6 text-green-400" />
                        <div>
                          <h3 className="font-medium text-gray-100">
                            Smart Furnace Integration
                          </h3>
                          <p className="text-sm text-gray-400">
                            Automated sensor data collection
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/features/mobile"
                      className="block p-4 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-6 w-6 text-green-400" />
                        <div>
                          <h3 className="font-medium text-gray-100">
                            Mobile Application
                          </h3>
                          <p className="text-sm text-gray-400">
                            Easy farm management on the go
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/pricing"
                  className="text-gray-300 text-sm hover:text-gray-100 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className="text-gray-300 text-sm hover:text-gray-100 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                    Docs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4 ">
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-gray-100 hover:bg-gray-800"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={stagger}
        className="relative py-20 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent" />
        <div className="container mx-auto relative">
          <motion.div
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white">
                Digital{" "}
                <span className="italic bg-gradient-to-tr from-green-200 to-emerald-700 bg-clip-text text-transparent">
                  BIOCHAR
                </span>{" "}
                MRV Platform
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Revolutionize your biochar production with automated monitoring,
                verified tracking, and blockchain-secured carbon credits.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signin">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 w-full sm:w-auto"
                  >
                    Start Free Trial
                  </Button>
                </motion.div>
              </Link>
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className=" text-green-700 w-full sm:w-auto"
                  >
                    Watch Demo
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={stagger}
            className="grid md:grid-cols-3 gap-6 mt-16"
          >
            {[
              {
                icon: <Thermometer className="h-8 w-8 text-green-400" />,
                title: "Smart Furnace Integration",
                features: [
                  "Real-time temperature monitoring",
                  "Automated weight tracking",
                  "Water usage optimization",
                ],
              },
              {
                icon: <Smartphone className="h-8 w-8 text-green-400" />,
                title: "Mobile Application",
                features: [
                  "Easy farmer registration",
                  "Land parcel management",
                  "Production tracking",
                ],
              },
              {
                icon: <BarChart className="h-8 w-8 text-green-400" />,
                title: "Analytics Dashboard",
                features: [
                  "Production insights",
                  "Inventory management",
                  "Performance reports",
                ],
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg blur-xl transition-all group-hover:blur-2xl" />
                <Card className="relative bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="text-gray-100">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-400">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Process Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
        <div className="container mx-auto relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
          >
            How It Works
          </motion.h2>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <Thermometer />,
                title: "Register Farm",
                desc: "Quick farm and land registration",
              },
              {
                icon: <Thermometer />,
                title: "Connect Furnace",
                desc: "Smart furnace integration",
              },
              {
                icon: <Leaf />,
                title: "Track Production",
                desc: "Real-time monitoring",
              },
              {
                icon: <BarChart />,
                title: "Analyze Data",
                desc: "Get actionable insights",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-gray-800/50 p-6 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border border-gray-700 group-hover:border-green-500 transition-colors"
                >
                  {React.cloneElement(step.icon, {
                    className: "h-8 w-8 text-green-400",
                  })}
                </motion.div>
                <h3 className="font-semibold mb-2 text-gray-100">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto text-center relative"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Ready to Transform Your Biochar Production?
          </h2>
          <p className="text-xl mb-8 text-gray-400">
            Join forward-thinking farmers who are optimizing their biochar
            production
          </p>
          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
