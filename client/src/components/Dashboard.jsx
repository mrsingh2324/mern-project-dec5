import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [portfolio, setPortfolio] = useState(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const [bioInput, setBioInput] = useState("")
  const [jobTitleInput, setJobTitleInput] = useState("")

  const navigate = useNavigate();
  const token = localStorage.getItem("token")

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/")
  }

  useEffect(() => {
    if (user?.portfolio) {
      fetchPortfolio()
    }
  }, [user])

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5004/getPortfolio/${user?.portfolio}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setPortfolio(response.data)
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }

  const handleCreatePortfolio = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5004/createPortfolio",
        {
          bio: bioInput,
          jobTitle: jobTitleInput
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const updatedUser = { ...user, portfolio: response.data._id }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setPortfolio(response.data)
      setShowCreateModal(false)
      setBioInput("")
      setJobTitleInput("")
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }

  const handleUpdatePortfolio = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5004/updatePortfolio/${user?.portfolio}`,
        {
          bio: bioInput,
          jobTitle: jobTitleInput
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setPortfolio(response.data)
      setShowEditModal(false)
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }

  const deletePortfolio = async () => {
    try {
      await axios.delete(
        `http://localhost:5004/deletePortfolio/${user?.portfolio}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const updatedUser = { ...user, portfolio: null }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setPortfolio(null)
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }

  const openCreateModal = () => {
    setBioInput("")
    setJobTitleInput("")
    setShowCreateModal(true)
  }

  const openEditModal = () => {
    setBioInput(portfolio?.bio || "")
    setJobTitleInput(portfolio?.jobTitle || "")
    setShowEditModal(true)
  }

  return (
    <div className="flex flex-col items-center gap-3 justify-center h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-lg">{user?.name}</p>
      <p className="text-lg">{user?.email}</p>

      {
        portfolio ? (
          <div className="text-center border rounded-lg px-4 py-3 bg-gray-100">
            <h2 className="font-semibold">{portfolio.bio}</h2>
            <h2 className="text-gray-600">{portfolio.jobTitle}</h2>
          </div>
        ) : (
          <h2 className="text-red-500">No portfolio found</h2>
        )
      }

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={fetchPortfolio}
          className="bg-blue-500 px-6 py-3 rounded-lg text-white"
        >
          Fetch Portfolio
        </button>
        <button
          onClick={openCreateModal}
          disabled={!!user?.portfolio}
          className="bg-green-500 px-6 py-3 rounded-lg text-white disabled:bg-gray-400"
        >
          Create Portfolio
        </button>
        <button
          onClick={openEditModal}
          disabled={!portfolio}
          className="bg-yellow-500 px-6 py-3 rounded-lg text-white disabled:bg-gray-400"
        >
          Update Portfolio
        </button>
        <button
          onClick={deletePortfolio}
          disabled={!user?.portfolio}
          className="bg-red-500 px-6 py-3 rounded-lg text-white disabled:bg-gray-400"
        >
          Delete Portfolio
        </button>
        <button
          onClick={logout}
          className="bg-gray-700 px-6 py-3 rounded-lg text-white"
        >
          Logout
        </button>
      </div>

      {/* Create Portfolio Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-[320px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Portfolio</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Bio"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePortfolio}
                  className="px-4 py-2 rounded bg-green-500 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Portfolio Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-[320px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Portfolio</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Bio"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePortfolio}
                  className="px-4 py-2 rounded bg-yellow-500 text-white"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard
