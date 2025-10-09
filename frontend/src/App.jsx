import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import gitHubLogo from './assets/github-logo-svgrepo-com.svg'
import gtCalLogo from './assets/GTCal_icon.png'
import './App.css'
import React from "react";


/*function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://github.com/mayazhang1241/gt-cal?tab=readme-ov-file" target="_blank">
          <img src={gitHubLogo} className="logo github" alt="Github logo" />
        </a>
        <p>
          ^__________________________________
        </p>
        <p>
          clicking on it sends you to our GitHub Page.
        </p>
      </div>
      <div> 
        <img alt="Person's image" 
        src = {gtCalLogo}
        style = {{height: "120px",paddingLeft: "110px"}}
        /> 

        <br /> 
      </div>
      <h1>GTCalendar</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count * 2)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more!!!
      </p>
    </>
  )
}

export default App*/

// issue: list view
const events = [
  { id: 1, title: "Hackathon", date: "2025-10-12", location: "Klaus" },
  { id: 2, title: "Gourd Workshop", date: "2025-10-17", location: "Clough" },
  { id: 3, title: "Science Fair", date: "2025-10-28", location: "McCamish Pavilion" }
];

/*const ListView = ({ events }) => {
  // sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="list-view">
      {sortedEvents.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </div>
      ))}
    </div>
  );
};*/
function ListView(props) {
  const events = props.events;

  const eventsCopy = events.slice();

  const sortedEvents = eventsCopy.sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="list-view">
      {sortedEvents.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </div>
      ))}
    </div>
  );
}


function App() {
  return (
    <div>
      <h2>Upcoming Events</h2>
      <ListView events={events} />
    </div>
  );
}

export default App;

