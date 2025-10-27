import React, { useState } from "react";
import "../App.css";


export default function PostMessageForm({ onMessagePosted }) {
  // useState hooks keep track of the local form values and UI state.
  const [name, setName] = useState(""); 
  const [text, setText] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // ideas: initials from a name (e.g., "Caroline Tran" -> "CT").
  // use these initials as the avatar content when a name is provided
  function getInitials(fullName) {
    if (!fullName) return null;
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return null;
    // take first letter of the first and last name
    const first = parts[0][0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  function buildPayload() {
    const initials = getInitials(name);
    // the user didn't provide a name -> anonymous
    return {
      name: name || "Anonymous",
      text: text,
      // avatar could be either initials or a keyword the backend knows how to
      // resolve (e.g. "anon") — choose whichever your backend expects.
      avatar: initials || null,
      
    };
  }

  
  async function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading
    setError(null);

    // Basic validation: don't let empty messages through.
    if (!text.trim()) {
      setError("Please write a message before posting.");
      return;
    }

    const payload = buildPayload();

    try {
      setLoading(true);

      await new Promise((r) => setTimeout(r, 500)); // simulate network delay
      const created = { id: Date.now(), ...payload };
      onMessagePosted?.(created);
      setText("");

      // clear
      setText("");
      // setName(""); // keep name to make posting faster for the same user

      // Let the parent know that a new message exists so it can update the list.
      if (onMessagePosted) onMessagePosted(created);
    } catch (err) {
      console.error("Failed to post message:", err);
      setError(err.message || "An error occurred while posting.");
    } finally {
      setLoading(false);
    }
  }

  // render the avatar area -> does not work (pls help :>)
  function AvatarPreview() {
    const initials = getInitials(name);
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-sm font-semibold"
          aria-hidden
        >
          {initials || "Anon"}
        </div>
        <div className="text-xs text-gray-500">{name || "Anonymous"}</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl p-4 bg-white rounded-lg shadow-md">
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        <div className="mt-2">
          <AvatarPreview />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your message..."
          rows={4}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Message"}
        </button>

      </div>
    </form>
  );
}
