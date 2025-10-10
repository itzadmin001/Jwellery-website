// LoadingButton.jsx
import React from 'react'

function LoadingButton({ loading, Setloading, name }) {
  return (
    <button
      // Prefer passing loading from parent. Do NOT use disabled=""
      disabled={loading}
      type="submit"
      className={`text-white mt-2 bg-blue-700 cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 inline-flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
    >
      {loading && (
        <svg
          aria-hidden="true"
          role="status"
          className="inline mr-3 w-4 h-4 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M100 50.59C100 78.205 77.614 100.591 50 100.591 22.386 100.591 0 78.205 0 50.59 0 22.977 22.386 .5908 50 .5908 77.614 .5908 100 22.977 100 50.59ZM9.081 50.59C9.081 73.189 27.401 91.509 50 91.509 72.599 91.509 90.919 73.189 90.919 50.59 90.919 27.992 72.599 9.6723 50 9.6723 27.401 9.6723 9.081 27.992 9.081 50.59Z" fill="#E5E7EB" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539 95.2932 28.8227 92.871 24.3692 89.8167 20.348 85.8452 15.1192 80.8826 10.7238 75.2124 7.4129 69.5422 4.1019 63.2754 1.9403 56.7698 1.0512 51.7666 .36754 46.6976 .44684 41.7345 1.2787 39.2613 1.6933 37.813 4.1978 38.4501 6.6233 39.0873 9.0487 41.5694 10.4717 44.0505 10.1071 47.8511 9.5486 51.7191 9.5269 55.5402 10.0491 60.8642 10.7766 65.9928 12.5457 70.6331 15.2552 75.2735 17.9648 79.3347 21.5619 82.5849 25.841 84.9175 28.9121 86.7997 32.2913 88.1811 35.8758 89.083 38.2158 91.5421 39.6781 93.9676 39.0409" fill="currentColor" />
        </svg>
      )}
      {loading ? 'Loading...' : name}
    </button>
  )
}

export default LoadingButton
