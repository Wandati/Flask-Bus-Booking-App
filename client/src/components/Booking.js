import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [updateForms, setUpdateForms] = useState({});
  const [newSeatNumber, setNewSeatNumber] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleDelete = (id) => {
    const res = prompt("Are You Sure You Want To cancel your booking?");
    if (res.toLowerCase() === "yes") {
      fetch(`http://127.0.0.1:5500/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            alert("Booking Has Been deleted Successfully...");
            window.location.reload();
          } else {
            throw new Error("Failed to delete booking");
          }
        })
        .catch((err) => {
          setError(err);
          console.log(error);
        });
    } else {
      alert("Your booking is safe");
    }
  };
  // const handleUpdate = (id) => {
  //   fetch(`http://127.0.0.1:5500/bookings/${id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ seat_number: updatedSeatNumber }),
  //   })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         alert("Seat Number Updated Successfully...");
  //         // Reload the page to display the updated bookings after the seat number update
  //         window.location.reload();
  //       } else {
  //         throw new Error("Failed to update seat number");
  //       }
  //     })
  //     .catch((err) => {
  //       setError(err);
  //       console.error(error);
  //     });
  // };
  const toggleUpdateForm = (bookingId) => {
    setUpdateForms((prevForms) => ({
      ...prevForms,
      [bookingId]: !prevForms[bookingId],
    }));
  };
  const handleFormSubmit = (event, bookingId) => {
    event.preventDefault();

    // Make an API request to update the seat number for the booking with bookingId
    fetch(`http://127.0.0.1:5500/bookings/${bookingId}`, {
      method: "PUT", // Assuming you have a PUT endpoint for updating bookings
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        seat_number: newSeatNumber, // Pass the new seat number to update
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          alert("Booking has been updated successfully!");
          // Reload the page to display the updated bookings after the update
          window.location.reload();
        } else if (res.status === 403) {
          alert("Seat Has Already Been Booked.");
        }
      })
      .catch((err) => {
        setError(err);
        console.error(error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://127.0.0.1:5500/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.statusText);
          }
        })
        .then((data) => {
          setBookings(data.bookings);
          console.log(data);
        })
        .catch((error) => {
          setError(error.message);
          console.log(error);
        });
    } else {
      // If user is not logged in, redirect to home page
      navigate("/");
      // alert("You Must Be Logged in to View This Page");
    }
  }, [navigate]);

  if (bookings.length === 0) {
    return (
      <>
        <h1 className="text-center">No bookings Found...</h1>
        <p className="text-center">
          Make A Booking{" "}
          <Link className="text-decoration-none text-dark" to="/routes">
            <strong>Here</strong>
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h2 className="text-center mt-4">Your Bookings</h2>
      <div className="row mt-2 mb-4">
        {bookings.map((book) => (
          <div className="col-4 mt-4" key={book.booking_id}>
            <div className="card">
              <div className="card-body">
                <p className="card-text mt-2">
                  <strong>From:</strong>
                  {book.start_point}.
                </p>
                <p className="card-text">
                  <strong>To:</strong>
                  {book.end_point}.
                </p>
                <p className="card-text">
                  <strong>Price:</strong>
                  {book.price}.
                </p>
                <p className="card-text">
                  <strong>Seat_No:</strong>
                  {book.seat_number}.
                </p>
                <p className="card-text">
                  <strong>Confirmed:</strong>
                  {book.is_confirmed ? "Yes" : "No"}.
                </p>
                {updateForms[book.booking_id] ? (
                  <div>
                    <form
                      onSubmit={(e) => handleFormSubmit(e, book.booking_id)}
                    >
                      <input
                        type="text"
                        placeholder="New Seat Number(1-70)"
                        value={newSeatNumber}
                        onChange={(e) => setNewSeatNumber(e.target.value)}
                      />
                      <button type="submit" className="btn btn-dark btn-sm m-3">
                        Submit
                      </button>
                    </form>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleUpdateForm(book.booking_id)}
                    className="btn btn-dark btn-sm m-2"
                  >
                    Update
                  </button>
                )}
                {/* <button className="btn btn-dark btn-sm m-2">Update</button> */}
                <button
                  onClick={() => handleDelete(book.booking_id)}
                  className="btn btn-danger btn-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Booking;