# WpwilsonSite

This repository contains the frontend for the **WpwilsonSite** project, built with **React** and **TypeScript**, bundled using **Webpack** for flexibility and configurability. The application integrates with backend services via API endpoints and uses **environment variables** for configuration.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Development](#development)
- [Production](#production)
- [Testing & CI/CD](#testing--cicd)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

WpwilsonSite is a modern, responsive, and secure single-page application (SPA) built with React and TypeScript. It integrates multiple backend services—each maintained in its own repository—to deliver a cohesive user experience through unified modules that combine both frontend interfaces and their corresponding APIs.

- **Contact Module:**  
  This module provides a comprehensive Contact Page that displays the website owner’s contact details (including GitHub, LinkedIn, and email links) alongside a secure, reCAPTCHA-protected contact form. User inquiries are submitted directly through the Contact Form API, as maintained in the [contact-form-service](https://github.com/wpwilson10/contact-form-service).

- **Light Scheduler Module:**  
  This module offers an advanced Light Scheduler interface that enables users to manage smart lighting configurations. It supports various operating modes (day/night, scheduled, demo) and provides real-time feedback on light settings by communicating with the Light Schedule API from the [light-schedule-service](https://github.com/wpwilson10/light-schedule-service).

Additional integrations include:

- **Error API:** Captures and logs client-side errors via the [logging-service](https://github.com/wpwilson10/logging-service).
- **Checkout API:** (In-progress) Handles e-commerce checkout requests.
- **Product API:** (In-progress) Retrieves a list of available products.

Together, these integrated modules and API services form a robust, modular, and scalable architecture that seamlessly connects the frontend with its various backend functionalities.

---

## Features

- **Single Page Application:** Seamless navigation using React Router.
- **Light Scheduler:** Advanced interface for managing light schedules, modes, and brightness levels with real-time validations.
- **Contact Form with reCAPTCHA:** Secure form submission using react-hook-form, Yup validation, and Google reCAPTCHA.
- **Navigation Bar:** Responsive navbar built with React Bootstrap that integrates with React Router and reflects user login status.
- **Authentication:** Integrated with Amazon Cognito via OIDC.
- **Lazy Loading & Error Boundaries:** Components and pages load on demand with robust error handling.
- **State Management:** Centralized state using Redux and custom hooks (in-progress).

---

## Tech Stack

- **React** with **TypeScript**
- **Redux** for state management
- **React Router** for client-side routing
- **React Bootstrap** for UI components
- **Webpack** for module bundling and build processes
- **Axios** for API communication
- **Amazon Cognito** for authentication
- **ESLint & Prettier** for code quality

## Setup

### 1. Install Dependencies

Before running the application, install dependencies:

```sh
npm install
```

## 2. Building the Project

The project can be built in either **development** or **production** mode:

- **Development Mode:**
    ```sh
    npm run dev
    ```
- **Production Mode:**
    ```sh
    npm run prod
    ```

After building, you must upload the files using the **Terraform-based setup** in the [AWS_Web_Hosting_Infra repository](https://github.com/wpwilson10/AWS_Web_Hosting_Infra), which handles static hosting on **Amazon S3** and **CloudFront**.

## Configuration

Several files should be updated for custom deployments:

### Environment Variables (.env Files)

The `.env` files define API endpoints and external links. Key variables include:

- **DOMAIN_NAME** – Base domain where the frontend is hosted.
- **API Endpoints:**
    - **CONTACT_FORM_API** – Server endpoint for contact form submissions.
    - **CHECKOUT_API** – Endpoint for processing orders.
    - **PRODUCT_API** – Retrieves available products.
    - **ERROR_API** – Logs client-side errors.
    - **LIGHT_SCHEDULE_API** – Fetches and updates light schedules.
- **Social Media Links:**
    - **GITHUB_LINK**, **LINKEDIN_LINK**, **EMAIL_ADDRESS**
- **reCAPTCHA Site Key:**
    - **RECAPTCHA_SITE_KEY** – Used for spam protection.

Refer to `dev.env` for an example configuration.
