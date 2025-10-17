// ...existing code...
"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import { CheckCircle, Menu } from "lucide-react";

function ChapterListSidebar({ courseInfo, selectedTopicIndex, setSelectedTopicIndex }) {
  const courseContent = courseInfo?.courses?.courseContent || [];
  const completedChapters = courseInfo?.enrollCourse?.completedChapters || [];
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);

  // responsive breakpoint (px)
  const MOBILE_BREAKPOINT = 768;

  // start open by default; will be adjusted on mount based on screen width
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // auto collapse/expand on resize to make it responsive
  useEffect(() => {
    function handleResize() {
      setIsSidebarOpen(window.innerWidth >= MOBILE_BREAKPOINT);
    }

    // set initial state on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Corner trigger visible when sidebar is collapsed */}
      {!isSidebarOpen && (
        <button
          className="schdn-sidebar-trigger absolute top-4 left-4 z-30 bg-white rounded-md p-2 shadow hover:bg-gray-100"
          aria-label="Open sidebar"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out bg-white rounded-xl shadow-lg flex flex-col ${
          isSidebarOpen ? "w-80 min-w-[320px] p-5" : "w-0 min-w-0 p-0 overflow-hidden"
        }`}
      >
        {isSidebarOpen && (
          <>
            <h2 className="my-3 font-bold text-xl border-b pb-2 flex items-center justify-between">
              <span>Chapters ({courseContent.length})</span>
              <button
                className="schdn-sidebar-trigger ml-2 bg-white rounded-md p-2 shadow hover:bg-gray-100"
                aria-label="Toggle sidebar"
                onClick={() => setIsSidebarOpen((s) => !s)}
              >
                <Menu size={18} />
              </button>
            </h2>
            <div className="mt-4 flex-1 overflow-y-auto no-scrollbar">
              {courseContent.map((chap, index) => (
                <ChapterItem
                  key={index}
                  chapter={chap}
                  index={index}
                  selectedChapterIndex={selectedChapterIndex}
                  setSelectedChapterIndex={setSelectedChapterIndex}
                  selectedTopicIndex={selectedTopicIndex}
                  setSelectedTopicIndex={setSelectedTopicIndex}
                  completedChapters={completedChapters}
                  isSidebarOpen={isSidebarOpen}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            {/* optional title */}
          </div>
          {/* header buttons removed */}
        </div>

        {/* Video area (always visible) */}
        <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center text-white">
          {/* Replace this with your actual video player/embed */}
        </div>
      </div>
    </div>
  );
}

function ChapterItem({
  chapter,
  index,
  selectedChapterIndex,
  setSelectedChapterIndex,
  selectedTopicIndex,
  setSelectedTopicIndex,
  completedChapters,
  isSidebarOpen
}) {
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);
  const isOpen = isSidebarOpen && selectedChapterIndex === index;

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  // Check if all topics in this chapter are completed
  const isChapterCompleted =
    chapter.topics.length > 0 &&
    chapter.topics.every((_, tIndex) =>
      completedChapters.some((c) => c.chapter === index && c.topic === tIndex)
    );

  return (
    <div className="mb-4">
      {/* Chapter button */}
      <button
        className={`w-full text-left text-xl font-bold p-2 rounded transition-colors duration-300 flex items-center gap-2 ${
          isChapterCompleted ? "bg-green-200 text-black" : "bg-gray-100 hover:bg-gray-200"
        }`}
        onClick={() => {
          setSelectedChapterIndex(index);
          setSelectedTopicIndex(0);
        }}
      >
        {isChapterCompleted ? <CheckCircle size={24} className="text-green-500" /> : `${index + 1}.`}{" "}
        {chapter.chapterName}
      </button>

      {/* Topics with smooth height transition */}
      <div
        ref={contentRef}
        style={{
          maxHeight: `${height}px`,
          transition: "max-height 0.3s ease",
          overflow: "hidden"
        }}
      >
        <div className="mt-2 space-y-1">
          {chapter.topics.map((topic, tIndex) => {
            const isCompleted = completedChapters.some(
              (c) => c.chapter === index && c.topic === tIndex
            );
            const isSelected = selectedTopicIndex === tIndex;

            return (
              <button
                key={tIndex}
                onClick={() => setSelectedTopicIndex(tIndex)}
                className={`w-full text-left text-sm font-normal p-2 rounded transition-all duration-300 ${
                  isSelected
                    ? "bg-gray-200 shadow-md"
                    : isCompleted
                    ? "bg-green-200 text-black"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {topic.topic}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChapterListSidebar;
// ...existing code...