"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";


export default function Home() {
  const [rooms, setRooms] = useState<{ id: string, name: string; capacity: number }[]>([]);
  useEffect(() => {
    async function getRooms() {
      const new_rooms = await fetch('/api/rooms');
      const new_rooms_json = await new_rooms.json();
      console.log(new_rooms_json);
      setRooms(new_rooms_json.rooms);
    
    }
    getRooms();
  }, []
  );

  const [booked, setBooked] = useState<string[]>([]);

  async function handleBook(room: { id: string; name: string; capacity: number }) {
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: room.id }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err?.error ?? "booking_failed");
      }
    } catch (e: any) {
      console.error("Booking error:", e);
      alert("Failed to book room: " + (e?.message ?? "unknown error"));
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* Added rooms table */}
        <section className="w-full mt-8">
          <h2 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
            Available Rooms
          </h2>
          <div className="overflow-hidden rounded-md border border-gray-200 dark:border-zinc-700">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    Room Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    Capacity
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-transparent dark:even:bg-zinc-950">
                    <td className="border-t px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200">
                      {room.name}
                    </td>
                    <td className="border-t px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200">
                      {room.capacity}
                    </td>
                    <td className="border-t px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
                      <button
                        onClick={() => handleBook(room)}
                        className="inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-medium bg-foreground text-background disabled:opacity-50"
                      >
                        {booked.includes(room.name) ? "Booked" : "Book"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
