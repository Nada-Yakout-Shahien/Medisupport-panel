import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Dashboarddoc from "./dashboard";
import "../Doctor_pages/profile.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEdit } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

const Profile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Image handling
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openFileBrowser = () => {
    document.getElementById('fileInput').click();
  };

  // Fetch doctor data
  useEffect(() => {
    async function fetchdoctorProfile() {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://127.0.0.1:8000/api/auth/doctor/user-profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDoctorData(response.data.data);
        if (response.data.data.avatar) {
          setImageSrc(`http://127.0.0.1:8000/${response.data.data.avatar}`);
        }
        console.log('Doctor Profile:', response.data.data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      }
    }
    fetchdoctorProfile();
  }, []);

  // Update doctor data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const formData = new FormData();
      formData.append('first_name', doctorData.first_name);
      formData.append('last_name', doctorData.last_name);
      formData.append('specialization', doctorData.specialization);
      formData.append('email', doctorData.email);
      formData.append('phone', doctorData.phone);
      formData.append('clinic_location', doctorData.clinic_location);
      formData.append('bio', doctorData.bio);
      formData.append('price', doctorData.price);
      formData.append('password', doctorData.password);
      formData.append('confirm_password', doctorData.confirm_password);
      if (imageSrc) {
        formData.append('avatar', imageSrc);
      }

      await axios.post(`http://127.0.0.1:8000/api/doctors/${doctorData.id}`, formData, axiosConfig);
      console.log('Update Doctor Data Successfully');
      setIsOverlayVisible(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error updating doctor data:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile ♥</title>
        <meta name="description" content="Profile" />
      </Helmet>
      <div className="profile">
        <Dashboarddoc />
        <div className="profile-container">
          <div className="profile-doc">
            <div className='image'>
              {imageSrc ? (
                <img src={imageSrc} alt="Uploaded" />
              ) : (
                <img src="" alt='Doctor_Avatar' />
              )}
              <div className='edit'>
                <button onClick={openFileBrowser}>
                  <FontAwesomeIcon className='upload' icon={faEdit} />
                </button>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              {doctorData && (
                <h4>{`${doctorData.first_name || ''} ${doctorData.last_name || ''}`}</h4>
              )}

              <div className='info'>
                <h4>Edit Info</h4>
                <div className="inputs">
                  <div className='name'>
                    <div class="full_name">                      
                    <div className='f-name'>
                      <label>FName</label>
                      <input
                        placeholder='First Name'
                        type='text'
                        value={doctorData ? doctorData.first_name : ''}
                        onChange={e => setDoctorData({ ...doctorData, first_name: e.target.value })}
                      />
                    </div>
                    <div className='l-name'>
                      <label>LName</label>
                      <input
                        placeholder='LName'
                        type='text'
                        value={doctorData ? doctorData.last_name : ''}
                        onChange={e => setDoctorData({ ...doctorData, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  </div>
                  <div className='special'>
                    <label>Specialization</label>
                    <input
                      placeholder='Specialization'
                      type='text'
                      value={doctorData ? doctorData.specialization : ''}
                      onChange={e => setDoctorData({ ...doctorData, specialization: e.target.value })}
                    />
                  </div>

                  <div className='email'>
                    <label>Email</label>
                    <input
                      placeholder='Email'
                      type='text'
                      value={doctorData ? doctorData.email : ''}
                      onChange={e => setDoctorData({ ...doctorData, email: e.target.value })}
                    />
                  </div>

                  <div className='phone'>
                    <label>Phone</label>
                    <input
                      placeholder='phone'
                      type='text'
                      value={doctorData ? doctorData.phone : ''}
                      onChange={e => setDoctorData({ ...doctorData, phone: e.target.value })}
                    />
                  </div>

                  <div className='location'>
                    <label>Clinic Location</label>
                    <input
                      placeholder='Clinic Location'
                      type='text'
                      value={doctorData ? doctorData.clinic_location : ''}
                      onChange={e => setDoctorData({ ...doctorData, clinic_location: e.target.value })}
                    />
                  </div>

                  <div className='bio'>
                    <label>Bio</label>
                    <input
                      placeholder='Bio'
                      type='text'
                      value={doctorData ? doctorData.bio : ''}
                      onChange={e => setDoctorData({ ...doctorData, bio: e.target.value })}
                    />
                  </div>

                  <div className='price'>
                    <label>Price</label>
                    <input
                      placeholder='Price'
                      type='text'
                      value={doctorData ? doctorData.price : ''}
                      onChange={e => setDoctorData({ ...doctorData, price: e.target.value })}
                    />
                  </div>

                  <div className='pass'>
                    <label>Password</label>
                    <input
                      placeholder='Password'
                      type={showPassword ? "text" : "password"}
                      value={doctorData ? doctorData.password : ''}
                      onChange={e => setDoctorData({ ...doctorData, password: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>

                  <div className='confirm'>
                    <label>Confirm Password</label>
                    <input
                      placeholder='Confirm Password'
                      type={showPassword ? "text" : "password"}
                      value={doctorData ? doctorData.confirm_password : ''}
                      onChange={e => setDoctorData({ ...doctorData, confirm_password: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
                <div className='save'>
                  <button type="submit">Save</button>
                  {isOverlayVisible && (
                    <div className="overlay">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="300"
                        height="300"
                        viewBox="0 0 300 300"
                        fill="none"
                      >
                        <path
                          d="M150 281.25C115.19 281.25 81.8064 267.422 57.1922 242.808C32.5781 218.194 18.75 184.81 18.75 150C18.75 115.19 32.5781 81.8064 57.1922 57.1922C81.8064 32.5781 115.19 18.75 150 18.75C184.81 18.75 218.194 32.5781 242.808 57.1922C267.422 81.8064 281.25 115.19 281.25 150C281.25 184.81 267.422 218.194 242.808 242.808C218.194 267.422 184.81 281.25 150 281.25ZM150 300C189.782 300 227.936 284.196 256.066 256.066C284.196 227.936 300 189.782 300 150C300 110.218 284.196 72.0644 256.066 43.934C227.936 15.8035 189.782 0 150 0C110.218 0 72.0644 15.8035 43.934 43.934C15.8035 72.0644 0 110.218 0 150C0 189.782 15.8035 227.936 43.934 256.066C72.0644 284.196 110.218 300 150 300Z"
                          fill="#4A963D"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="73.825"
                          y="89"
                          width="153"
                          height="122"
                          viewBox="0 0 153 122"
                          fill="none"
                        >
                          <path
                            d="M128.687 4.18738C128.554 4.31683 128.429 4.45461 128.312 4.59989L63.1937 87.5686L23.95 48.3061C21.2842 45.8221 17.7583 44.4698 14.1152 44.5341C10.4721 44.5984 6.99608 46.0742 4.41959 48.6507C1.8431 51.2272 0.367251 54.7032 0.302972 58.3463C0.238693 61.9895 1.591 65.5154 4.075 68.1812L53.6875 117.812C55.024 119.146 56.6156 120.198 58.3672 120.903C60.1188 121.609 61.9946 121.955 63.8827 121.92C65.7708 121.885 67.6325 121.47 69.3568 120.7C71.0811 119.93 72.6326 118.82 73.9187 117.437L148.769 23.8749C151.317 21.1998 152.711 17.6292 152.648 13.9349C152.585 10.2406 151.071 6.71954 148.432 4.13291C145.794 1.54627 142.244 0.10192 138.549 0.112114C134.854 0.122308 131.312 1.58623 128.687 4.18738Z"
                            fill="#4A963D"
                          />
                        </svg>
                      </svg>{" "}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
