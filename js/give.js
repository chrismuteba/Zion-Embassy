// JavaScript for the Give page

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Give page loaded');
    
    // Set up event listeners for the Give Now buttons
    setupGiveNowButtons();
    
    // Initialize the donation form
    initializeDonationForm();
});

// Set up event listeners for the Give Now buttons
function setupGiveNowButtons() {
    console.log('Setting up Give Now buttons');
    
    // Get all buttons with onclick="openGivingModal"
    const giveButtons = document.querySelectorAll('button[onclick^="openGivingModal"]');
    console.log('Found Give Now buttons:', giveButtons.length);
    
    // Add event listeners to each button
    giveButtons.forEach(button => {
        // Get the type from the onclick attribute
        const onclickAttr = button.getAttribute('onclick');
        console.log('Button onclick attribute:', onclickAttr);
        
        const match = onclickAttr.match(/openGivingModal\(['"](.+)['"]\)/);
        const type = match ? match[1] : 'tithe';
        console.log('Button type:', type);
        
        // Keep the onclick attribute for now
        // button.removeAttribute('onclick');
        
        // Add direct event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked, opening modal for type:', type);
            openGivingModal(type);
        });
    });
    
    console.log('Give Now buttons initialized');
}

// Initialize the donation form
function initializeDonationForm() {
    // Get the donation form
    const donationForm = document.getElementById('donation-form');
    
    if (donationForm) {
        // Add submit event listener
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(donationForm);
            const data = Object.fromEntries(formData);
            
            // Get selected amount
            const customAmount = document.getElementById('custom-amount').value;
            const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
            
            if (!finalAmount || finalAmount <= 0) {
                alert('Please select or enter a valid amount.');
                return;
            }
            
            if (!selectedPaymentMethod) {
                alert('Please select a payment method.');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
            submitBtn.disabled = true;
            
            // Handle different payment methods
            if (selectedPaymentMethod === 'card') {
                // Validate card details if credit/debit card is selected
                const cardNumber = document.getElementById('card-number').value;
                const cardExpiry = document.getElementById('card-expiry').value;
                const cardCvv = document.getElementById('card-cvv').value;
                
                if (!cardNumber || !cardExpiry || !cardCvv) {
                    alert('Please enter all card details to complete your donation.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Basic validation for card number format (16 digits, can have spaces)
                const cardNumberClean = cardNumber.replace(/\s+/g, '');
                if (!/^\d{16}$/.test(cardNumberClean)) {
                    alert('Please enter a valid 16-digit card number.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Basic validation for expiry date format (MM/YY)
                if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                    alert('Please enter a valid expiry date in MM/YY format.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Basic validation for CVV (3 or 4 digits)
                if (!/^\d{3,4}$/.test(cardCvv)) {
                    alert('Please enter a valid CVV code (3 or 4 digits).');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Simulate credit card processing
                setTimeout(() => {
                    alert(`Thank you for your generous gift of R${finalAmount}! Your card payment is being processed.`);
                    
                    // Reset form and close modal
                    closeGivingModal();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    console.log('Card donation submitted:', {
                        ...data,
                        amount: finalAmount,
                        frequency: selectedFrequency,
                        paymentMethod: selectedPaymentMethod
                    });
                }, 2000);
            }
            else if (selectedPaymentMethod === 'payfast') {
                // Simulate PayFast redirect
                setTimeout(() => {
                    alert(`You will now be redirected to PayFast to complete your R${finalAmount} donation.`);
                    
                    // In a real implementation, we would redirect to PayFast here
                    // window.location.href = "https://www.payfast.co.za/eng/process?...";
                    
                    // For demo purposes, just simulate success after "redirect"
                    setTimeout(() => {
                        alert("Payment successful! Thank you for your donation through PayFast.");
                        
                        // Reset form and close modal
                        closeGivingModal();
                        
                        // Reset button
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                    
                    console.log('PayFast donation initiated:', {
                        ...data,
                        amount: finalAmount,
                        frequency: selectedFrequency,
                        paymentMethod: selectedPaymentMethod
                    });
                }, 1500);
            }
            else if (selectedPaymentMethod === 'eft') {
                // For EFT, we've already shown the bank details modal
                // Just confirm and close
                setTimeout(() => {
                    alert(`Thank you! Please complete your R${finalAmount} bank transfer using the details provided.`);
                    
                    // Reset form and close modal
                    closeGivingModal();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    console.log('EFT donation initiated:', {
                        ...data,
                        amount: finalAmount,
                        frequency: selectedFrequency,
                        paymentMethod: selectedPaymentMethod
                    });
                }, 1500);
            }
        });
        
        console.log('Donation form initialized');
    }
}

// Giving form state
let selectedAmount = null;
let selectedFrequency = 'once';
let selectedPaymentMethod = null;

// Open giving modal
function openGivingModal(type) {
    console.log('Opening giving modal with type:', type);
    const modal = document.getElementById('giving-modal');
    const givingType = document.getElementById('giving-type');
    
    // Set the giving type based on button clicked
    if (type === 'tithe') {
        givingType.value = 'tithe';
    } else if (type === 'project') {
        givingType.value = 'youth-center';
    } else if (type === 'recurring') {
        selectFrequency('monthly');
    } else if (type === 'youth-center' || type === 'food-program') {
        givingType.value = type;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close giving modal
function closeGivingModal() {
    const modal = document.getElementById('giving-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('donation-form').reset();
    resetSelections();
}

// Open bank details modal
function openBankDetailsModal() {
    const modal = document.getElementById('bank-details-modal');
    modal.classList.add('active');
}

// Close bank details modal
function closeBankDetailsModal() {
    const modal = document.getElementById('bank-details-modal');
    modal.classList.remove('active');
}

// Select amount
function selectAmount(amount) {
    // Remove selected class from all amount buttons
    document.querySelectorAll('.amount-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    event.target.classList.add('selected');
    
    // Clear custom amount input
    document.getElementById('custom-amount').value = '';
    
    selectedAmount = amount;
    
    // Update hidden amount field for main.js processing
    const amountInput = document.createElement('input');
    amountInput.type = 'hidden';
    amountInput.name = 'amount';
    amountInput.value = amount;
    
    // Replace existing amount input if it exists
    const existingAmount = document.querySelector('input[name="amount"]');
    if (existingAmount) {
        existingAmount.remove();
    }
    
    document.getElementById('donation-form').appendChild(amountInput);
}

// Select frequency
function selectFrequency(frequency) {
    // Remove selected class from all frequency options
    document.querySelectorAll('[onclick^="selectFrequency"]').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.target.closest('.payment-method').classList.add('selected');
    
    selectedFrequency = frequency;
    
    // Update hidden frequency field for main.js processing
    const frequencyInput = document.createElement('input');
    frequencyInput.type = 'hidden';
    frequencyInput.name = 'frequency';
    frequencyInput.value = frequency;
    
    // Replace existing frequency input if it exists
    const existingFrequency = document.querySelector('input[name="frequency"]');
    if (existingFrequency) {
        existingFrequency.remove();
    }
    
    document.getElementById('donation-form').appendChild(frequencyInput);
}

// Select payment method
function selectPaymentMethod(method) {
    // Remove selected class from all payment methods
    document.querySelectorAll('[onclick^="selectPaymentMethod"]').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.target.closest('.payment-method').classList.add('selected');
    
    selectedPaymentMethod = method;
    
    // Update hidden payment method field for main.js processing
    const methodInput = document.createElement('input');
    methodInput.type = 'hidden';
    methodInput.name = 'payment_method';
    methodInput.value = method;
    
    // Replace existing method input if it exists
    const existingMethod = document.querySelector('input[name="payment_method"]');
    if (existingMethod) {
        existingMethod.remove();
    }
    
    document.getElementById('donation-form').appendChild(methodInput);
    
    // Get the card details section
    const cardDetailsSection = document.getElementById('card-details-section');
    
    // Show/hide card details section based on payment method
    if (method === 'card') {
        // Show card details section for credit/debit card
        cardDetailsSection.style.display = 'block';
        
        // Make card fields required
        document.getElementById('card-number').required = true;
        document.getElementById('card-expiry').required = true;
        document.getElementById('card-cvv').required = true;
    } else {
        // Hide card details section for other payment methods
        cardDetailsSection.style.display = 'none';
        
        // Make card fields not required
        document.getElementById('card-number').required = false;
        document.getElementById('card-expiry').required = false;
        document.getElementById('card-cvv').required = false;
    }
    
    // Show bank details if EFT is selected
    if (method === 'eft') {
        setTimeout(() => {
            openBankDetailsModal();
        }, 500);
    }
}

// Reset all selections
function resetSelections() {
    selectedAmount = null;
    selectedFrequency = 'once';
    selectedPaymentMethod = null;
    
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
}

// Handle custom amount input
document.addEventListener('DOMContentLoaded', function() {
    const customAmountInput = document.getElementById('custom-amount');
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            if (this.value) {
                // Remove selected class from amount buttons
                document.querySelectorAll('.amount-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                selectedAmount = parseFloat(this.value);
                
                // Update hidden amount field for main.js processing
                const amountInput = document.createElement('input');
                amountInput.type = 'hidden';
                amountInput.name = 'amount';
                amountInput.value = this.value;
                
                // Replace existing amount input if it exists
                const existingAmount = document.querySelector('input[name="amount"]');
                if (existingAmount) {
                    existingAmount.remove();
                }
                
                document.getElementById('donation-form').appendChild(amountInput);
            }
        });
    }
});

// Share church function
function shareChurch() {
    if (navigator.share) {
        navigator.share({
            title: 'The Ekklesia Zion Embassy',
            text: 'Join us for worship and fellowship at The Ekklesia Zion Embassy!',
            url: window.location.origin
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.origin;
        const text = 'Join us for worship and fellowship at The Ekklesia Zion Embassy! ' + url;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Church information copied to clipboard!');
            });
        } else {
            // Further fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Church information copied to clipboard!');
        }
    }
}

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'giving-modal') {
                closeGivingModal();
            } else if (e.target.id === 'bank-details-modal') {
                closeBankDetailsModal();
            }
        }
    });
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Trigger animations for elements in view
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});