/**
 * The LoadingSpinner component that displays a spinning animation to indicate loading state.
 *
 * This component displays a circular spinner that rotates indefinitely to show that some content
 * is being loaded. The component uses CSS animations to create the spinner effect. The component
 * can be used as a fallback for lazy loading or suspense components.
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} The LoadingSpinner component.
 */

import "./spinner.css";

// Define the LoadingSpinner component
export default function LoadingSpinner() {
	return (
		<div className="spinner-container">
			<div className="loading-spinner"></div>
		</div>
	);
}
