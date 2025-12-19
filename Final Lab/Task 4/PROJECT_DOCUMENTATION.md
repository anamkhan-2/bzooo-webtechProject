# Be Zoo - Express.js E-commerce Website

This is a converted Express.js version of the Be Zoo website, transformed from a static HTML/CSS layout into a full-featured Express application with proper templating and routing.

## Project Structure

```
├── app.js                 # Main Express server file
├── package.json          # Project dependencies
├── public/              # Static files (CSS, images, etc.)
│   ├── css/
│   │   └── style.css   # Main stylesheet
│   └── images/         # All image assets
├── views/              # EJS template views
│   ├── home.ejs       # Homepage view
│   ├── zoo.ejs        # Zoo information page
│   ├── gallery.ejs    # Gallery page
│   ├── tickets.ejs    # Tickets/pricing page
│   ├── contact.ejs    # Contact page
│   ├── 404.ejs        # 404 error page
│   ├── layout.ejs     # Main layout template
│   └── partials/      # Reusable template components
│       ├── header.ejs # Navigation header
│       └── footer.ejs # Site footer
└── node_modules/      # Installed npm packages
```

## Features

- **Clean Routing**: All pages have meaningful, RESTful routes
- **Template System**: Uses EJS (Embedded JavaScript) for dynamic templating
- **Reusable Components**: Header and footer implemented as partials
- **Static Assets**: Organized CSS and image files in the public folder
- **Responsive Design**: Original CSS styling preserved and enhanced
- **Error Handling**: Custom 404 page for missing routes

## Routes

| Route | View | Description |
|-------|------|-------------|
| `/` | home.ejs | Homepage with hero section and featured content |
| `/zoo` | zoo.ejs | Zoo information and tour details |
| `/gallery` | gallery.ejs | Animals gallery and photo collection |
| `/tickets` | tickets.ejs | Ticket pricing and purchase options |
| `/contact` | contact.ejs | Contact information and inquiry form |
| `/*` | 404.ejs | Catch-all for undefined routes |

## Installation

1. Navigate to the project directory:
   ```bash
   cd "d:\6th Semester\Be Zoo\Lab Task 3"
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

## Running the Application

Start the Express server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Technologies Used

- **Express.js**: Fast, unopinionated web framework
- **EJS**: Embedded JavaScript templating engine
- **Node.js**: JavaScript runtime
- **HTML5 & CSS3**: Frontend markup and styling

## File Organization Benefits

### Views (`views/` folder)
- `home.ejs`: Main landing page with hero section
- `zoo.ejs`: Zoo tours and experiences
- `gallery.ejs`: Photo gallery and animal collections
- `tickets.ejs`: Pricing and ticket information
- `contact.ejs`: Contact details and inquiry options
- `404.ejs`: Error page for missing pages

### Partials (`views/partials/` folder)
- `header.ejs`: Consistent navigation across all pages
- `footer.ejs`: Footer with social links and copyright

### Static Files (`public/` folder)
- `css/style.css`: All styling rules
- `images/`: All image assets organized separately

## Navigation Structure

The header includes links to all main sections:
- Home (`/`)
- The Zoo (`/zoo`)
- Animals Gallery (`/gallery`)
- Tickets (`/tickets`)
- Contact (`/contact`)
- Buy Now Button (CTA)

## Conversion Highlights

### What Changed:
1. ✅ Converted static HTML pages to dynamic EJS templates
2. ✅ Created reusable header and footer partials
3. ✅ Set up clean, meaningful routes for each section
4. ✅ Organized CSS and images into `public/` folder
5. ✅ Added Express.js server configuration
6. ✅ Implemented proper template inheritance and rendering

### What Stayed the Same:
- Original HTML structure and content
- All CSS styling and responsive design
- Image assets and logos
- Navigation and user interface

## Development Notes

### Adding New Pages:
1. Create a new `.ejs` file in the `views/` folder
2. Add a new route in `app.js`:
   ```javascript
   app.get('/new-page', (req, res) => {
     res.render('new-page', { title: 'Page Title' });
   });
   ```
3. Include the header and footer partials in your view

### Modifying Templates:
- Edit `views/partials/header.ejs` to change navigation
- Edit `views/partials/footer.ejs` to change footer content
- Update `public/css/style.css` for styling changes

### Adding Images:
1. Place image files in `public/images/`
2. Reference them in views as `/images/filename.ext`

## Future Enhancements

- Add database integration for dynamic content
- Implement user authentication
- Create an admin dashboard
- Add payment processing for ticket sales
- Implement contact form email functionality
- Add search and filtering capabilities

## License

© 2021 Betheme by Muffin group | All Rights Reserved | Powered by Express.js

---

**Created**: December 2024  
**Framework**: Express.js with EJS templating
