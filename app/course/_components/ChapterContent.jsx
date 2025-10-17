// ...existing code...
import React, { useContext, useState, useEffect } from "react";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import parse from "html-react-parser";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

function ChapterContent({ courseInfo, selectedTopicIndex, refreshCourse }) {
    const courseContent = courseInfo?.courses?.courseContent;
    const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);

    const chapter = courseContent?.[selectedChapterIndex];
    if (!chapter) return <p>No chapter selected.</p>;

    const videoData = chapter.youtubeData;
    const topics = chapter.topics || [];
    const completedChaptersFromAPI = courseInfo?.enrollCourse?.completedChapters || [];

    const [completedChapters, setCompletedChapters] = useState(() => completedChaptersFromAPI);

    // Only update local state when the incoming array actually changes (prevents infinite loop
    // when parent passes a new array reference with identical contents).
    useEffect(() => {
        setCompletedChapters((prev) => {
            const prevStr = JSON.stringify(prev || []);
            const nextStr = JSON.stringify(completedChaptersFromAPI || []);
            return prevStr === nextStr ? prev : (completedChaptersFromAPI || []);
        });
    }, [completedChaptersFromAPI]);

    const isCompleted = completedChapters?.some(
        (c) => c.chapter === selectedChapterIndex && c.topic === selectedTopicIndex
    );

    // Check if entire chapter is completed
    const isChapterCompleted =
        topics.length > 0 &&
        topics.every((_, topicIndex) =>
            completedChapters.some(
                (c) => c.chapter === selectedChapterIndex && c.topic === topicIndex
            )
        );

    const handleToggleComplete = async () => {
        // Capture previous state for rollback
        const prev = completedChapters || [];

        // Optimistic update
        let updated = [...prev];
        if (isCompleted) {
            updated = updated.filter(
                (c) =>
                    !(c.chapter === selectedChapterIndex && c.topic === selectedTopicIndex)
            );
        } else {
            updated.push({ chapter: selectedChapterIndex, topic: selectedTopicIndex });
        }
        setCompletedChapters(updated);

        // Fire API request
        try {
            await axios.put("/api/enroll-course", {
                courseId: courseInfo.courses.cid,
                chapter: selectedChapterIndex,
                topic: selectedTopicIndex
            });
            refreshCourse(); // optional: to sync backend data
        } catch (error) {
            console.error("Error updating completion:", error);
            // Rollback if API fails
            setCompletedChapters(prev);
        }
    };

    const topic = topics[selectedTopicIndex];

    return (
        <div className="p-6 sm:p-8 md:p-10 w-full overflow-y-auto">
            {/* Chapter Title */}
            <h2
                className={`font-bold text-2xl sm:text-3xl md:text-3xl lg:text-4xl mb-4 drop-shadow-md p-3 rounded transition-colors duration-300 ${isChapterCompleted ? " text-blue-600" : "text-blue-600"
                    }`}
            >
                {selectedChapterIndex + 1}. {chapter.chapterName}
            </h2>

            {/* Video Section */}
            {videoData && videoData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 w-full"
                >
                    <h2 className="font-bold text-xl mb-3 text-gray-700">Related Videos 🎬</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {videoData.slice(0, 2).map((video, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="w-full">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.videoId}?rel=0&autoplay=0&controls=1`}
                                        title={video.title || `video-${index}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full aspect-video max-w-full"
                                    ></iframe>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Topic Section */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedTopicIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-3 gap-3">
                        <h3 className="font-bold text-lg sm:text-2xl md:text-2xl text-blue-600">
                            {topic?.topic}
                        </h3>

                        <motion.button
                            onClick={handleToggleComplete}
                            whileTap={{ scale: 0.97 }}
                            animate={{
                                backgroundColor: isCompleted ? "#EF4444" : "#10B981",
                            }}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-white font-semibold rounded-full shadow-md transition-colors duration-300"
                        >
                            {isCompleted ? (
                                <>
                                    <XCircle size={18} /> Mark as Incomplete
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} /> Mark as Complete
                                </>
                            )}
                        </motion.button>
                    </div>

                    <div className="prose prose-lg leading-relaxed text-gray-800 max-w-full break-words">
                        {parse(topic?.content || "<p>No content available.</p>")}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default ChapterContent;
// ...existing code...