# Zoo Store Checkout Page - Modular Structure

This project has been separated into three organized files for better maintainability and reusability.

## File Structure

### 1. **checkout.html** (589 lines)
- Pure HTML structure with semantic markup
- Links to external CSS (`styles.css`) and JavaScript (`checkout.js`)
- Bootstrap 5 framework integrated
- No inline styles or scripts
- Includes all form fields, payment methods, and order summary

**Contents:**
- Progress Header (4-step checkout indicator)
- Customer Information Form
- Shipping Address Form
- Payment Method Selection
- Order Summary (sticky on desktop)
- Terms & Conditions Agreement

### 2. **styles.css** (562 lines)
- Complete styling separated from HTML
- Organized with clear section comments
- CSS Variables for theming (primary/secondary colors)
- Bootstrap utilities integration
- Responsive design breakpoints
- Accessibility-focused styling

**Sections:**
- Root variables
- Progress header styles
- Main content layout
- Form styling (inputs, selects, validation states)
- Order summary styles
- Payment method styles
- Button styles
- Validation feedback styles
- Accessibility focus states
- Mobile responsive styles

### 3. **checkout.js** (397 lines)
- jQuery-based validation and interactivity
- Separated from HTML/CSS
- No inline event handlers in HTML
- Complete form validation logic
- Organized with clear section comments

**Features:**
- Comprehensive form validation
- Real-time error feedback
- Payment method toggling
- Input formatting (card number, phone, postal code, expiry date, CVV)
- Smooth scroll to first error
- Terms checkbox validation
- Form submission handling
- Coupon code input
- Accessibility enhancements

## File Links

Each file references the others properly:

```html
<!-- In checkout.html -->
<link rel="stylesheet" href="styles.css">
<script src="checkout.js"></script>
```

## How to Use

1. Place all three files in the same directory
2. Open `checkout.html` in a web browser
3. The page will automatically load styles from `styles.css` and functionality from `checkout.js`

## Dependencies

- Bootstrap 5.3.0 (via CDN)
- jQuery 3.6.0 (via CDN)

## Benefits of Separation

✅ **Maintainability** - Each file has a single responsibility
✅ **Reusability** - Styles can be used across multiple pages
✅ **Scalability** - Easy to expand and modify
✅ **Performance** - CSS and JS are cached by browsers
✅ **Collaboration** - Team members can work on different files
✅ **Testing** - Easier to unit test JavaScript logic

## Validation Rules

### Customer Information
- **Full Name:** Required, 3+ characters
- **Email:** Required, valid email format
- **Phone:** Required, 10+ digits

### Shipping Address
- **Address:** Required
- **City:** Required
- **Postal Code:** Required, 4-6 numeric digits
- **Country:** Required (select from dropdown)

### Payment Method
- **Card:** Requires cardholder name, card number (16 digits), expiry (MM/YY), CVV (3-4 digits)
- **COD:** No additional fields required
- **Wallet:** No additional fields required

### Terms & Conditions
- Must be checked before order submission

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Created:** December 2025
**Framework:** Bootstrap 5
**Library:** jQuery 3.6.0
