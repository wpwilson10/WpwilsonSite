/**
 * The ContactPage component displays a page that allows users to contact the website owner.
 *
 * This component displays two sections: one with the contact information of the website owner,
 * and another with a form that allows users to send a message to the website owner. The form
 * uses reCAPTCHA for added security against bots. The component uses lazy loading and suspense
 * to load the form component only when needed.
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} The ContactPage component.
 */

import { Suspense, lazy } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import LoadingSpinner from "../LoadingSpinner/spinner";

// Lazy load the ContactFormRecaptcha component
const ContactFormRecaptcha = lazy(() => import("../ContactForm/contactForm"));

// Define the ContactPage component
const ContactPage = () => (
	<div>
		<ContactInfo />
		<Suspense fallback={<LoadingSpinner />}>
			<ContactFormRecaptcha />
		</Suspense>
	</div>
);

/**
 * A React functional component that displays the contact information section, which includes the following information:
 *
 * - The contact information section header
 * - An email address, which is retrieved from the environment variables
 * - Links to the user's GitHub and LinkedIn profiles, which are also retrieved from environment variables
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} The contact information section as a JSX element.
 */
export const ContactInfo = () => {
	return (
		<Container
			id="contact_info"
			className="content-container mb-3 py-3 px-3"
		>
			<h3>Contact Information</h3>
			<p></p>
			<p>Email: {process.env.EMAIL_ADDRESS}</p>
			<Row className="justify-content-start">
				<Col xs={12} md="auto">
					{/* GitHub Icon and Link 
							Target and Rel options cause the link to open in a new tab */}
					<a
						href={process.env.GITHUB_LINK}
						target="_blank"
						rel="noopener noreferrer"
						className="link-no-decoration"
					>
						<div className="contact-link-container">
							<FaGithub size="2em" />
							<div className="contact-link-text">GitHub</div>
						</div>
					</a>
				</Col>
				<Col xs={12} md="auto">
					{/* LinkedIn Icon and Link
							Target and Rel options cause the link to open in a new tab */}
					<a
						href={process.env.LINKEDIN_LINK}
						target="_blank"
						rel="noopener noreferrer"
						className="link-no-decoration"
					>
						<div className="contact-link-container">
							<FaLinkedin size="2em" />
							<div className="contact-link-text">LinkedIn</div>
						</div>
					</a>
				</Col>
				<Col xs={12} md="auto">
					{/* Opens email */}
					<a
						href={"mailto:" + process.env.EMAIL_ADDRESS}
						className="link-no-decoration"
					>
						<div className="contact-link-container">
							<MdEmail size="2em" />
							<div className="contact-link-text">Email</div>
						</div>
					</a>
				</Col>
			</Row>
		</Container>
	);
};

export default ContactPage;
