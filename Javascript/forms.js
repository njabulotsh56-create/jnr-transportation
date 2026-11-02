// ===== Shared validation helpers =====
const RECIPIENT = 'info@jnrtransportation.co.za';

function showError(input, message) {
    document.getElementById(input.id + '-error').textContent = message;
    input.classList.add('invalid');
}

function clearErrors(form) {
    form.querySelectorAll('.error').forEach(span => span.textContent = '');
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

function validateCommon(form) {
    let valid = true;
    const f = form.elements;

    if (f.name.value.trim().length < 2) {
        showError(f.name, 'Please enter your full name (at least 2 characters).');
        valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) {
        showError(f.email, 'Please enter a valid email address.');
        valid = false;
    }
    const phone = f.phone.value.replace(/\s/g, '');
    if (!/^(\+27|0)[0-9]{9}$/.test(phone)) {
        showError(f.phone, 'Enter a valid SA number, e.g. 0821234567 or +27821234567.');
        valid = false;
    }
    return valid;
}

// ===== Enquiry form =====
const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) {
    const result = document.getElementById('enquiry-result');
    enquiryForm.elements.date.min = new Date().toISOString().split('T')[0];

    enquiryForm.addEventListener('submit', async e => {
        e.preventDefault();
        clearErrors(enquiryForm);
        result.replaceChildren();

        const f = enquiryForm.elements;
        let valid = validateCommon(enquiryForm);

        if (f.trip.value === '') {
            showError(f.trip, 'Please choose a trip type.');
            valid = false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!f.date.value || new Date(f.date.value) < today) {
            showError(f.date, 'Please choose today or a future date.');
            valid = false;
        }
        const people = Number(f.passengers.value);
        if (!Number.isInteger(people) || people < 1 || people > 60) {
            showError(f.passengers, 'Enter between 1 and 60 passengers.');
            valid = false;
        }
        if (!valid) return;

        // AJAX: fetch the prices without reloading the page
        try {
           const response = await fetch('data/items.json');
if (!response.ok) throw new Error('Could not load items.json (status ' + response.status + ')');
const items = await response.json();
const trip = items.find(item => item.name === f.trip.value);
if (!trip) throw new Error('No price found for trip type: "' + f.trip.value + '"');
const total = trip.price * people;

            const heading = document.createElement('h3');
            heading.textContent = 'Thank you, ' + f.name.value.trim() + '!';

            const cost = document.createElement('p');
            cost.textContent = 'Estimated cost for ' + people + ' passenger(s) on ' +
                trip.name + ': R' + total + '.';

            const availability = document.createElement('p');
            availability.textContent = people > 15
                ? 'Large group: we will confirm availability by email within 24 hours.'
                : 'Good news, we have space available on ' + f.date.value + '.';

            result.append(heading, cost, availability);
            enquiryForm.reset();
        } catch (error) {
            result.textContent = 'Sorry, we could not calculate your quote. Please try again.';
            console.error(error);
        }
    });
}

// ===== Contact form =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const preview = document.getElementById('email-preview');
    const previewText = document.getElementById('preview-text');
    const sendButton = document.getElementById('send-email');
    const counter = document.getElementById('char-count');
    const msg = contactForm.elements.message;
    let mailtoLink = '';

    msg.addEventListener('input', () => {
        counter.textContent = msg.value.length;
    });

    contactForm.addEventListener('submit', e => {
        action="data/items.json" 
        clearErrors(contactForm);
        preview.hidden = true;

        const f = contactForm.elements;
        let valid = validateCommon(contactForm);

        if (f.type.value === '') {
            showError(f.type, 'Please choose a message type.');
            valid = false;
        }
        if (msg.value.trim().length < 10) {
            showError(msg, 'Your message must be at least 10 characters.');
            valid = false;
        }
        if (!valid) return;

        const subject = f.type.value + ' from ' + f.name.value.trim();
        const body = 'Name: ' + f.name.value.trim() +
            '\nEmail: ' + f.email.value.trim() +
            '\nPhone: ' + f.phone.value.trim() +
            '\nType: ' + f.type.value +
            '\n\n' + msg.value.trim();

        previewText.textContent = 'To: ' + RECIPIENT + '\nSubject: ' + subject + '\n\n' + body;
        mailtoLink = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
        preview.hidden = false;
    });

    sendButton.addEventListener('click', () => {
        window.location.href = mailtoLink;
    });
}