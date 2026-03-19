"use client";

import { Mic, MicOff } from "lucide-react";
import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import Image from "next/image";
import Transcript from "@/components/Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearError,
    isActive,
    limitError,
  } = useVapi(book);

  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/*  Header Card  */}
        <div className="vapi-header-card">
          <div className="vapi-cover-wrapper">
            <Image
              src={book.coverURL || "/images/book-placeholder.png"}
              alt={book.title}
              width={120}
              height={180}
              className="vapi-cover-image w-30! h-auto!"
              priority
            />
            <div className="vapi-mic-wrapper">
              <button
                onClick={isActive ? stop : start}
                disabled={status === "connecting"}
                type="button"
                aria-label="Start voice conversation"
                className={`vapi-mic-btn shadow-md w-15! h-15! z-10 ${isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"}`}
              >
                {isActive ? (
                  <Mic className="size-7 text-[`#212a3b`]" />
                ) : (
                  <MicOff className="size-7 text-[`#212a3b`]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#212a3b] mb-1">
                {book.title}
              </h1>
              <p className="text-[#3d485e] font-medium">by {book.author}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="vapi-status-indicator">
                <span>{/*  Status colour  */}</span>
                <span>{/*  Status label */}</span>
              </div>

              <div className="vapi-status-indicator">
                <span className="vapi-status-text">
                  Voice: {book.persona || "Daniel"}
                </span>
              </div>

              <div className="vapi-status-indicator">
                <span className="vapi-status-text">{/*  Todo: Duration*/}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vapi-transcript-wrapper">
          <div className="transcript-container min-h-100">
            <Transcript
              messages={messages}
              currentMessage={currentMessage}
              currentUserMessage={currentUserMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default VapiControls;
