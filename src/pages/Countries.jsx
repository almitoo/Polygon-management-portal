import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState([]);

  // Form fields for adding a new country
  const [newCountry, setNewCountry] = useState({
    name: "",
    code: "",
    polygons: "",
  });

  const { user, getToken, logout } = useAuth();
  

  const [editingCountry, setEditingCountry] = useState(null); // Stores the country being edited
  const [editingPolygons, setEditingPolygons] = useState(""); // Temporarily stores the polygons during editing

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/countries", {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        setCountries(response.data);
      } catch (err) {
        setError("Failed to fetch countries.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/stats", {
          headers: {
              Authorization: `Bearer ${getToken()}`,
          },
      });
        setStats(response.data.data);
      } catch (err) {
        console.error("Failed to fetch stats.", err);
      }
    };
   

    fetchCountries();
    fetchStats();
  }, []);



  const handleAddCountry = async (e) => {
    e.preventDefault();

    // Convert the polygons string to a JSON array
    let polygonsArray;
    try {
      polygonsArray = JSON.parse(newCountry.polygons);
      if (!Array.isArray(polygonsArray)) {
        throw new Error("Polygons must be a valid JSON array.");
      }
    } catch (err) {
      setError("Polygons must be a valid JSON array.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/countries", {
        name: newCountry.name,
        code: newCountry.code,
        polygons: polygonsArray,
      }, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
      setCountries((prev) => [...prev, response.data.country]);
      setShowForm(false);
      setNewCountry({ name: "", code: "", polygons: "" });
      setError("");
    } catch (err) {
      console.error("Error adding country:", err);
      setError("Failed to add country.");
    }
  };

  const handleDeleteCountry = async (code) => {
    try {
      await axios.delete(`http://localhost:3000/api/countries/${code}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
      setCountries((prev) => prev.filter((country) => country.code !== code));
    } catch (err) {
      console.error("Error deleting country:", err);
      setError("Failed to delete country.");
    }
  };

  const handleEditPolygons = (country) => {
    setEditingCountry(country.code);
    setEditingPolygons(JSON.stringify(country.polygons, null, 2)); // Format polygons as a string
  };

  const handleUpdatePolygons = async () => {
    let polygonsArray;
    try {
      polygonsArray = JSON.parse(editingPolygons); // Parse the polygons string to JSON
      if (!Array.isArray(polygonsArray)) {
        throw new Error("Polygons must be a valid JSON array.");
      }
    } catch (err) {
      setError("Polygons must be a valid JSON array.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/countries/${editingCountry}`, {
        polygons: polygonsArray,
      }, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

      // Update the country in the state
      setCountries((prev) =>
        prev.map((country) =>
          country.code === editingCountry
            ? { ...country, polygons: polygonsArray }
            : country
        )
      );

      // Clear editing state
      setEditingCountry(null);
      setEditingPolygons("");
      setError("");
    } catch (err) {
      console.error("Error updating polygons:", err);
      setError("Failed to update polygons.");
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error && !showForm) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Countries</h1>

      {/* Button to toggle the Add Country form */}
      <button
      className="btn btn-primary mb-4 me-2"
        onClick={() => {
          setShowForm((prev) => !prev);
          setError("");
        }}
      >
        {showForm ? "Cancel" : "Add New Country"}
      </button>
      <button
        className="btn btn-primary mb-4"
        onClick={() => logout()}
      >
        Logout
      </button>

      {/* Add Country Form */}
      {showForm && (
        <form className="mb-4" onSubmit={handleAddCountry}>
          <div className="form-group">
            <label htmlFor="name">Country Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={newCountry.name}
              onChange={(e) =>
                setNewCountry({ ...newCountry, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="code">Country Code</label>
            <input
              type="text"
              className="form-control"
              id="code"
              value={newCountry.code}
              onChange={(e) =>
                setNewCountry({ ...newCountry, code: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="polygons">Polygons (JSON Format String)</label>
            <textarea
              className="form-control"
              id="polygons"
              rows="3"
              value={newCountry.polygons}
              onChange={(e) =>
                setNewCountry({ ...newCountry, polygons: e.target.value })
              }
              placeholder='Example: [[[-140.0, 60.0], [-120.0, 60.0], [-120.0, 50.0], [-140.0, 50.0], [-140.0, 60.0]]]'
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      )}

      {/* Table to display countries */}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Code</th>
            <th>Polygons</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <tr key={country._id}>
              <td>{index + 1}</td>
              <td>{country.name}</td>
              <td>{country.code}</td>
              <td>
                {editingCountry === country.code ? (
                  <textarea
                    className="form-control"
                    rows="4"
                    value={editingPolygons}
                    onChange={(e) => setEditingPolygons(e.target.value)}
                  />
                ) : (
                  country.polygons.map((polygon, i) => (
                    <div key={i}>
                      Polygon {i + 1}: [
                      {polygon
                        .map((coord) => `(${coord[0]}, ${coord[1]})`)
                        .join(", ")}
                      ]
                    </div>
                  ))
                )}
              </td>
              <td>
                {editingCountry === country.code ? (
                  <>
                    <button
                      className="btn btn-success btn-sm mr-2"
                      onClick={handleUpdatePolygons}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingCountry(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => handleEditPolygons(country)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCountry(country.code)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-center mt-4">API Usage Statistics</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Country Code</th>
            <th>Total Requests</th>
            <th>Inside Count</th>
            <th>Outside Count</th>
          </tr>
        </thead>
        <tbody>
          {stats && stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat._id}</td>
              <td>{stat.totalRequests}</td>
              <td>{stat.trueResponses}</td>
              <td>{stat.falseResponses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Countries;
