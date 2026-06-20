"use client";

import { useState } from "react";

export default function BuildMyStory() {
  const [activities, setActivities] = useState("");
  const [projects, setProjects] = useState("");
  const [interests, setInterests] = useState("");
  const [major, setMajor] = useState("");
  const [result, setResult] = useState<any>(null);

  const generateStory = () => {
    const combined = `${activities} ${projects} ${interests} ${major}`.toLowerCase();

    let archetype = "Cross-Disciplinary Changemaker";
    let strengths = [
      "Adaptability",
      "Curiosity",
      "Initiative",
    ];
    let nextStep =
      "Pursue a project that combines your interests and creates measurable impact.";
    let pitch =
      "I enjoy connecting ideas across different fields and turning them into meaningful action.";

    if (
      combined.includes("biology") ||
      combined.includes("neuroscience") ||
      combined.includes("medicine") ||
      combined.includes("health")
    ) {
      archetype = "Global Health Advocate";
      strengths = [
        "Scientific Curiosity",
        "Empathy",
        "Problem Solving",
      ];
      nextStep =
        "Explore research, healthcare volunteering, or public health initiatives.";
      pitch =
        "I am passionate about using science and innovation to improve health outcomes and create meaningful impact.";
    }

    if (
      combined.includes("mun") ||
      combined.includes("debate") ||
      combined.includes("policy")
    ) {
      archetype = "Policy & Impact Strategist";
      strengths = [
        "Leadership",
        "Communication",
        "Critical Thinking",
      ];
      nextStep =
        "Engage in advocacy projects, policy competitions, or social impact initiatives.";
      pitch =
        "I enjoy solving complex challenges through leadership, communication, and strategic thinking.";
    }

    if (
      combined.includes("research") ||
      combined.includes("science fair") ||
      combined.includes("innovation")
    ) {
      archetype = "Future Systems Thinker";
      strengths = [
        "Research Mindset",
        "Innovation",
        "Analytical Thinking",
      ];
      nextStep =
        "Publish research, enter innovation challenges, or collaborate on advanced projects.";
      pitch =
        "I enjoy exploring complex questions and creating innovative solutions with long-term impact.";
    }

    if (
      combined.includes("environment") ||
      combined.includes("climate") ||
      combined.includes("sustainability")
    ) {
      archetype = "Sustainability Builder";
      strengths = [
        "Systems Thinking",
        "Responsibility",
        "Innovation",
      ];
      nextStep =
        "Work on environmental projects, sustainability campaigns, or green technology initiatives.";
      pitch =
        "I want to contribute to a more sustainable future through innovation and action.";
    }

    if (
      combined.includes("writing") ||
      combined.includes("journalism") ||
      combined.includes("content")
    ) {
      archetype = "Science Communicator";
      strengths = [
        "Storytelling",
        "Research",
        "Communication",
      ];
      nextStep =
        "Create educational content, publish articles, or build public awareness projects.";
      pitch =
        "I enjoy translating complex ideas into stories that inform, inspire, and educate others.";
    }

    setResult({
      archetype,
      strengths,
      nextStep,
      pitch,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">
        Find Your Narrative
      </h1>

      <p className="text-gray-600 mb-10">
        Discover the unique story hidden within your experiences, interests, and ambitions.
      </p>

      <div className="grid gap-6">
        <div>
          <label className="font-semibold">
            Activities
          </label>
          <textarea
            className="w-full border rounded-xl p-3 mt-2"
            rows={3}
            placeholder="MUN, Debate, Basketball..."
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">
            Projects
          </label>
          <textarea
            className="w-full border rounded-xl p-3 mt-2"
            rows={3}
            placeholder="Research, NGO work, campaigns..."
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">
            Interests
          </label>
          <textarea
            className="w-full border rounded-xl p-3 mt-2"
            rows={3}
            placeholder="Biology, AI, Psychology..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">
            Intended Major
          </label>
          <input
            className="w-full border rounded-xl p-3 mt-2"
            placeholder="Biomedical Sciences"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          />
        </div>

        <button
          onClick={generateStory}
          className="bg-black text-white rounded-xl px-6 py-3 font-semibold"
        >
          ✨ Build My Story
        </button>
      </div>

      {result && (
        <div className="mt-10 border rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Your Narrative Archetype
          </h2>

          <div className="mb-4">
            <span className="font-semibold">Theme:</span>{" "}
            {result.archetype}
          </div>

          <div className="mb-4">
            <span className="font-semibold">Strengths:</span>
            <ul className="list-disc ml-6 mt-2">
              {result.strengths.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <span className="font-semibold">Suggested Next Step:</span>
            <p>{result.nextStep}</p>
          </div>

          <div>
            <span className="font-semibold">Elevator Pitch:</span>
            <p className="italic mt-2">
              "{result.pitch}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}