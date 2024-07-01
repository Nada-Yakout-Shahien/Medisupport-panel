import React, { useState, useEffect } from "react";
import "./addappointment.css";
import { Helmet } from "react-helmet-async";
import Dashboarddoc from "./dashboard";
import { NavLink } from "react-router-dom";
import Notification from "../../components/notification";
import { useNavigate } from "react-router-dom";
import {
  storeTimeRequest,
  storeDateRequest,
} from "../../components/apiService";
import axios from "axios";

const Addappointment = () => {
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/api/doctor/dates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDates(response.data);
      console.log('Dates:', response.data);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const fetchTimes = async (dateId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://127.0.0.1:8000/api/doctor/dates/${dateId}/times`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimes(response.data);
      console.log('Times:', response.data);
    } catch (error) {
      console.error('Error fetching times:', error);
    }
  };

  const handleDateSelect = (dateId) => {
    setSelectedDateId(dateId);
    fetchTimes(dateId);
  };

  const handleAddAppointment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const existingDate = dates.find(date => date.date === newDate);

      if (existingDate) {
        // Update existing date with new time
        const responseTime = await axios.post(
          'http://127.0.0.1:8000/api/doctor/store-time',
          { time: newTime, date_id: existingDate.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('New time added to existing date:', responseTime.data);
      } else {
        // Add new date and time
        const responseDate = await axios.post(
          'http://127.0.0.1:8000/api/doctor/store-date',
          { date: newDate },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dateId = responseDate.data.id;

        const responseTime = await axios.post(
          'http://127.0.0.1:8000/api/doctor/store-time',
          { time: newTime, date_id: dateId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('New appointment added:', responseTime.data);
      }

      fetchDates();
      setNewDate('');
      setNewTime('');
    } catch (error) {
      console.error('Error adding new appointment:', error);
      if (error.response && error.response.data && error.response.data.date) {
        alert(`Error: ${error.response.data.date.join(', ')}`);
      } else {
        alert('Error adding new appointment.');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Appointment ♥</title>
        <meta name="description" content="Makeappointment" />
      </Helmet>
      <div className="addappoint">
        <Dashboarddoc />
        <div className="adding">
          <div className="title">
            <p>
              <span className="s1">pages</span> <span className="s1">/</span>{" "}
              <span className="s2">Make Appointment</span>
            </p>
            <Notification />
          </div>
          <h1>Make Appointment</h1>
          <div className="appoints">
            <div className="col">
    <div>
      <h3>Select a Date</h3>
      <ul>
        {dates.map((date) => (
          <li key={date.id} onClick={() => handleDateSelect(date.id)}>
            {date.date}
          </li>
        ))}
      </ul>

      {selectedDateId && (
        <div>
          <h3>Times for selected date</h3>
          <ul>
            {times.map((time) => (
              <li key={time.id}>{time.time}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3>Add a New Appointment</h3>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />
        <button onClick={handleAddAppointment}>Add Appointment</button>
      </div>
    </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addappointment;
