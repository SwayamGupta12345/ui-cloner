# UI Cloner Website

## Overview

The **UI Cloner Website** is a web application designed to allow users to clone UI designs from various websites. The project provides functionalities such as saving, viewing, downloading, and deleting clones of UI elements, making it a helpful tool for developers and designers.

## Features

- **Save Clones**: Clone UI designs and save them for future use.
- **View Clones**: Open saved UI clones in a new browser tab for live viewing.
- **Download Clones**: Download the saved clones to your local machine.
- **Delete Clones**: Remove clones from the saved list with the click of a button.

## Technologies Used

- **Node.js**: The backend is built using Node.js for handling server-side logic.
- **Express**: A web application framework for building RESTful APIs and rendering views.
- **EJS**: Embedded JavaScript templating engine for dynamic content rendering.
- **CSS**: Used for styling the UI and ensuring a responsive layout.
- **JavaScript**: For client-side interactivity, including buttons for viewing, downloading, and deleting.

## Installation

Follow these steps to get your development environment up and running.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Setup

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/SwayamGupta12345/ui-cloner.git

2. Navigate to the project directory:

   ```
   cd ui-cloner
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Run the application using `nodemon` to automatically reload the server during development:

   ```bash
   nodemon app.js --ignore downloads/ --ignore saved/
   ```

   This command will start the server, and the `--ignore` flags ensure that the `downloads` and `saved` directories are not monitored for changes, optimizing performance.

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

* **Saving a Clone**: Clone a UI element and save it through the UI. The saved clone will appear in your saved list.
* **Viewing a Clone**: Click the "View" button next to any saved clone to open it in a new browser tab.
* **Downloading a Clone**: Use the "Download" button to download the saved clone as a ZIP file.
* **Deleting a Clone**: Click the "Delete" button next to a saved clone to remove it from your saved list.

## Folder Structure

```
/saved               # Directory for storing saved clones
/downloads           # Directory for storing downloadable clone files
app.js               # Main entry point for the Node.js application
/views               # EJS templates for dynamic content rendering
/public              # Static assets (CSS, JS, Images)
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! If you have suggestions, improvements, or bug fixes, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Submit a pull request.

## Acknowledgments

* Thanks to [nodemon](https://www.npmjs.com/package/nodemon) for simplifying the development workflow.
* EJS for rendering dynamic HTML views.



### Key Sections:
- **Overview**: Brief explanation of the project.
- **Features**: List of main features of your project.
- **Technologies Used**: Technologies and tools used to build the project.
- **Installation**: Step-by-step guide for setting up the project locally.
- **Usage**: Explanation of how to interact with the app.
- **Folder Structure**: A breakdown of the important directories and files.
- **License**: Licensing information for open-source contributions.
- **Contributing**: Instructions on how others can contribute to your project.
- **Acknowledgments**: Recognition for tools and libraries used in the project.
