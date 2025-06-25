 let timeLeft = 5;
        const countdownElement = document.getElementById('countdown');
        
        const timer = setInterval(() => {
            timeLeft--;
            countdownElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                countdownElement.textContent = '0';
            }
        }, 1000);