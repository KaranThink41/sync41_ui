import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-white">404</h1>
        <p className="mt-4 text-2xl text-gray-200">
          Oops! We can't seem to find the page you're looking for.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-white text-gray-800 rounded-md transition duration-300 hover:bg-gray-200"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
