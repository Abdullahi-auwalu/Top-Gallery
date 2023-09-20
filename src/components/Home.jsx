import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';

function Home() {
  const [images, setImages] = useState(() => {
    const storedImages = localStorage.getItem('galleryImages');
    return storedImages ? JSON.parse(storedImages) : [];
  });

  const [searchTag, setSearchTag] = useState('');
  const [filteredImages, setFilteredImages] = useState([...images]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(images));
  }, [images]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newImages = acceptedFiles.map((file) => ({
        id: `new-${Date.now()}`,
        url: URL.createObjectURL(file),
        tags: [],
        numberTag: images.length + 1, // Add the number tag
      }));

      setImages([...images, ...newImages]);
      setFilteredImages([...images, ...newImages]);

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
    const updatedImages = images.filter((image) => image.id !== imageId);

    setImages(updatedImages);
    setFilteredImages(updatedImages);
  };

  const handleSearch = () => {
    if (!searchTag) {
      setFilteredImages([...images]);
    } else {
      const filtered = images.filter(
        (image) => image.numberTag.toString() === searchTag
      );
      setFilteredImages(filtered);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by number tag"
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

      <div
        {...getRootProps()}
        className="bg-gray-100 border-dashed border-2 border-gray-300 p-8 rounded-lg mb-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        {loading ? (
          <span className="loading loading-dots loading-sm"></span>
        ) : (
          <p className="text-gray-500 text-center">
            Drag and drop images here, or click to select files
          </p>
        )}
      </div>

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
                      <Card image={image} onDeleteImage={handleDeleteImage} />
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
