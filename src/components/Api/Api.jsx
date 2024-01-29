import axios from 'axios';

const apiKey = '40875400-82e0c12a147ae8cf2b06b950f';
const baseUrl = `https://pixabay.com/api/?key=${apiKey}&image_type=photo&orientation=horizontal&per_page=12`;

const fetchImages = async (query, page) => {
  try {
    console.log('Fetching images with query:', query, 'and page:', page);
    const response = await axios.get(`${baseUrl}&q=${query}&page=${page}`);
    const newImages = response.data.hits.map(image => ({
      id: image.id,
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      alt: String(image.tags),
    }));
    return newImages;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export { fetchImages };
