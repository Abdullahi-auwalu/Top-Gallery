import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Home() {
  const [images, setImages] = useState(() => {
    // Load images from local storage on component initialization
    const storedImages = localStorage.getItem('galleryImages');
    return storedImages ? JSON.parse(storedImages) : [];
  });

  const [searchTag, setSearchTag] = useState('');
  const [filteredImages, setFilteredImages] = useState([...images]);
  const [loading, setLoading] = useState(false);

  // Save images to local storage whenever images change
  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(images));
  }, [images]);

  const handleSearch = () => {
    if (!searchTag) {
      setFilteredImages([...images]);
    } else {
      const filtered = images.filter((image) =>
        image.tags.includes(searchTag.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Set loading to true while uploading
      setLoading(true);

      // Simulate an upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Process and add the uploaded images to the state
      const newImages = acceptedFiles.map((file) => ({
        id: `new-${Date.now()}`,
        url: URL.createObjectURL(file),
        tags: [],
        niceTag: '', // Added "Nice Tag" property
      }));

      setImages([...images, ...newImages]);
      setFilteredImages([...images, ...newImages]);

      // Reset loading state
      setLoading(false);
    },
    [images]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedImages = [...filteredImages];
    const [reorderedImage] = updatedImages.splice(result.source.index, 1);
    updatedImages.splice(result.destination.index, 0, reorderedImage);

    setFilteredImages(updatedImages);
  };

  const handleDeleteImage = (imageId) => {
    // Filter out the image to be deleted
    const updatedImages = images.filter((image) => image.id !== imageId);

    setImages(updatedImages);
    setFilteredImages(updatedImages);
  };

  const handleNiceTagChange = (imageId, niceTag) => {
    // Update the "Nice Tag" of the selected image
    const updatedImages = images.map((image) =>
      image.id === imageId ? { ...image, niceTag } : image
    );

    setImages(updatedImages);
    setFilteredImages(updatedImages);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by tag"
          className="w-full sm:w-64 p-2 border rounded"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="bg-gray-100 border-dashed border-2 border-gray-300 p-8 rounded-lg mb-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        {loading ? (
          <p className="text-gray-500 text-center">Uploading...</p>
        ) : (
          <p className="text-gray-500 text-center">
            Drag and drop images here, or click to select files
          </p>
        )}
      </div>

      {/* Drag and drop gallery */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredImages.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                          src={image.url}
                          alt={`Image ${image.id}`}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3">
                          {image.tags.map((tag) => (
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
                          placeholder="Nice Tag"
                          className="w-full p-2 border rounded"
                          value={image.niceTag}
                          onChange={(e) =>
                            handleNiceTagChange(image.id, e.target.value)
                          }
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                        >
                                                    Delete
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Home;

