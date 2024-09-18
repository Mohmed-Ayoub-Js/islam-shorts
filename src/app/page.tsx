"use client";

import { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [videos, setVideos] = useState<any>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);

  // قم بجلب الفيديوهات من الـ API
  const fetchMoreVideos = async () => {
    try {
      const response = await axios.get("/api/vedios", {
        params: {
          limit: 5, // إذا كان الـ API يدعم تحديد عدد الفيديوهات في الطلب
        },
      });

      if (response.data.length > 0) {
        setVideos((prevVideos: any) => [...prevVideos, ...response.data]);
      } else {
        setHasMore(false); // لا يوجد المزيد من الفيديوهات
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setHasMore(false); // توقف الجلب عند حدوث خطأ
    }
  };

  useEffect(() => {
    fetchMoreVideos();
  }, []);

  const handleEnded = () => {
    setPlayingIndex(playingIndex); // إعادة تشغيل الفيديو عند الانتهاء
  };

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const nextIndex = Math.floor(scrollY / window.innerHeight);

    if (nextIndex !== playingIndex && nextIndex < videos.length) {
      setPlayingIndex(nextIndex); // تشغيل الفيديو التالي
    }
  }, [playingIndex, videos]);

  useEffect(() => {
    const handleScrollDebounced = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      setScrollTimeout(window.setTimeout(handleScroll, 100)); // 100ms delay
    };

    window.addEventListener("scroll", handleScrollDebounced);
    return () => {
      window.removeEventListener("scroll", handleScrollDebounced);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [handleScroll, scrollTimeout]);

  const saveFavorite = (video: any) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFavorite = favorites.some((fav: any) => fav.url === video.url);

    if (!isFavorite) {
      favorites.push(video);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${video.title} تم إضافته إلى المفضلات!`);
    } else {
      alert(`${video.title} موجود بالفعل في المفضلات.`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 pb-20">
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreVideos}
        hasMore={hasMore}
        loader={<h4>جاري التحميل...</h4>}
        endMessage={<p>تم عرض جميع الفيديوهات</p>}
        className="grid grid-cols-1 gap-8"
      >
        {videos.map((video: any, index: any) => (
          <div key={index} className="w-full max-w-xl h-screen">
            <ReactPlayer
              url={video.url}
              playing={playingIndex === index}
              controls={false}
              width="100%"
              height={"100%"}
              onEnded={handleEnded}
              loop={true}
              className="react-player"
            />
            <Button onClick={() => saveFavorite(video)}>
              <Star className="mr-2" /> أضف إلى المفضلات
            </Button>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
