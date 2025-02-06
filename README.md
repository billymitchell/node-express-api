# Shipping API

A Node.js-based API that processes shipping orders and automatically updates shipments by integrating with external services such as Brightsites and SendGrid. This document provides detailed instructions on setup, configuration, project structure, and usage.

## Features

- **Order Processing:**  
  Groups order items by tracking number and adjusts shipment details.
- **External API Integration:**  
  Updates orders via the [`updateOrder`](./update_order.js) module.
- **Error Reporting:**  
  Configured to send detailed error reports via SendGrid (integration pending).
- **Testing:**  
  Simulates a POST request at server startup using test data from [`test.json`](./test.json).

## File Structure

- **index.js:**  
  The main server file. It sets up Express routes, processes incoming POST requests, and integrates with external services.  
  _Contains:_  
  - Date formatting functions.
  - A function to group items by tracking number.
  - The main POST request handler that validates API keys, processes shipments, and handles error reporting.

- **update_order.js:**  
  Contains the logic to update orders via an external API. This module is invoked by the main handler in `index.js`.

- **brightsites_stores.js:**  
  Maintains the Brightsites store API keys and associated URL mappings. It attaches the relevant API key to each order item based on a URL match.

- **sendgrid.js:**  
  (To be implemented) Configures SendGrid for sending detailed error emails when exceptions occur during the order update process.

- **update_database.js:**  
  (To be implemented) Contains MongoDB logging logic to store detailed error logs and request histories for troubleshooting purposes.

- **test.json:**  
  Contains sample POST request data for simulating an incoming API request during testing.

- **.env:**  
  Contains environment credentials and API keys. **This file must never be committed to source control.**  
  _Typical variables include:_  
  - `GENERAL_ACCESS_KEY`: API key for securing requests.
  - `SENDGRID_API_KEY`: API key for SendGrid integration.
  - `MONGO_URI`: MongoDB connection string.
  - `PORT`: The port on which the server runs.
  - `RUN_TEST`: A flag to trigger a test POST request on startup.

- **.gitignore:**  
  Specifies files and directories to be ignored by Git (e.g., `node_modules`, `.env`, OS-specific files like `.DS_Store`).

## Prerequisites

- **Node.js:**  
  Ensure Node.js (version as specified in [`package.json`](./package.json)) is installed.
  
- **npm:**  
  The Node Package Manager for installing dependencies.

- **MongoDB (Optional):**  
  Required if you wish to enable robust logging.

## Setup

### 1. Clone the Repository
Open your terminal and run:
```sh
git clone <repository-url>
cd Shipping-API