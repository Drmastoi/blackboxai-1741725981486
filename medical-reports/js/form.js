// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    const clientForm = document.getElementById('clientForm');
    
    // Rich text editor functionality
    function initializeRichTextEditor() {
        const editorContainers = document.querySelectorAll('.border.rounded.bg-white');
        
        editorContainers.forEach(container => {
            const buttons = container.querySelectorAll('button');
            const textarea = container.querySelector('textarea');
            
            // Create a hidden div for rich text editing
            const editor = document.createElement('div');
            editor.className = 'w-full p-2 h-32 overflow-auto';
            editor.contentEditable = true;
            editor.style.minHeight = '8rem';
            textarea.parentNode.insertBefore(editor, textarea);
            textarea.style.display = 'none';

            // Update textarea content when editor content changes
            editor.addEventListener('input', () => {
                textarea.value = editor.innerHTML;
            });

            // Initialize formatting buttons
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const command = getCommandFromIcon(button.querySelector('i').className);
                    if (command) {
                        document.execCommand(command, false, null);
                        editor.focus();
                    }
                });
            });
        });
    }

    function getCommandFromIcon(className) {
        if (className.includes('fa-bold')) return 'bold';
        if (className.includes('fa-italic')) return 'italic';
        if (className.includes('fa-underline')) return 'underline';
        if (className.includes('fa-list')) return 'insertUnorderedList';
        if (className.includes('fa-list-ol')) return 'insertOrderedList';
        return null;
    }

    // Form validation with visual feedback
    function validateForm() {
        const required = [
            { name: 'forename', label: 'Forename', section: 'Client Detail' },
            { name: 'surname', label: 'Surname', section: 'Client Detail' },
            { name: 'dateOfBirth', label: 'Date of Birth', section: 'Client Detail' },
            { name: 'email', label: 'Email', section: 'Client Detail' },
            { name: 'gender', label: 'Gender', section: 'Client Detail' },
            { name: 'address', label: 'Address', section: 'Contact Detail' },
            { name: 'postcode', label: 'Postcode', section: 'Contact Detail' },
            { name: 'contactNo', label: 'Contact Number', section: 'Contact Detail' },
            { name: 'dateOfAccident', label: 'Date of Accident', section: 'Case Detail' },
            { name: 'hospital_record', label: 'Hospital Record Review', section: 'Case Detail' },
            { name: 'gp_record', label: 'GP Record Review', section: 'Case Detail' },
            { name: 'accidentCircumstances', label: 'Accident Circumstances', section: 'Case Detail' }
        ];

        let isValid = true;
        let errors = [];

        // Remove existing error states
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.border-red-500, .border-l-4').forEach(el => {
            el.classList.remove('border-red-500', 'bg-red-50', 'border-l-4');
        });

        // Group errors by section
        let errorsBySection = {};

        required.forEach(field => {
            const elements = document.getElementsByName(field.name);
            let value = '';

            if (elements.length > 0) {
                if (elements[0].type === 'radio') {
                    value = Array.from(elements).some(radio => radio.checked) ? 'checked' : '';
                } else {
                    value = elements[0].value;
                }
            }

            if (!value || value.trim() === '') {
                isValid = false;
                errors.push(`${field.label} is required`);

                // Group error by section
                if (!errorsBySection[field.section]) {
                    errorsBySection[field.section] = [];
                }
                errorsBySection[field.section].push(field.label);

                // Add error styling
                elements.forEach(element => {
                    const section = element.closest('.bg-purple-100');
                    if (section) {
                        section.classList.add('border-l-4', 'border-red-500');
                        const label = element.closest('div').querySelector('label');
                        if (label) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'error-message text-red-500 text-sm mt-1';
                            errorDiv.textContent = `${field.label} is required`;
                            label.parentNode.insertBefore(errorDiv, label.nextSibling);
                        }
                    }
                    if (element.type !== 'radio') {
                        element.classList.add('border-red-500', 'bg-red-50');
                    }
                });
            }
        });

        // Email validation
        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
            isValid = false;
            errors.push('Please enter a valid email address');
            emailInput.classList.add('border-red-500');
            emailInput.classList.add('bg-red-50');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-500 text-sm mt-1';
            errorDiv.textContent = 'Please enter a valid email address';
            emailInput.parentNode.appendChild(errorDiv);
        }

        if (!isValid) {
            showErrorNotification(errorsBySection);
        }

        return isValid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showErrorNotification(errorsBySection) {
        // Create a modal for better visibility
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-xl font-bold text-red-600">Please Complete Required Fields</h4>
                    <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    <p class="text-gray-600">The following fields need your attention:</p>
                    <div class="space-y-4">
                        ${Object.entries(errorsBySection).map(([section, fields]) => `
                            <div>
                                <h5 class="font-semibold text-gray-700">${section}:</h5>
                                <ul class="list-disc list-inside text-red-600 ml-4">
                                    ${fields.map(field => `<li>${field}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                    <button class="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors" 
                            onclick="this.closest('.fixed').remove()">
                        Got it
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add error indicators to fields
        required.forEach(field => {
            const elements = document.getElementsByName(field.name);
            elements.forEach(element => {
                const container = element.closest('.bg-purple-100');
                if (container) {
                    container.classList.add('border-l-4', 'border-red-500');
                }
            });
        });
    }

    // Form submission handler
    clientForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = new FormData(this);
        const data = {
            caseInstructing: {
                agency: formData.get('agency'),
                agencyRef: formData.get('agencyRef')
            },
            clientDetail: {
                title: formData.get('title'),
                gender: formData.get('gender'),
                forename: formData.get('forename'),
                surname: formData.get('surname'),
                dateOfBirth: formData.get('dateOfBirth'),
                email: formData.get('email')
            },
            contactDetail: {
                address: formData.get('address'),
                postcode: formData.get('postcode'),
                contactNo: formData.get('contactNo')
            },
            caseDetail: {
                dateOfAccident: formData.get('dateOfAccident'),
                hospitalRecord: formData.get('hospital_record'),
                gpRecord: formData.get('gp_record'),
                accidentCircumstances: formData.get('accidentCircumstances'),
                specialNote: formData.get('specialNote')
            }
        };

        // Generate PDF report
        generatePDFReport(data);
    });

    // Add input event listeners for validation
    const inputs = clientForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('border-red-500', 'bg-red-50');
            const container = this.closest('.bg-purple-100');
            if (container) {
                container.classList.remove('border-l-4', 'border-red-500');
            }
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
            // Add success indicator
            this.classList.add('border-green-500');
            setTimeout(() => this.classList.remove('border-green-500'), 1000);
        });
    });

    // Initialize rich text editor
    initializeRichTextEditor();
});
