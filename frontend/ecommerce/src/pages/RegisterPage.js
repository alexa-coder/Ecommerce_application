import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, login, register } from '../api/auth';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterPage = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await register(values);

      // login to get tokens
      authLogin({
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user
      });
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response) {
        if (err.response.data.username) {
          errorMessage = err.response.data.username[0];
        } else if (err.response.data.email) {
          errorMessage = err.response.data.email[0];
        } else if (err.response.data.password) {
          errorMessage = err.response.data.password[0];
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Register</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <Formik
                initialValues={{ username: '', email: '', password: '' }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <Field
                        name="username"
                        id="username"
                        className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage name="username" component="div" className="invalid-feedback" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Registering...
                        </>
                      ) : 'Register'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;