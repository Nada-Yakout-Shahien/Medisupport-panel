import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Helmet } from "react-helmet-async";
import Dashboarddoc from "./dashboard";
import './articles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

const Articles = () => {
  const [articlesd, setArticlesd] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [showedit, setShowedit] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [newArticle, setNewArticle] = useState({
    title: '',
    body: '',
    file: null 
  });

  // Fetch articles
  useEffect(() => {
    fetcharticles();
  }, []);

  const fetcharticles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/api/doctor/articles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setArticlesd(response.data.data);
      console.log('Articles:', response.data.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  // Fetch specific article
  const fetchSpecificArticle = async (id) => { // <-- Define id as parameter
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://127.0.0.1:8000/api/articles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEditArticle(response.data.data);
      console.log('Edit Article:', response.data.data);
    } catch (error) {
      console.error('Error fetching specific article:', error);
    }
  };

  // Update article
  const handleSave = async () => {
    try {
      if (!editArticle) {
        console.error('No article selected for edit.');
        return;
      }
      const token = localStorage.getItem("accessToken");
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        `http://127.0.0.1:8000/api/articles/${editArticle.id}`,
        { body: editArticle.body },
        axiosConfig
      );
      console.log("Updated article:", response.data);
      // After successful update, hide edit form
      setShowedit(false);
      // Fetch the last article after saving the changes
      fetcharticles();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const handleChange = (e) => {
    setEditArticle({ ...editArticle, body: e.target.value });
  };

  // Delete article
  const deleteArticle = async (articleid) => {
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
      await axios.delete(`http://127.0.0.1:8000/api/articles/${articleid}`, axiosConfig);
      console.log('Article has been deleted');
      setDeleted(true);
      fetcharticles();
    } catch (error) {
      if (error.response) {
        console.error('Error deleting article:', error.response.data);
        console.log(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Error deleting article: No response received from server');
        console.log('Error: No response received from server');
      } else {
        console.error('Error deleting article:', error.message);
        console.log(`Error: ${error.message}`);
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setNewArticle({
      ...newArticle,
      file: e.target.files[0] // تحديد الملف المختار
    });
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewArticle({
      title: '',
      body: '',
      file: null
    });
  };

  const handleAddArticle = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('title', newArticle.title);
      formData.append('body', newArticle.body);
      formData.append('file', newArticle.file);
      
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://127.0.0.1:8000/api/articles', formData, axiosConfig);
      console.log('New article added:', response.data);
      // Reset the form and hide it
      setNewArticle({
        title: '',
        body: '',
        file: null
      });
      setShowAddForm(false);
      // Fetch articles again to update the list
      fetcharticles();
    } catch (error) {
      console.error('Error adding new article:', error);
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
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
        <Dashboarddoc />
        <div className="articles-container">
          <h4>Articles</h4>
          <button type="button" className="add-button" onClick={handleAddClick}>
            <FontAwesomeIcon icon={faPlus} /> 
          </button>
          {showAddForm && (
            <div className="add-article-form">
              <input
                type="text"
                name="title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                placeholder="Title"
              />
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
              />
              <textarea
                name="body"
                value={newArticle.body}
                onChange={(e) => setNewArticle({ ...newArticle, body: e.target.value })}
                placeholder="Body"
              />
              <button type="button" onClick={handleAddArticle}>Save</button>
              <button type="button" onClick={handleCancelAdd}>Cancel</button>
            </div>
          )}
          {articlesd.length > 0 ? (
            articlesd.map((article) => (
              <div className='article_content' key={article.id}>
                <img src={`http://127.0.0.1:8000/${article.image}`} alt="article_photo" />
                <p>{article.body}</p>
                <button type="button" className="edit-button" onClick={() => {
                  setShowedit(true);
                  fetchSpecificArticle(article.id); // Fetch specific article by id
                  setEditArticle(article);
                }}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                {showedit && editArticle && editArticle.id === article.id && (
                  <div className='edit'>
                    <h4>Edit Article</h4>
                    <div className="edit-content">
                      <img src={"edit_Article"} alt="editArticle_photo" />
                      <textarea
                        value={editArticle.body}
                        onChange={handleChange}
                      />
                    </div>
                    <button type="button" className="save" onClick={handleSave}>Save</button>
                  </div>
                )}
                <button type="button" className="delete-button" onClick={() => deleteArticle(article.id)}>
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
