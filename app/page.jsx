// ...existing code...
"use client";

import { Button } from "../components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";



export default function Home() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // added
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      if (isSignedIn) {
        await router.push("/workspace");
      } else {
        await router.push("/sign-in");
      }
      // navigation usually unmounts this page; no need to reset loading
    } catch (err) {
      console.error("Navigation failed:", err);
      setIsLoading(false);
    }
  };

  const handleJoinNow = async () => {
    setIsLoading(true);
    try {
      // send users to sign-up (or sign-in) - change route if you prefer
      await router.push("/sign-up");
    } catch (err) {
      console.error("Navigation failed:", err);
      setIsLoading(false);
    }
  };




  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-indigo-50 text-gray-900 overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4 bg-white/90 dark:bg-gray-900/90 p-6 rounded-xl shadow-lg">
            <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <p className="text-gray-800">Fetching your awesomeness...
            </p>
          </div>
        </div>
      )}

      {/*Navbar section*/}
      <header className="w-full px-6 sm:px-10 py-4 sm:py-6 flex items-center justify-between relative bg-gradient-to-b from-indigo-50 to-indigo-100 z-50">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0"
        >
          <Image src="/logo2.png" alt="Learnify logo" width={160} height={80} />
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-lg">
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#how" className="hover:text-indigo-600 transition">How it Works</a>
          <a href="#testimonials" className="hover:text-indigo-600 transition">Testimonials</a>
          <UserButton afterSignOutUrl="/" />
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(prev => !prev)}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden z-40">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#how" className="hover:text-indigo-600 transition">How it Works</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition">Testimonials</a>
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </header>




      {/* Hero Section */}
      <section className="w-full min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 lg:px-20 py-16 relative overflow-hidden">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 text-center md:text-left z-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
            Learn a{" "}
            <span className="text-indigo-600 underline decoration-yellow-400 underline-offset-4">
              New Skill
            </span>
            <br />
            Everyday, Anytime, <br />and Anywhere.
          </h1>

          <p className="text-gray-700 text-lg mb-8 max-w-lg mx-auto md:mx-0">
            1000+ Courses covering all tech domains for you to learn and explore new
            opportunities. Learn from Industry Experts and land your Dream Job.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">

            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
              onClick={handleStartTrial}
              disabled={isLoading}
            >
              Start Trial
            </Button>

            <Button
              variant="outline"
              className="border-2 border-indigo-600 text-indigo-600 text-lg px-8 py-6 rounded-full hover:bg-indigo-50"
            >
              How it Works
            </Button>
          </div>

          <div className="flex flex-wrap gap-10 mt-12 justify-center md:justify-start text-left">
            <div>
              <p className="text-yellow-500 text-3xl font-bold">1000+</p>
              <p className="text-gray-600 font-medium">Courses to choose from</p>
            </div>
            <div>
              <p className="text-indigo-600 text-3xl font-bold">5000+</p>
              <p className="text-gray-600 font-medium">Students Trained</p>
            </div>
            <div>
              <p className="text-red-500 text-3xl font-bold">200+</p>
              <p className="text-gray-600 font-medium">Professional Trainers</p>
            </div>
          </div>
        </motion.div>


        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="md:w-1/2 flex justify-center relative mt-10 md:mt-0"
        >
          {/* Yellow ring with student image */}
          <div className="relative w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px] aspect-square rounded-full border-[10px] border-yellow-400 flex items-center justify-center overflow-visible">
            {/* boy image slightly popping out from top */}
            <Image
              src="/student.png"
              alt="Learning student"
              width={340}
              height={440}
              className="object-cover rounded-full z-20 scale-110 -translate-y-4"
            />
          </div>

          {/* Floating Icons */}
          <motion.img
            src="/rocket.png"
            alt="Rocket"
            className="absolute -top-8 sm:-top-10 -left-10 w-20 sm:w-24 md:w-28 lg:w-32 z-10"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.img
            src="/trophy.png"
            alt="Trophy"
            className="absolute bottom-0 -right-10 w-20 sm:w-24 md:w-28 lg:w-32 z-10"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />

          {/* Small floating circles for background depth */}
          <div className="absolute -z-10 top-10 left-0 w-20 sm:w-28 md:w-32 bg-indigo-200 rounded-full opacity-60 blur-2xl"></div>
          <div className="absolute -z-10 bottom-10 right-0 w-24 sm:w-32 md:w-40 bg-purple-200 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -z-10 bottom-16 left-1/2 w-16 sm:w-20 md:w-24 bg-yellow-200 rounded-full opacity-40 blur-2xl"></div>
        </motion.div>
      </section>




      {/* Features Section */}
      <section id="features" className="py-20 bg-indigo-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-12"
          >
            Why Choose Learnify
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Interactive Learning", desc: "Engage with quizzes and real-time feedback that make learning fun." },
              { title: "Personalized Dashboard", desc: "Track your progress and get AI-powered course recommendations." },
              { title: "Community Support", desc: "Join groups, share notes, and learn with peers globally." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <h4 className="text-2xl font-semibold mb-4 text-indigo-600">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>




      {/* How It Works Section */}
      <section id="how" className="py-24 bg-gradient-to-b from-white to-indigo-100 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-12"
        >
          How It Works
        </motion.h3>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { step: "1", title: "Sign In", desc: "Create your account in seconds using Clerk." },
            { step: "2", title: "Explore Courses", desc: "Browse curated learning paths for your goals." },
            { step: "3", title: "Start Learning", desc: "Begin interactive lessons and track your journey." },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl relative overflow-hidden"
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-indigo-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
              <h4 className="text-5xl font-bold text-indigo-600 mb-4">{item.step}</h4>
              <h5 className="text-2xl font-semibold mb-3">{item.title}</h5>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>




      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-12"
        >
          What Our Users Say
        </motion.h3>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { name: "Aditi", quote: "Learnify made complex topics feel simple. I’m more confident than ever!" },
            { name: "Rohan", quote: "I love the interface and the progress tracking. Keeps me motivated daily!" },
            { name: "Priya", quote: "Finally a platform that feels alive — animations, design, everything’s on point!" },
          ].map((user, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="p-8 bg-white/10 rounded-2xl shadow-xl backdrop-blur-sm"
            >
              <p className="italic mb-6">“{user.quote}”</p>
              <h5 className="font-semibold text-lg">{user.name}</h5>
            </motion.div>
          ))}
        </div>
      </section>





      {/* CTA Section */}
      <section className="py-20 text-center bg-indigo-50">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold mb-6 text-gray-900"
        >
          Ready to Start Learning?
        </motion.h3>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            variant="secondary"
            className="bg-indigo-600 text-white font-bold text-xl px-10 py-6 rounded-full shadow-lg"
            onClick={handleJoinNow}
            disabled={isLoading}
          >
            Join Now
          </Button>
        </motion.div>
      </section>



      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Learnify. All rights reserved.
      </footer>
    </div>
  );
}
// ...existing code...