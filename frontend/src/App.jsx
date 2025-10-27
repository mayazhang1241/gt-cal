import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import PostMessageForm from "./components/PostMessageForm";


// sample events (static for now)
const events = [
  { id: 1, title: "Hackathon", date: "2025-10-12", location: "Klaus" },
  { id: 2, title: "Gourd Workshop", date: "2025-10-17", location: "Clough" },
  { id: 3, title: "Science Fair", date: "2025-10-28", location: "McCamish Pavilion" }
];

function ListView({ events }) {
  const eventsCopy = events.slice();
  const sortedEvents = eventsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="list-view">
      {sortedEvents.map((event) => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        </div>
      ))}
    </div>
  );
}



function App() {
  function handleNewMessage(message) {
    console.log("New message posted:", message);
  }

  return (
    <div className="App">
      <h2>Upcoming Events</h2>
      <ListView events={events} />
      <h1 className="text-xl font-bold mb-4">Discussion Board</h1>
      <PostMessageForm onMessagePosted={handleNewMessage} />
    </div>
  );
}

export default App;
