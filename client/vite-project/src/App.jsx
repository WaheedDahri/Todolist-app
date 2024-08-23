

import { useState, useEffect } from 'react';
import { AiOutlineCloseSquare } from "react-icons/ai";
import axios from "axios";
import './App.css';

axios.defaults.baseURL = "http://localhost:8088/";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [datalist, setDatalist] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/");
        setDatalist(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const response = await axios.put(`/update/${editId}`, formData);
        if (response.data.success) {
          setDatalist((prev) =>
            prev.map((item) =>
              item._id === editId ? { ...item, ...formData } : item
            )
          );
          alert(response.data.message);
          setEditMode(false);
          setEditId(null);
        }
      } else {
        const data = await axios.post("/create", formData);
        if (data.data.success) {
          setDatalist((prev) => [...prev, { ...formData, _id: data.data._id }]);
          alert(data.data.message);
        }
      }

      setAddSection(false);
      setFormData({
        name: "",
        email: "",
        mobile: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = datalist.find((item) => item._id === id);
    setFormData({
      name: itemToEdit.name,
      email: itemToEdit.email,
      mobile: itemToEdit.mobile,
    });
    setEditId(id);
    setEditMode(true);
    setAddSection(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/delete/${id}`);
      if (response.data.success) {
        setDatalist((prev) => prev.filter((el) => el._id !== id));
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("There was an error deleting the item. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>
          {editMode ? "Edit" : "Add"}
        </button>
        {addSection && (
          <div className="addcontainer">
            <form onSubmit={handleSubmit}>
              <div className="close-btn" onClick={() => setAddSection(false)}>
                <AiOutlineCloseSquare />
              </div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleOnChange}
                required
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                required
              />

              <label htmlFor="mobile">Mobile:</label>
              <input
                type="number"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleOnChange}
                required
              />

              <button type="submit">{editMode ? "Update" : "Submit"}</button>
            </form>
          </div>
        )}

        <div className="tablecontainer">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datalist.length > 0 ? (
                datalist.map((el) => (
                  <tr key={el._id}>
                    <td>{el.name}</td>
                    <td>{el.email}</td>
                    <td>{el.mobile}</td>
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(el._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(el._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
