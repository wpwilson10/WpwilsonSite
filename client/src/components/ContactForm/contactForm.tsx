/**
 * The ContactFormRecaptcha component displays a form that allows users to send a message to the website owner.
 *
 * This component displays a form with fields for the user's name, email, phone number, and a message.
 * The form also includes reCAPTCHA for added security against bots. Once the user submits the form,
 * the message is sent to the website owner's email address using a specified email server.
 * After submitting the form, the component will display a success or error message depending on
 * the result of the submission.
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} The ContactFormRecaptcha component.
 */

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "react-responsive";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { handleAxiosError } from "../../utils/error";
import { object, string } from "yup";

// The server URL for the contact form API.
const contactURL: string =
	process.env.API_DOMAIN_NAME! + process.env.CONTACT_FORM_API!;

/**
 * Represents the structure of a contact form submission.
 *
 * @type {Object}
 * @property {string} name - The name of the person submitting the contact form.
 * @property {string} email - The email address of the person submitting the contact form.
 * @property {string} [phoneNumber] - (Optional) The phone number of the person submitting the contact form.
 * @property {string} message - The message submitted in the contact form.
 * @property {string} [recaptcha] - (Optional) The recaptcha token for validating the form submission.
 */
export interface IContactForm {
	name: string;
	email: string;
	phoneNumber?: string;
	message: string;
	recaptcha?: string;
}

const ContactFormRecaptcha = () => {
	// track form submission success or error
	const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
		useState(false);
	const [isSubmissionError, setIsSubmissionError] = useState(false);
	// track if recaptcha has been submitted
	const [isRecaptchaSubmitted, setIsRecapthcaSubmitted] = useState(false);
	// track if mobile screen size to resize reCAPTHCA
	const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

	// setup react-hook-form library
	const {
		register,
		handleSubmit,
		formState,
		formState: { errors },
		reset,
		setValue,
	} = useForm<IContactForm>({
		resolver: yupResolver(schema),
	});

	// setup reCAPTCHA
	const recaptchaRef = useRef<ReCAPTCHA>(null);

	const onSubmit = async (data: IContactForm) => {
		try {
			await axios.post(contactURL, data);
			setIsSubmissionError(false);
			setIsSuccessfullySubmitted(false);
		} catch (error) {
			handleAxiosError(error);
			setIsSubmissionError(true);
			setIsSuccessfullySubmitted(false);
			setIsRecapthcaSubmitted(false);
		}
	};

	// Handle reCAPTHCA updates
	const onChange = () => {
		if (recaptchaRef.current) {
			// Track if reCAPTCHA is filled for form validation
			setIsRecapthcaSubmitted(true);
			// Add recaptcha value to our form struct
			setValue("recaptcha", recaptchaRef.current.getValue()!);
		}
	};

	// Reset form if submission successfull
	// It's recommended to reset in useEffect as execution order matters
	// https://react-hook-form.com/api/useform/reset
	useEffect(() => {
		if (formState.isSubmitSuccessful && !isSubmissionError) {
			// isSubmitSuccessful gets wiped on reset, so remember it so we can display a success banner on reload
			setIsSuccessfullySubmitted(true);
			recaptchaRef.current?.reset();
			reset();
		}
	}, [formState, reset, isSubmissionError]);

	// Standard autocomplete options - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
	return (
		<Container
			id="contact_form"
			className="content-container mb-3 py-3 px-3"
		>
			<h3>Send a message</h3>
			<Form noValidate onSubmit={handleSubmit(onSubmit)}>
				{/* Success or error message after submission */}
				<Row className="justify-content-md-left">
					<Col md={12} className="mb-3">
						{/* Feedback for successful form submission */}
						{isSuccessfullySubmitted && (
							<Alert variant="success">
								<p className="mb-0">
									Success - Thanks for your message!
								</p>
							</Alert>
						)}
						{/* Feedback for unsuccessful form submission */}
						{isSubmissionError && (
							<Alert variant="danger">
								<p className="mb-0">
									Error occurred while sending message. Please
									try again.
								</p>
							</Alert>
						)}
					</Col>
				</Row>

				{/* Full Name - use full name for better usability as opposed to seperate fields
					xs=9 md=7 makes fields appropriately sized for different screens
					*/}
				<Row className="justify-content-md-left">
					<Col xs={12} md={8} className="mb-3">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							autoComplete="name"
							{...register("name")}
							isInvalid={!!errors.name}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.name?.message}
						</Form.Control.Feedback>
					</Col>
				</Row>

				{/* Email */}
				<Row className="justify-content-md-left">
					<Col xs={12} md={8} className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							autoComplete="email"
							{...register("email")}
							isInvalid={!!errors.email}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.email?.message}
						</Form.Control.Feedback>
					</Col>
				</Row>

				{/* Phone Number*/}
				<Row className="justify-content-md-left">
					<Col xs={12} md={8} className="mb-3">
						<Form.Label>Phone Number (optional)</Form.Label>
						<Form.Control
							type="tel"
							autoComplete="tel"
							{...register("phoneNumber")}
							isInvalid={!!errors.phoneNumber}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.phoneNumber?.message}
						</Form.Control.Feedback>
					</Col>
				</Row>

				{/* Message field - full width*/}
				<Row className="justify-content-md-left">
					<Col md={12} className="mb-3">
						<Form.Label>Message</Form.Label>
						<Form.Control
							as="textarea"
							rows={4}
							{...register("message")}
							isInvalid={!!errors.message}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.message?.message}
						</Form.Control.Feedback>
					</Col>
				</Row>

				{/* reCAPTCHA v2 button aligned to the right
					Resizes if using a mobile screen to make somewhat responsive*/}
				<Row className="justify-content-md-center">
					<Col md={12} className="mb-3 d-flex justify-content-end">
						{isMobile ? (
							<ReCAPTCHA
								sitekey={process.env.RECAPTCHA_SITE_KEY!}
								ref={recaptchaRef}
								onChange={onChange}
								size="compact"
							/>
						) : (
							<ReCAPTCHA
								sitekey={process.env.RECAPTCHA_SITE_KEY!}
								ref={recaptchaRef}
								onChange={onChange}
								size="normal"
							/>
						)}
					</Col>
				</Row>

				{/* Submit button aligned to the right*/}
				<Row className="justify-content-md-center">
					<Col md={12} className="mb-3 d-flex justify-content-end">
						<Button
							type="submit"
							disabled={
								formState.isSubmitting || !isRecaptchaSubmitted
							}
						>
							Send Message
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

/**
 * Regular expression for phone number validation
 *
 * @constant {RegExp}
 */
export const phoneRegExp =
	/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

/**
 * Schema object for contact form input validation using Yup library.
 *
 * @type {Object}
 * @property {function} name - Validates the name input as a required string.
 * @property {function} message - Validates the message input as a required string.
 * @property {function} email - Validates the email input as a required string and must be a valid email format.
 * @property {function} phoneNumber - Validates the phone number input based on the phoneRegExp.
 * @property {function} recaptcha - Validates the recaptcha input as a string.
 */
export const schema = object({
	name: string().required("Name is required"),
	message: string().required("Message is required"),
	email: string()
		.email("Please enter a valid email address")
		.required("Email address is required"),
	phoneNumber: string().matches(phoneRegExp, {
		message: "Please enter a valid phone number",
		excludeEmptyString: true,
	}),
	recaptcha: string(),
});

export default ContactFormRecaptcha;
