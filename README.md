# Products React App

This project is linked with [Products-API](https://github.com/rashedrahat/products-api).

### Do the following steps in the root directory inside the project in your local machine...

**Note:** This project was developed in node version `15.1.0`. (recommended version `>= 10.14.2`).

## Step 1: Install all the depedencies

    yarn
    
## Step 2: Configure environment file
- Create a `.env` file
- Copy from `.env.sample` file and paste all things into `.env` file
- Change the following environment variables:

  `REACT_APP_API_ENDPOINT=your_app_api_endpoint`
  
  `REACT_APP_IMAGE_ENDPOINT=your_app_image_endpoint`
  
  *Note: As this project is linked with [Products-API](https://github.com/rashedrahat/products-api) so copy and paste the following environment variables:*
    `REACT_APP_API_ENDPOINT=http://127.0.0.1:8000/api/`
    `REACT_APP_IMAGE_ENDPOINT=http://127.0.0.1:8000/storage/images/`
  
    
## Step 3: Run the app

    yarn start
    
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
