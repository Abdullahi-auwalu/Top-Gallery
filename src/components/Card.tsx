function Card({ image, onDeleteImage }) {
  // Destructure the 'niceTag' property from the 'image' object
  const { niceTag } = image;

  // Create a function to handle 'niceTag' changes
  const handleNiceTagChange = (e) => {
    onDeleteImage(image.id, e.target.value);
  };

  // Ensure that image.tags is defined before mapping over it
  const tags = image.tags || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={image.url}
        alt={`Image ${image.id}`}
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-sm mr-2"
          >
            {tag}
          </span>
        ))}
      </div>

      <input
        type="text"
        value={niceTag}
        onChange={handleNiceTagChange}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={() => onDeleteImage(image.id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
      >
        Delete
      </button>
      <p className="text-sm text-gray-500 text-center mt-2">
        Added at: {image.numberTag}
      </p>
    </div>
  );
}

export default Card;
