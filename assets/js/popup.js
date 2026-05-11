 (function() {
            // ---------- DOM Elements ----------
            const modal = document.getElementById('inquiryModal');
            const modalContainer = document.getElementById('modalContainer');
            const closeModalBtn2 = document.getElementById('closeModalBtn');
            const form = document.getElementById('inquiryForm');
            const mobileInput = document.getElementById('mobile');
            const fullNameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const mobileErrorDiv = document.getElementById('mobileError');
            const nameErrorDiv = document.getElementById('nameError');
            const emailErrorDiv = document.getElementById('emailError');
            const statusMessageDiv = document.getElementById('formStatusMessage');
            const submitBtn = document.getElementById('submitBtn');
            const submitTextSpan = document.getElementById('submitText');
            const submitLoaderSpan = document.getElementById('submitLoader');
            
            // Helper: reset all validation errors & global status
            function resetFormErrors() {
                mobileErrorDiv.classList.add('hidden');
                mobileErrorDiv.innerText = '';
                nameErrorDiv.classList.add('hidden');
                nameErrorDiv.innerText = '';
                emailErrorDiv.classList.add('hidden');
                emailErrorDiv.innerText = '';
                // also clear status message style
                statusMessageDiv.classList.add('hidden');
                statusMessageDiv.innerHTML = '';
                statusMessageDiv.className = 'mb-4 text-sm rounded-lg hidden transition-all';
                // remove any extra border red highlighting
                [mobileInput, fullNameInput, emailInput].forEach(inp => {
                    inp.classList.remove('border-red-500', 'focus:ring-red-200');
                    inp.classList.add('border-gray-300');
                });
            }
            
            // Clear form fields
            function resetFormFields() {
                mobileInput.value = '';
                fullNameInput.value = '';
                emailInput.value = '';
            }
            
            // display custom status (error, success, info)
            function showStatus(message, type = 'error') {
                statusMessageDiv.classList.remove('hidden', 'bg-green-50', 'text-green-800', 'border-green-200', 'bg-red-50', 'text-red-700', 'border-red-200', 'bg-blue-50', 'text-blue-800');
                if (type === 'success') {
                    statusMessageDiv.classList.add('bg-green-50', 'text-green-800', 'border', 'border-green-200');
                    statusMessageDiv.innerHTML = `<div class="flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>${message}</div>`;
                } else if (type === 'error') {
                    statusMessageDiv.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
                    statusMessageDiv.innerHTML = `<div class="flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>${message}</div>`;
                } else {
                    statusMessageDiv.classList.add('bg-blue-50', 'text-blue-800');
                    statusMessageDiv.innerHTML = message;
                }
            }
            
            // validation logic (returns isValid and sets inline errors)
            function validateForm() {
                let isValid = true;
                // Reset previous dynamic errors
                resetFormErrors();
                
                // 1. Mobile: exactly 10 digits
                const mobile = mobileInput.value.trim();
                const mobileRegex = /^\d{10}$/;
                if (!mobile) {
                    mobileErrorDiv.innerText = 'Mobile number is required.';
                    mobileErrorDiv.classList.remove('hidden');
                    mobileInput.classList.add('border-red-500');
                    isValid = false;
                } else if (!mobileRegex.test(mobile)) {
                    mobileErrorDiv.innerText = 'Enter a valid 10-digit mobile number (only digits).';
                    mobileErrorDiv.classList.remove('hidden');
                    mobileInput.classList.add('border-red-500');
                    isValid = false;
                } else {
                    mobileInput.classList.remove('border-red-500');
                }
                
                // 2. Full Name: required, min 2 characters, letters/spaces allowed but at least 2 non-trimmed
                const fullName = fullNameInput.value.trim();
                if (!fullName) {
                    nameErrorDiv.innerText = 'Full name is required.';
                    nameErrorDiv.classList.remove('hidden');
                    fullNameInput.classList.add('border-red-500');
                    isValid = false;
                } else if (fullName.length < 2) {
                    nameErrorDiv.innerText = 'Name must be at least 2 characters.';
                    nameErrorDiv.classList.remove('hidden');
                    fullNameInput.classList.add('border-red-500');
                    isValid = false;
                } else {
                    fullNameInput.classList.remove('border-red-500');
                }
                
                // 3. Email: required, basic email format
                const email = emailInput.value.trim();
                const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
                if (!email) {
                    emailErrorDiv.innerText = 'Email address is required.';
                    emailErrorDiv.classList.remove('hidden');
                    emailInput.classList.add('border-red-500');
                    isValid = false;
                } else if (!emailRegex.test(email)) {
                    emailErrorDiv.innerText = 'Please enter a valid email (e.g., name@domain.com).';
                    emailErrorDiv.classList.remove('hidden');
                    emailInput.classList.add('border-red-500');
                    isValid = false;
                } else {
                    emailInput.classList.remove('border-red-500');
                }
                
                return isValid;
            }
            
            // ---- API Call + LOCAL DATABASE (localStorage) simulation ----
            // This function will:
            // 1. Perform a POST request to a mock API endpoint (JSONPlaceholder) to simulate external API call
            // 2. On success, also store the data in localStorage under 'inquiries_DB' (simulate database)
            // 3. Return promise with success or error
            async function saveToApiAndDatabase(inquiryData) {
                // inquiryData: { mobile, fullName, email }
                // mock API endpoint (works for tests, returns 201 created)
                const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';
                // payload that looks legit
                const payload = {
                    mobile: inquiryData.mobile,
                    fullName: inquiryData.fullName,
                    email: inquiryData.email,
                    submittedAt: new Date().toISOString(),
                    source: 'blue_inquire_popup'
                };
                
                // Simulate network delay (500ms to feel realistic)
                // ACTUAL API FETCH
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`API responded with status ${response.status}. Could not save remotely.`);
                }
                const apiResult = await response.json();
                // After successful API call, we also store data in localStorage (database simulation)
                // Retrieve existing 'inquiries_db' or create new array
                let db = localStorage.getItem('inquiries_db');
                let inquiriesArray = [];
                if (db) {
                    try {
                        inquiriesArray = JSON.parse(db);
                        if (!Array.isArray(inquiriesArray)) inquiriesArray = [];
                    } catch(e) { inquiriesArray = []; }
                }
                // Create new record with unique id and timestamp
                const newRecord = {
                    id: Date.now() + Math.floor(Math.random() * 10000),
                    ...inquiryData,
                    apiReferenceId: apiResult.id || 'mock_id',
                    createdAt: new Date().toISOString()
                };
                inquiriesArray.push(newRecord);
                localStorage.setItem('inquiries_db', JSON.stringify(inquiriesArray));
                // Return success with record count for fun
                return { success: true, recordCount: inquiriesArray.length, apiId: apiResult.id };
            }
            
            // Submit handler with loading, validations, API saving, and user messages
            async function onSubmitHandler(event) {
                event.preventDefault();
                
                // Reset global status message and previous API errors
                statusMessageDiv.classList.add('hidden');
                // validate before any API call
                const isValid = validateForm();
                if (!isValid) {
                    // scroll to first error softly
                    const firstError = document.querySelector('.text-red-500:not(.hidden)');
                    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
                
                // Gather data
                const mobileVal = mobileInput.value.trim();
                const fullNameVal = fullNameInput.value.trim();
                const emailVal = emailInput.value.trim();
                
                // Disable submit button and show loader
                submitBtn.disabled = true;
                submitTextSpan.classList.add('opacity-70');
                submitLoaderSpan.classList.remove('hidden');
                
                try {
                    // Call API + Database storage
                    const result = await saveToApiAndDatabase({
                        mobile: mobileVal,
                        fullName: fullNameVal,
                        email: emailVal
                    });
                    
                    // Success scenario
                    showStatus(`✅ Inquiry saved successfully! API call succeeded, and data stored in database. (Record #${result.recordCount})`, 'success');
                    // Clear the form fields after success
                    resetFormFields();
                    // reset validation errors (clear any leftover borders)
                    resetFormErrors();
                    // Optionally reset loader and enable button but keep success visible for user
                    // auto clear success message after 4 seconds? but user can close modal, anyway fine.
                    // Keep success for a while, but on next open modal it is cleared anyway.
                    // also we can remove success message after 5 seconds but keep main form.
                    setTimeout(() => {
                        if (statusMessageDiv && !statusMessageDiv.classList.contains('hidden') && statusMessageDiv.innerText.includes('✅')) {
                            // fade but not mandatory, user may close modal manually
                            statusMessageDiv.classList.add('opacity-75');
                        }
                    }, 4000);
                } catch (error) {
                    console.error('API / DB Error:', error);
                    let errorMsg = error.message || 'Network or server error. Failed to save data.';
                    showStatus(`❌ ${errorMsg} Please check connection or try again.`, 'error');
                } finally {
                    // Re-enable submit button and hide loader
                    submitBtn.disabled = false;
                    submitTextSpan.classList.remove('opacity-70');
                    submitLoaderSpan.classList.add('hidden');
                }
            }
            
            // Attach form submit event
            form.addEventListener('submit', onSubmitHandler);
            
            // ---------- MODAL OPEN / CLOSE Logic (for any .open-inquire-btn) ----------
            function openModal() {
                // Reset any previous data, status, errors, fields to fresh state
                resetFormFields();
                resetFormErrors();
                // clear status message and inner
                statusMessageDiv.classList.add('hidden');
                statusMessageDiv.innerHTML = '';
                // ensure no leftover loading state
                submitBtn.disabled = false;
                submitTextSpan.classList.remove('opacity-70');
                submitLoaderSpan.classList.add('hidden');
                // show modal with animation
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                // Add small animation to container
                setTimeout(() => {
                    modalContainer.classList.remove('scale-95', 'opacity-0');
                    modalContainer.classList.add('scale-100', 'opacity-100');
                }, 10);
                document.body.classList.add('modal-open');
                // Attach escape key listener when open
                document.addEventListener('keydown', escapeHandler);
            }
            
            function closeModal() {
                // Animate out
                modalContainer.classList.add('scale-95', 'opacity-0');
                modalContainer.classList.remove('scale-100', 'opacity-100');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.classList.remove('modal-open');
                }, 180);
                document.removeEventListener('keydown', escapeHandler);
            }
            
            function escapeHandler(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            }
            
            // Close on backdrop click (but only if clicked on modal background, not on modalContainer)
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            closeModalBtn2.addEventListener('click', closeModal);
            
            // attach open trigger to all existing and future elements with class "open-inquire-btn"
            function bindOpenButtons() {
                const btns = document.querySelectorAll('.open-inquire-btn');
                btns.forEach(btn => {
                    // remove previous listener to avoid duplicates (if any)
                    btn.removeEventListener('click', openModalHandler);
                    btn.addEventListener('click', openModalHandler);
                });
            }
            
            function openModalHandler(e) {
                e.preventDefault();
                openModal();
            }
            
            // initial binding
            bindOpenButtons();
            
            // if new elements are added dynamically later (rare but dynamic content may exist),
            // we can observe but given demo it's static; but providing MutationObserver for robust
            const observer = new MutationObserver(() => {
                bindOpenButtons();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            // also optional: on modal open focus trap (first input ) - accessibility
            modal.addEventListener('transitionend', (e) => {
                if (!modal.classList.contains('hidden') && e.target === modalContainer) {
                    mobileInput.focus();
                }
            });
            
            // Ensure that if user clicks on the backdrop, we close correctly
            // already handled
            
            // minor touch: clear status on input focus to not annoy
            [mobileInput, fullNameInput, emailInput].forEach(inp => {
                inp.addEventListener('focus', () => {
                    if (statusMessageDiv && !statusMessageDiv.classList.contains('hidden')) {
                        // optional but not required to hide auto, keep for clarity, we don't force hide
                    }
                });
            });
            
            // style: display stored db info in console for demonstration (dev)
            console.log("✨ Blue theme inquiry popup ready. Use any .open-inquire-btn to trigger. Data stored in localStorage under 'inquiries_db'");
        })();
   