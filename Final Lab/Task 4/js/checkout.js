$(document).ready(function () {

    const validationRules = {
        fullName: {
            required: true,
            minLength: 3,
            errorMessage: 'Full name is required and must be at least 3 characters.'
        },
        email: {
            required: true,
            email: true,
            errorMessage: 'Please enter a valid email address.'
        },
        phone: {
            required: true,
            phone: true,
            errorMessage: 'Phone number is required and must be at least 10 digits.'
        },
        address: {
            required: true,
            errorMessage: 'Street address is required.'
        },
        city: {
            required: true,
            errorMessage: 'City is required.'
        },
        postalCode: {
            required: true,
            postalCode: true,
            errorMessage: 'Postal code is required and must be numeric (4-6 digits).'
        },
        country: {
            required: true,
            errorMessage: 'Please select a country.'
        },
        cardholderName: {
            required: true,
            minLength: 3,
            errorMessage: 'Cardholder name is required and must be at least 3 characters.'
        },
        cardNumber: {
            required: true,
            cardNumber: true,
            errorMessage: 'Card number is required and must be exactly 16 digits.'
        },
        expiryDate: {
            required: true,
            expiryDate: true,
            errorMessage: 'Expiry date is required (format: MM/YY).'
        },
        cvv: {
            required: true,
            cvv: true,
            errorMessage: 'CVV is required (3-4 digits).'
        },
        terms: {
            required: true,
            errorMessage: 'You must accept the terms and conditions.'
        }
    };

   
    const validators = {
        required: function (value) {
            return value.trim() !== '';
        },
        minLength: function (value, length) {
            return value.trim().length >= length;
        },
        email: function (value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value.trim());
        },
        phone: function (value) {
            const phoneDigits = value.replace(/\D/g, '');
            return phoneDigits.length >= 10;
        },
        postalCode: function (value) {
            const postalCodeRegex = /^\d{4,6}$/;
            return postalCodeRegex.test(value.trim());
        },
        cardNumber: function (value) {
            const cardNumber = value.replace(/\s/g, '');
            return cardNumber.length === 16 && !isNaN(cardNumber);
        },
        expiryDate: function (value) {
            const expiryRegex = /^\d{2}\/\d{2}$/;
            return expiryRegex.test(value.trim());
        },
        cvv: function (value) {
            const cvvRegex = /^\d{3,4}$/;
            return cvvRegex.test(value.trim());
        }
    };

 
    function validateField(fieldName) {
        const $field = $('#' + fieldName);
        let isValid = true;
        let errorMessage = '';

        if (!$field.length) return true;

        if (fieldName.startsWith('card') && $('input[name="paymentMethod"]:checked').val() !== 'card') {
            $field.removeClass('is-invalid is-valid');
            $field.siblings('.invalid-feedback').hide();
            return true;
        }

        if (fieldName === 'terms') {
            isValid = $field.is(':checked');
            errorMessage = validationRules[fieldName].errorMessage;
        } else {
            const rules = validationRules[fieldName];
            const value = $field.val();
            if (rules.required && !validators.required(value)) {
                isValid = false;
                errorMessage = rules.errorMessage;
            }
            else if (rules.minLength && !validators.minLength(value, rules.minLength)) {
                isValid = false;
                errorMessage = rules.errorMessage;
            }
            else if (rules.email && value && !validators.email(value)) {
                isValid = false;
                errorMessage = rules.errorMessage;
            }
            else if (rules.phone && value && !validators.phone(value)) {
                isValid = false;
                errorMessage = rules.errorMessage;
            }
            else if (rules.postalCode && value && !validators.postalCode(value)) {
                isValid = false;
                errorMessage = rules.errorMessage;
            }
            else if (rules.cardNumber && value && !validators.cardNumber(value)) {
                isValid = false;
                errorMessage = rules.errorMessage;
            }
            else if (rules.expiryDate && value && !validators.expiryDate(value)) {
                isValid = false;
                errorMessage = rules.errorMessage;
            }
            else if (rules.cvv && value && !validators.cvv(value)) {
                isValid = false;
                errorMessage = rules.errorMessage;
            }
        }

        if (isValid) {
            $field.removeClass('is-invalid').addClass('is-valid');
            $field.siblings('.invalid-feedback').hide();
        } else {
            $field.removeClass('is-valid').addClass('is-invalid');
            $field.siblings('.invalid-feedback').text(errorMessage).show();
        }

        return isValid;
    }

 
    function validateAllFields() {
        let allFieldsValid = true;
        const fieldsToValidate = [
            'fullName', 'email', 'phone', 'address', 'city', 'postalCode', 'country', 'terms'
        ];

        if (!$('input[name="paymentMethod"]:checked').length) {
            allFieldsValid = false;
        }

        if ($('input[name="paymentMethod"]:checked').val() === 'card') {
            fieldsToValidate.push('cardholderName', 'cardNumber', 'expiryDate', 'cvv');
        }

        fieldsToValidate.forEach(fieldName => {
            if (!validateField(fieldName)) {
                allFieldsValid = false;
            }
        });

        return allFieldsValid;
    }

  
    $('#fullName, #email, #phone, #address, #city, #postalCode, #country, #cardholderName, #cardNumber, #expiryDate, #cvv').on('blur', function () {
        const fieldName = $(this).attr('id');
        validateField(fieldName);
    });


    $('#fullName, #email, #phone, #address, #city, #postalCode, #cardholderName, #cardNumber, #expiryDate, #cvv').on('input', function () {
        const fieldName = $(this).attr('id');
        if ($(this).hasClass('is-invalid')) {
            validateField(fieldName);
        }
    });

    // ============================
    // Validate Country on Change
    // ============================
    $('#country').on('change', function () {
        validateField('country');
    });


    $('#terms').on('change', function () {
        if ($(this).is(':checked')) {
            $(this).removeClass('is-invalid').addClass('is-valid');
            $(this).siblings('.invalid-feedback').hide();
        } else {
            $(this).removeClass('is-valid').addClass('is-invalid');
            $(this).siblings('.invalid-feedback').show();
        }
    });

    // ============================
    // Payment Method Toggle
    // ============================
    $('input[name="paymentMethod"]').on('change', function () {
        const paymentMethod = $(this).val();

        // Update active payment method styling
        $('.payment-method').removeClass('active');
        $('#' + this.id + 'Container').addClass('active');

        // Hide all payment details
        $('.payment-details').removeClass('show');

        // Show selected payment details
        $('#' + this.id.replace('Payment', '') + 'Details').addClass('show');

        // Clear validation for card fields if card is not selected
        if (paymentMethod !== 'card') {
            ['cardholderName', 'cardNumber', 'expiryDate', 'cvv'].forEach(fieldName => {
                const $field = $('#' + fieldName);
                $field.removeClass('is-invalid is-valid');
                $field.siblings('.invalid-feedback').hide();
            });
        }
    });

    // ============================
    // Smooth Scroll to First Error
    // ============================
    function scrollToFirstError() {
        const firstError = $('.is-invalid:first');
        if (firstError.length) {
            $('html, body').animate({
                scrollTop: firstError.offset().top - 100
            }, 500);
            firstError.focus();
        }
    }

    // ============================
    // Form Submission Handler
    // ============================
    $('#checkoutForm').on('submit', function (e) {
        e.preventDefault();

        // Validate all fields
        if (!validateAllFields()) {
            scrollToFirstError();
            alert('Please correct the errors before submitting.');
            return false;
        }

        // Extract customer information
        const fullName = $('#fullName').val().trim();
        const email = $('#email').val().trim();

        // Submit order via AJAX
        $.ajax({
            type: 'POST',
            url: '/create-order',
            data: {
                customerName: fullName,
                email: email
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Redirect to order confirmation page
                    window.location.href = '/order-confirmation/' + response.orderId;
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function () {
                alert('Error creating order. Please try again.');
            }
        });

        return false;
    });

    // ============================
    // Coupon Button Handler
    // ============================
    $('#applyCouponBtn').on('click', function () {
        const couponCode = $('#couponCode').val().trim();
        if (couponCode) {
            alert('Coupon code "' + couponCode + '" would be applied here (non-functional for demo)');
            $('#couponCode').val('');
        } else {
            alert('Please enter a coupon code');
        }
    });

    // ============================
    // Continue Shopping Button
    // ============================
    $('#continueShoppingBtn').on('click', function () {
        alert('Redirecting to shop page...');
    });

    // ============================
    // Card Number Formatting
    // ============================
    $('#cardNumber').on('input', function () {
        let value = $(this).val().replace(/\s/g, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        $(this).val(formattedValue.substring(0, 19));
    });

    // ============================
    // Expiry Date Formatting
    // ============================
    $('#expiryDate').on('input', function () {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        $(this).val(value);
    });

    // ============================
    // CVV Formatting (Numbers Only)
    // ============================
    $('#cvv').on('input', function () {
        $(this).val($(this).val().replace(/\D/g, '').substring(0, 4));
    });

    // ============================
    // Phone Number Formatting
    // ============================
    $('#phone').on('input', function () {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
            } else {
                value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
            }
        }
        $(this).val(value);
    });

    // ============================
    // Postal Code Formatting (Numbers Only)
    // ============================
    $('#postalCode').on('input', function () {
        $(this).val($(this).val().replace(/\D/g, ''));
    });

    // ============================
    // Keyboard Accessibility for Payment Methods
    // ============================
    $('.payment-label').on('keypress', function (e) {
        if (e.which === 13) { // Enter key
            $(this).find('input[type="radio"]').prop('checked', true).trigger('change');
        }
    });

    // ============================
    // Focus Management on Page Load
    // ============================
    $(window).on('load', function () {
        $('#fullName').focus();
    });
});
