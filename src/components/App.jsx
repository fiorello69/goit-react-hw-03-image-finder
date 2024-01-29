// App.jsx

import React, { Component } from 'react';
import Searchbar from './Searchbar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import styles from './App.module.css';
import { fetchImages } from './Api/Api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      query: '',
      page: 1,
      loading: false,
      showButton: false,
      largeImageURL: '',
      showModal: false,
      hasMoreImages: true,
    };
  }

  handleSearch = newQuery => {
    this.setState({
      query: newQuery,
      page: 1,
      images: [],
    });
  };

  handleLoadMore = () => {
    const { hasMoreImages, query } = this.state;

    if (!hasMoreImages) {
      return;
    }

    this.setState(
      prevState => ({
        page: prevState.page + 1,
      }),
      () => {
        if (query) {
          this.fetchImages();
        }
      }
    );
  };

  handleImageClick = url => {
    this.setState({
      largeImageURL: url,
      showModal: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      largeImageURL: '',
      showModal: false,
    });
  };

  componentDidMount() {
    this.fetchImages();
  }

  componentDidUpdate(_, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      this.fetchImages();
    }
  }

  fetchImages = async () => {
    const { query, page } = this.state;

    try {
      this.setState({
        loading: true,
      });

      const newImages = await fetchImages(query, page);
      this.setState(prevState => ({
        images: [
          ...prevState.images,
          ...newImages.map(image => ({
            ...image,
            alt: image.tags || 'No description available',
          })),
        ],
        hasMoreImages: newImages.length === 12,
      }));
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const { images, loading, hasMoreImages, largeImageURL, showModal } =
      this.state;

    return (
      <div className={styles.App}>
        <Searchbar onSubmit={this.handleSearch} />
        <ImageGallery images={images} onImageClick={this.handleImageClick} />
        {loading && <Loader />}
        {hasMoreImages && (
          <Button onClick={this.handleLoadMore} show={hasMoreImages}>
            Load more
          </Button>
        )}
        {showModal && (
          <Modal
            onClose={this.handleCloseModal}
            largeImageURL={largeImageURL}
          />
        )}
      </div>
    );
  }
}

export default App;
