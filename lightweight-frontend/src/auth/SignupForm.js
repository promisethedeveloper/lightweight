import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";
import "./SignupForm.css";

const SignupForm = ({ signup }) => {
	const history = useHistory();
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		firstName: "",
		lastName: "",
		email: "",
	});

	const [formErrors, setFormErrors] = useState([]);

	/**
	 * Handle form submit:
	 *
	 * Calls login function prop and if successful, redirect to "/"
	 */

	const handleSubmit = async (e) => {
		e.preventDefault();
		let result = await signup(formData);
		if (result.success) {
			history.push("/");
		} else {
			setFormErrors(result.errors);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((data) => ({ ...data, [name]: value }));
	};

	return (
		<div className="SignupForm">
			<div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
				<h2 className="mb-3 SignupForm-heading">Sign Up</h2>
				<div className="card">
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="username">Username</label>
								<input
									id="username"
									name="username"
									className="form-control"
									value={formData.username}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input
									id="password"
									type="password"
									name="password"
									className="form-control"
									value={formData.password}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="firstName">First name</label>
								<input
									id="firstName"
									name="firstName"
									className="form-control"
									value={formData.firstName}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="lastName">Last name</label>
								<input
									id="lastName"
									name="lastName"
									className="form-control"
									value={formData.lastName}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input
									id="email"
									name="email"
									type="email"
									className="form-control"
									value={formData.email}
									onChange={handleChange}
								/>
							</div>

							{formErrors.length ? (
								<Alert type="danger" messages={formErrors} />
							) : null}

							<button
								type="submit"
								className="btn float-right font-weight-bold SignupForm-button"
								onSubmit={handleSubmit}
							>
								SUBMIT
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignupForm;
