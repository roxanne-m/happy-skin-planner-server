# Happy Skin Planner

## Application Summary
The user can create a customized weekly skin planner to organize their daily skin regime. Users can add the product name, designate whether to be scheduled for 
morning or evening use, and mark the days for product use. When submitted, a weekly schedulle is set up with added products and use may mark them as completed or reset
the button to mark as incomplete. User may also delete specific products that would simultaneously delete the product from their weekly schedule. 

Link to front-end client built using React.
https://happy-skin-planner.roxanne-m.vercel.app/

![hsp](https://user-images.githubusercontent.com/70825798/106854351-015a5680-6670-11eb-817c-812d49361386.JPG)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Technology used to create Happy Skin Planner

### Backend
• Node & Express <br/>
  ⁃ RESTful API <br/><br/>
• Testing <br/>
  ⁃ Supertest <br/>
  ⁃ Mocha & Chai <br/><br/>
• Database <br/>
  ⁃ PostgreSQL <br/>
  ⁃ Knex <br/><br/>
• Production <br/>
  ⁃ Deployed via Heroku <br/>
 
### Frontend
• React <br/>
  ⁃ Create React <br/>
  ⁃ React Router <br/>
  ⁃ React Context <br/><br/>
• Testing <br/>
  ⁃ Jest (smoke tests) <br/><br/>
• Production <br/>
  ⁃ Deployed via Vercel <br/>
  

## Documentation of API

### Happy Skin Planner Endpoints
#### Products Endpoint
`GET  /api/products` <br/>
Provides full list of skin care products saved. <br/>


`POST  /api/products` <br/>
Creates new product with designated time of day (morning/evening) and days of week use. <br/>
| Key | Value |
| ------------- | ------------- |
| product_name  | Text, required |
| morning  | Boolean, default true  |
| days  | Boolean  |


`DELETE  /api/products/:product_id` <br/>
Deletes a specific product that matches endpoint id. <br/>


#### Weekly Planner Endpoint
`PATCH /api/weekly-planner/:week_id` <br/>
Updates the completed status (true/false) of the product matching the endpoint id. <br/>
| Key  | Value |
| ------------- | ------------- |
| completed  | Boolean, default false  |


