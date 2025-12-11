// script/newsletter.js — Handle newsletter form submit interactions with event delegation
(function () {
  "use strict";

  // Use event delegation to handle dynamically injected forms
  document.addEventListener("submit", function (e) {
    const form = e.target;
    
    // Check if this is a newsletter form
    if (!form.classList.contains("newsletter-form")) {
      return;
    }

    e.preventDefault();
    console.log("Newsletter form submitted!");

    const submitBtn = form.querySelector(".btn-subscribe");
    const emailInput = form.querySelector('input[name="email"]');

    if (!submitBtn || !emailInput) {
      console.warn("Submit button or email input not found");
      return;
    }

    // Validate email
    if (!emailInput.value.trim()) {
      console.warn("Email input is empty");
      return;
    }

    // Prevent double clicks
    if (submitBtn.classList.contains("subscribing") || submitBtn.classList.contains("subscribed")) {
      console.warn("Already in subscribing or subscribed state");
      return;
    }

    console.log("Changing button to subscribing state");
    // Step 1: Change to "Subscribing..." with yellow text
    submitBtn.classList.add("subscribing");
    submitBtn.textContent = "Subscribing...";
    submitBtn.disabled = true;

    // Step 2: After 2 seconds, change to green background with "Subscribed" and tick
    const timer2 = setTimeout(() => {
      console.log("Changing button to subscribed state");
      submitBtn.classList.remove("subscribing");
      submitBtn.classList.add("subscribed");
      submitBtn.innerHTML = '✓ Subscribed';
    }, 2000);

    // Step 3: Reset after 3 more seconds
    const timer3 = setTimeout(() => {
      console.log("Resetting button");
      submitBtn.classList.remove("subscribed");
      submitBtn.textContent = "Subscribe";
      submitBtn.disabled = false;
      emailInput.value = "";
    }, 5000);
  }, true); // Use capture phase for better event handling

})();
