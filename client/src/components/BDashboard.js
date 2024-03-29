
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BDashboard({ setUserRole }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch("https://bus-tracker.onrender.com/check_user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserRole(data["User_Role"]);
        });
    } else {
      navigate("/");
    }
  }, [token, setUserRole, navigate]);

  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [noOfSeats, setNoOfSeats] = useState("");
  const [driver, setDriver] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [busToUpdate, setBusToUpdate] = useState(null);

  useEffect(() => {
    if (token) {
      fetch("https://bus-tracker.onrender.com/buses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 401) {
            navigate("/");
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          setBuses(data);
        })
        .catch((error) => {
          setErrors(
            error.message || "An error occurred. Please try again later."
          );
        });
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  const handleUpdateClick = (bus) => {
    setBusToUpdate(bus);
    setFrom(bus.From);
    setTo(bus.To);
    setDepartureTime(bus.Departure_Time);
    setDriver(bus.driver);
    setNoOfSeats(bus.no_of_seats);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (busToUpdate) {
      try {
        const response = await fetch(
          `https://bus-tracker.onrender.com/buses/${busToUpdate.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              from: from,
              to: to,
              departure_time: departureTime,
              driver: driver,
              capacity: parseInt(noOfSeats),
            }),
          }
        );

        if (response.ok) {
          const updatedBus = await response.json();
          console.log("Updated Bus:", updatedBus);
          alert("Bus Successfully updated!");
          window.location.reload();
        } else if (response.status === 404) {
          setErrors("Route Not Found");
        } else {
          console.error("Failed to Update Route");
        }
      } catch (error) {
        setErrors(
          error.message || "An error occurred. Please try again later."
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://bus-tracker.onrender.com/buses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          number_plate: numberPlate,
          From: from,
          To: to,
          no_of_seats: parseInt(noOfSeats),
          driver: driver,
          departure_time: departureTime,
        }),
      });

      if (response.ok) {
        const newBus = await response.json();
        console.log("New Bus:", newBus);
        alert("Bus Successfully added!");
        window.location.reload();
      } else if (response.status === 404) {
        setErrors("Failed.Route does not exist!");
        setTimeout(() => {
          setErrors("");
        }, 2000);
      } else {
        console.error("Failed To Add Bus");
      }
    } catch (error) {
      setErrors(error.message || "An error occurred. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://bus-tracker.onrender.com/buses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Bus Successfully deleted...");
        setBuses(buses.filter((bus) => bus.id !== id));
      } else {
        console.error("Failed to delete bus");
      }
    } catch (error) {
      setErrors(error.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container mt-4 text-center">
      <h1 className="text-center mb-4">Buses</h1>

      <button
        onClick={() => setShowForm(true)}
        className="btn btn-outline-dark mb-3 "
      >
        Add A Bus
      </button>

      {showForm && (
        <div>
          <h2 className="mb-3">Add New Bus</h2>
          {errors && <div className="alert alert-danger">{errors}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="numberPlate" className="form-label">
                Number Plate
              </label>
              <input
                type="text"
                className="form-control"
                id="numberPlate"
                value={numberPlate}
                onChange={(e) => setNumberPlate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="from" className="form-label">
                From
              </label>
              <input
                type="text"
                className="form-control"
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="to" className="form-label">
                To
              </label>
              <input
                type="text"
                className="form-control"
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="noOfSeats" className="form-label">
                Number of Seats
              </label>
              <input
                type="number"
                className="form-control"
                id="noOfSeats"
                value={noOfSeats}
                onChange={(e) => setNoOfSeats(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="driver" className="form-label">
                Driver
              </label>
              <input
                type="text"
                className="form-control"
                id="driver"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="departureTime" className="form-label">
                Departure Time
              </label>
              <input
                type="text"
                className="form-control"
                id="departureTime"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark">
              Add Bus
            </button>
          </form>
        </div>
      )}

      {busToUpdate && (
        <div>
          <h2>Update Bus</h2>
          <form onSubmit={handleUpdateSubmit}>
            <div className="mb-3">
              <label htmlFor="from" className="form-label">
                From
              </label>
              <input
                type="text"
                className="form-control"
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="to" className="form-label">
                To
              </label>
              <input
                type="text"
                className="form-control"
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="departureTime" className="form-label">
                Departure Time
              </label>
              <input
                type="text"
                className="form-control"
                id="departureTime"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="driver" className="form-label">
                Driver
              </label>
              <input
                type="text"
                className="form-control"
                id="driver"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="noOfSeats" className="form-label">
                Number of Seats
              </label>
              <input
                type="number"
                className="form-control"
                id="noOfSeats"
                value={noOfSeats}
                onChange={(e) => setNoOfSeats(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark">
              Update Bus
            </button>
          </form>
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 mt-4 mb-4">
        {buses.map((bus) => (
          <div className="col mt-4" key={bus.id}>
            <div className="card">
              <div className="card-body">
                <p className="card-text mt-2">
                  <strong>From:</strong> {bus.From}
                </p>
                <p className="card-text">
                  <strong>To:</strong> {bus.To}
                </p>
                <p className="card-text">
                  <strong>Number Plate:</strong> {bus.Number_Plate}
                </p>
                <p className="card-text">
                  <strong>Capacity:</strong> {bus.no_of_seats}
                </p>
                <p className="card-text">
                  <strong>Booked Seats:</strong> {bus.seats_booked}
                </p>
                <p className="card-text">
                  <strong>Departure Time:</strong> {bus.Departure_Time}
                </p>
                <p className="card-text">
                  <strong>Driver:</strong> {bus.driver}
                </p>
                <button
                  onClick={() => handleUpdateClick(bus)}
                  className="btn btn-dark btn-sm m-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(bus.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BDashboard;
