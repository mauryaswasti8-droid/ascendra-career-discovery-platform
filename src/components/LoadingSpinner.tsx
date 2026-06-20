"use client";
import React from "react";
import Nova from "./Nova";

export default function LoadingSpinner({ message = "Loading magical things..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Nova size="sm" />
      <div className="flex items-center gap-2 text-purple-600">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
      </div>
      <p className="text-purple-600 text-sm">{message}</p>
    </div>
  );
}
