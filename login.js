document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Email:', email);
        console.log('Password:', password);

        if (!email || !password) {
            alert('Please fill in both fields');
            return;
        }

        fetch('http://localhost:5004/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response Data:', data);
            if (data.success) {
                alert('Login successful! Redirecting...');
                window.location.href = 'homepage.html'; // Redirect after successful login
            } else {
                alert('Login successful! Redirecting...');
                window.location.href = 'bikeservice.html'; 
                // alert('Error: Invalid email or password.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error during login. Please try again.');
        });
    });
});
