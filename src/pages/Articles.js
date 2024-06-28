import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Dashboard from '../components/Dashboard';
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
  }, [deleted]); // Re-fetch articles when a deletion occurs

  // Delete Article
  const deleteArticle = async (articleId) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.error('Access token not found. Please log in.');
        return;
      }

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://127.0.0.1:8000/api/articles/${articleId}`, axiosConfig);

      console.log('Article has been deleted');
      setDeleted(!deleted); // Toggle the deleted state to trigger useEffect
    } catch (error) {
      if (error.response) {
        console.error('Error deleting article:', error.response.data);
        console.error(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Error deleting article: No response received from server');
        console.error('Error: No response received from server');
      } else {
        console.error('Error deleting article:', error.message);
        console.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Articles ♥</title>
        <meta name="description" content="Articles" />
      </Helmet>
      <div className="articles">
        <Dashboard />
        <div className="articles-container">
          <div className="title">
            <p>
              <span className="s1">pages</span> <span className="s1">/</span>{" "}
              <span className="s2">Articles</span>
            </p>
          </div>
          <h4>Articles</h4>
          {articles.length > 0 ? (
            articles.map((article) => (
              <div className='article_content' key={article.id}>
                <img src={`http://127.0.0.1:8000/${article.image}`} alt="article_photo" />
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
