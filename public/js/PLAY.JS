document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('loginForm');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const inputs = document.querySelectorAll('.form-input');
            const rememberCheck = document.getElementById('rememberCheck');

            // Efectos en inputs
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'translateY(-2px)';
                    this.parentElement.style.transition = 'transform 0.3s ease';
                });

                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'translateY(0)';
                });

                // Validación visual
                input.addEventListener('input', function() {
                    const icon = this.nextElementSibling;
                    if (this.value.length > 0) {
                        icon.style.color = 'var(--primary-color)';
                        this.style.borderColor = 'var(--primary-color)';
                    } else {
                        icon.style.color = 'var(--third-color)';
                        this.style.borderColor = 'var(--quarter-color)';
                    }
                });
            });

            // Checkbox personalizado
            rememberCheck.addEventListener('click', function() {
                this.classList.toggle('checked');
            });

            // Envío del formulario
            form.addEventListener('submit', function(e) {
                submitBtn.classList.add('loading');
                btnText.style.opacity = '0';
                
                // Simular proceso de autenticación
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    btnText.style.opacity = '1';
                }, 2500);
            });

            // Navegación con Enter
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const activeElement = document.activeElement;
                    if (activeElement.classList.contains('form-input')) {
                        const inputs = Array.from(document.querySelectorAll('.form-input'));
                        const currentIndex = inputs.indexOf(activeElement);
                        
                        if (currentIndex < inputs.length - 1) {
                            inputs[currentIndex + 1].focus();
                        } else {
                            submitBtn.click();
                        }
                    }
                }
            });

            // Efecto de ondas en el botón
            submitBtn.addEventListener('click', function(e) {
                if (!this.classList.contains('loading')) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.6);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                        pointer-events: none;
                    `;
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                }
            });

            // Agregar animación de ripple al CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);})