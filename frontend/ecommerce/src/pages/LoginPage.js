import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, login } from '../api/auth';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await login({
                username: values.username,
                password: values.password
            });
            const profileResponse = await getProfile();

            authLogin({
                access: response.data.access,
                refresh: response.data.refresh,
                user: {
                    id: profileResponse.data.id,
                    username: profileResponse.data.username,
                    email: profileResponse.data.email,
                    is_admin: profileResponse.data.is_staff || false
                }
            });

            navigate('/');
        } catch (err) {
            let errorMessage = 'Login failed. Please check your credentials.';

            if (err.response) {
                if (err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                } else if (err.response.data.non_field_errors) {
                    errorMessage = err.response.data.non_field_errors[0];
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
                            <h2 className="card-title text-center mb-4">Login</h2>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <Formik
                                initialValues={{ username: '', password: '' }}
                                validationSchema={LoginSchema}
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
                                                    Logging in...
                                                </>
                                            ) : 'Login'}
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

export default LoginPage;