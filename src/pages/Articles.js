import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Dashboard from '../components/Dashboard';
//import article_admin from '../Images/article_admin.png';
import axios from 'axios';
import './Articles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [deleted, setDeleted] = useState(false);

  // Fetch Articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const token = localStorage.getItem('accessToken');  
        const response = await axios.get('http://127.0.0.1:8000/api/articles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setArticles(response.data.data); 
        console.log('Articles:', response.data.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }
    fetchArticles();
  }, []);

  // Delete Article
  const deleteArticle = async (articleId) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        alert('Access token not found. Please log in.');
        return;
      }

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://127.0.0.1:8000/api/articles/${articleId}`, axiosConfig);

      alert('Article has been deleted');
      setDeleted(true);
    } catch (error) {
      if (error.response) {
        console.error('Error deleting article:', error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Error deleting article: No response received from server');
        alert('Error: No response received from server');
      } else {
        console.error('Error deleting article:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (deleted) {
    return null; // Hide the component after deletion
  }

  return (
    <>
      <Helmet>
        <title>Articles ♥</title>
        <meta name="description" content="Articles" />
      </Helmet>
      <div className="articles">
        <Dashboard />
        <div className="articles-container">
          <h4>Articles</h4>
          {articles.length > 0 ? (
            articles.map((article) => (
              <div className='article_content' key={article.id}>
                <img src="{article_admin}" alt="article_photo" />
                <p>{article.body}</p>
                <button type="submit" className="delete-button" onClick={() => deleteArticle(article.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            ))
          ) : (
            <p>No articles available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Articles;
