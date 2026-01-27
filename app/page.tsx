import Header from "@/components/Header";
import MeetingCard from "@/components/MeetingCard";
import { db } from "@/db";
import { meeting } from "@/db/schema";

export default async function Home() {
  const meetings = await db.select().from(meeting).limit(1);
  const nextMeeting = meetings[0] || null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent tracking-tight">
            Welcome to Applied AI
          </h1>

        <p className="max-w-3xl text-xl text-gray-300 leading-relaxed">
          University of Iowa&apos;s student organization for applied
          artificial intelligence and machine learning
        </p>
  </div>

          {/* Meeting Card */}
          <div className="mb-12">
            <MeetingCard meeting={nextMeeting} />
          </div>

          {/* Feature Cards */}
          <div className="
