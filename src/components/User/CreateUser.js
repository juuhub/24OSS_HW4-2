import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Loader from '../Common/Loader';
import './User.css';

const CreateUser = () => {
  const navigate = useNavigate();
  const createUserApi = "http://localhost:3000/user";
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    gender: "",
    age: "",
    email: "",
    phone: ""
  });

  const [errors, setErrors] = useState({}); // 유효성 검사 결과를 저장할 상태

  // 입력값을 처리하는 핸들러
  const handelInput = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};

    if (!user.name) newErrors.name = "Name is required";
    if (!user.gender) newErrors.gender = "Gender is required";
    if (!user.age || isNaN(user.age)) newErrors.age = "Valid age is required";
    if (!user.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(user.email))
      newErrors.email = "Valid email is required";
    if (!user.phone || !/^\d{10,}$/.test(user.phone)) // 최소 10자리 숫자만 허용
      newErrors.phone = "Valid phone number is required";

    return newErrors;
  };

  // 제출 핸들러
  const handelSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validateForm(); // 유효성 검사 실행
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // 에러가 있으면 표시
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(createUserApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
        setUser({ name: "", gender: "", age: "", email: "", phone: "" });
        navigate('/show-user');
      } else {
        console.error('Form submission failed!');
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='user-form'>
      <div className='heading'>
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <p>User Form</p>
      </div>
      <form onSubmit={handelSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={user.name} onChange={handelInput} />
          {errors.name && <p className="error-text">{errors.name}</p>} {/* 에러 메시지 표시 */}
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender</label>
          <input type="text" className="form-control" id="gender" name="gender" value={user.gender} onChange={handelInput} />
          {errors.gender && <p className="error-text">{errors.gender}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age</label>
          <input type="text" className="form-control" id="age" name="age" value={user.age} onChange={handelInput} />
          {errors.age && <p className="error-text">{errors.age}</p>}
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={handelInput} />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input type="text" className="form-control" id="phone" name="phone" value={user.phone} onChange={handelInput} />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>
        <button type="submit" className="btn btn-primary submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default CreateUser;
