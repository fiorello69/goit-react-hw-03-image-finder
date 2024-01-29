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
      lastSearch: newQuery,
    });
  };
  handleInitialLoad = () => {
    this.fetchImages();
  };
  handleLoadMore = () => {
    const { hasMoreImages, lastSearch } = this.state;

    if (!hasMoreImages) {
      return;
    }

    this.setState(
      prevState => ({
        page: prevState.page + 1,
        loading: true,
      }),
      () => {
        if (lastSearch) {
          this.fetchImages(lastSearch, this.state.page);
        } else {
          this.handleInitialLoad();
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
    if (this.state.page === 1 && this.state.query) {
      this.fetchImages();
    }
    this.handleInitialLoad();
  }

  componentDidUpdate(_, prevState) {
    const { query, page, loading } = this.state;

    if (prevState.query === query && prevState.page === page) {
      return;
    }

    if (!loading) {
      this.fetchImages();
    }
  }

  fetchImages = async (query = this.state.query, page = this.state.page) => {
    try {
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
