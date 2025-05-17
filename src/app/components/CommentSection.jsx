export default function CommentSection({ mediaId }) {
  return (
    <section className="px-8 py-10 border-t border-gray-700">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      {/* Comment Form */}
      <form className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
        />
        <textarea
          rows="4"
          placeholder="Your Comment"
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
        ></textarea>
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          Submit
        </button>
      </form>

      {/* Static Comments */}
      <div className="space-y-6">
        <div className="bg-gray-900 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Alice</p>
          <p>A breathtaking experience!</p>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <p className="text-sm text-gray-400">John</p>
          <p>Very well made, incredible visuals!</p>
        </div>
      </div>
    </section>
  );
}
