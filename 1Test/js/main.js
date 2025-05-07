document.addEventListener('DOMContentLoaded', function () {
    // Элементы модального окна
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const getStartedBtn = document.querySelector('.hero__cta');
    const hotlineNumber = document.getElementById('hotlineNumber');
    const contactForm = document.getElementById('contactForm');

    // Открытие модального окна
    getStartedBtn.addEventListener('click', function (e) {
        e.preventDefault();
        modalOverlay.classList.add('active');
        generateHotlineNumber();
        loadSavedData();
    });

    // Закрытие модального окна
    modalClose.addEventListener('click', function () {
        modalOverlay.classList.remove('active');
    });

    // Закрытие по клику на оверлей
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    // Генерация случайного номера горячей линии
    function generateHotlineNumber() {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        hotlineNumber.textContent = `#${randomNumber}`;
        hotlineNumber.classList.add('hotline-animate');

        // Удаляем класс анимации после завершения
        setTimeout(() => {
            hotlineNumber.classList.remove('hotline-animate');
        }, 500);
    }

    // Загрузка сохраненных данных
    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('contactFormData')) || {};
        document.getElementById('modalName').value = savedData.name || '';
        document.getElementById('modalEmail').value = savedData.email || '';
        document.getElementById('modalDate').value = savedData.date || '';
    }

    // Сохранение данных формы
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('modalName').value,
            email: document.getElementById('modalEmail').value,
            date: document.getElementById('modalDate').value,
            hotline: hotlineNumber.textContent,
            timestamp: new Date().toISOString()
        };

        // Сохраняем в localStorage
        localStorage.setItem('contactFormData', JSON.stringify(formData));

        // Имитация отправки на сервер
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Form submitted:', data);
                showSuccessMessage();
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorMessage();
            });
    });

    // Показать сообщение об успехе
    function showSuccessMessage() {
        const successMsg = document.createElement('div');
        successMsg.className = 'modal__success';
        successMsg.innerHTML = `
            <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>Your request has been submitted successfully!</p>
        `;

        const modalContent = document.querySelector('.modal');
        modalContent.innerHTML = '';
        modalContent.appendChild(successMsg);

        setTimeout(() => {
            modalOverlay.classList.remove('active');
            // Восстанавливаем исходное содержимое модального окна
            setTimeout(() => {
                modalContent.innerHTML = `
                    <button class="modal__close" id="modalClose">&times;</button>
                    <h3 class="modal__title">Hotline Connection</h3>
                    <div class="modal__hotline">
                        <span>Your hotline number:</span>
                        <strong id="hotlineNumber">${hotlineNumber.textContent}</strong>
                    </div>
                    <form class="modal__form" id="contactForm">
                        <div class="modal__form-group">
                            <input type="text" id="modalName" name="name" placeholder="Full Name" required>
                        </div>
                        <div class="modal__form-group">
                            <input type="email" id="modalEmail" name="email" placeholder="Email" required>
                        </div>
                        <div class="modal__form-group">
                            <input type="date" id="modalDate" name="date" required>
                        </div>
                        <button type="submit" class="modal__submit">Confirm Booking</button>
                    </form>
                `;
                // Перепривязываем события
                document.getElementById('modalClose').addEventListener('click', function () {
                    modalOverlay.classList.remove('active');
                });
                document.getElementById('contactForm').addEventListener('submit', contactForm.onsubmit);
            }, 300);
        }, 2000);
    }

    // Показать сообщение об ошибке
    function showErrorMessage() {
        alert('There was an error submitting your request. Please try again later.');
    }

    // Добавляем анимацию при наведении на кнопки и ссылки
    const buttons = document.querySelectorAll('button, a[href]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});