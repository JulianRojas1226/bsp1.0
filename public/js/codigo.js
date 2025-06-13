document.querySelector('.password-toggle').addEventListener("click", togglePassword);

function togglePassword() {
    const passwordInput = document.getElementById('nuevaContrasena');
    const toggleIcon = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}z|

        function checkPasswordStrength(password) {
            let strength = 0;
            const requirements = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /\d/.test(password)
            };

            // Update requirement indicators
            document.getElementById('length-req').classList.toggle('met', requirements.length);
            document.getElementById('uppercase-req').classList.toggle('met', requirements.uppercase);
            document.getElementById('lowercase-req').classList.toggle('met', requirements.lowercase);
            document.getElementById('number-req').classList.toggle('met', requirements.number);

            // Calculate strength
            Object.values(requirements).forEach(req => {
                if (req) strength++;
            });

            // Update strength bar
            const strengthBar = document.querySelector('.strength-bar');
            const strengthIndicator = document.querySelector('.password-strength');
            
            if (password.length > 0) {
                strengthIndicator.classList.add('active');
                strengthBar.className = 'strength-bar';
                
                if (strength === 1) strengthBar.classList.add('strength-weak');
                else if (strength === 2) strengthBar.classList.add('strength-fair');
                else if (strength === 3) strengthBar.classList.add('strength-good');
                else if (strength === 4) strengthBar.classList.add('strength-strong');
            } else {
                strengthIndicator.classList.remove('active');
            }

            // Enable/disable submit button
            const submitBtn = document.getElementById('submit-btn');
            const allRequirementsMet = Object.values(requirements).every(req => req);
            submitBtn.disabled = !allRequirementsMet;

            return strength;
        }

        document.getElementById('nuevaContrasena').addEventListener('input', function(e) {
            checkPasswordStrength(e.target.value);
        });

        // Update requirement icons
        document.querySelectorAll('.requirement-icon').forEach(icon => {
            icon.textContent = '✗';
        });