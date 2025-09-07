import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Thank you! 🎉</h1>
        <p className="mt-2 text-neutral-700">
          Your payment was successful. We’re getting your order ready.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-block rounded-2xl bg-pink-600 text-white px-4 py-2 font-semibold hover:bg-pink-700"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
