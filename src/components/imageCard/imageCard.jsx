import React, { useState, useEffect } from "react";
import "./imageCard.css";

const ImageCard = () => {
    const [input, setInput] = useState("");
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    const limit = 10;

    // Fetch Images
    const handleFetch = async () => {
        try {
            const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
            const data = await res.json();
            setImages(data);
            setFilteredImages(data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    // Handle live search with debouncing
    const handleAutoSearch = (value) => {
        const trimmedValue = value.trim().toLowerCase();
        if (!trimmedValue) {
            setFilteredImages(images);
        } else {
            const result = images.filter((photo) =>
                photo.author.toLowerCase().includes(trimmedValue)
            );
            setFilteredImages(result);
        }
    };

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedSearch = debounce(handleAutoSearch, 400);

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        debouncedSearch(value);
    };

    // Reset search
    const resetSearch = () => {
        setInput("");
        setFilteredImages(images);
    };

    // Fetch images on page change
    useEffect(() => {
        handleFetch();
    }, [page]);

    return (
        <div className="container">
            <h1 className="title">Image Gallery</h1>
            <div className="search-bar">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search by author"
                    aria-label="Search by author"
                />
                <button onClick={resetSearch}>Reset Search</button>
            </div>
            <div className="image-grid">
                {filteredImages.length > 0 ? (
                    filteredImages.map((photo) => (
                        <div
                            className="card"
                            key={photo.id}
                            onClick={() => setSelectedImage(photo)}
                        >
                            <img src={photo.download_url} alt={photo.author} />
                            <h4>{photo.author}</h4>
                        </div>
                    ))
                ) : (
                    <p className="no-images">No images found.</p>
                )}
            </div>
            <div className="pagination">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>

            {selectedImage && (
                <div className="modal">
                    <div className="modal-content">
                        <button
                            className="close-modal"
                            onClick={() => setSelectedImage(null)}
                        >
                            ×
                        </button>
                        <img
                            src={selectedImage.download_url}
                            alt={selectedImage.author}
                        />
                        <h3>Author: {selectedImage.author}</h3>
                        <p>ID: {selectedImage.id}</p>
                        <p>Width: {selectedImage.width}</p>
                        <p>Height: {selectedImage.height}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCard;
