(() => {
  const PLANS = {
    arcade: { name: "Arcade", monthly: 9, yearly: 90 },
    advanced: { name: "Advanced", monthly: 12, yearly: 120 },
    pro: { name: "Pro", monthly: 15, yearly: 150 },
  };

  const ADDONS = {
    online: { name: "Online service", monthly: 1, yearly: 10 },
    storage: { name: "Larger storage", monthly: 2, yearly: 20 },
    profile: { name: "Customizable profile", monthly: 2, yearly: 20 },
  };

  const form = document.getElementById("msForm");
  const shell = document.querySelector(".form-shell");
  const panels = Array.from(document.querySelectorAll(".step-panel"));
  const stepItems = Array.from(document.querySelectorAll(".step"));
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const billingToggle = document.getElementById("billingToggle");
  const billingWrap = document.querySelector(".billing-toggle");
  const plansWrap = document.querySelector(".plans");
  const planError = document.getElementById("plan-error");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  let currentStep = 1;
  const TOTAL_FORM_STEPS = 4;

  function billingPeriod() {
    return billingToggle.checked ? "yearly" : "monthly";
  }

  function selectedPlan() {
    const checked = form.querySelector('input[name="plan"]:checked');
    return checked ? checked.value : null;
  }

  function selectedAddons() {
    return Array.from(form.querySelectorAll('input[name="addon"]:checked')).map((el) => el.value);
  }

  function renderPlanPrices() {
    const period = billingPeriod();
    plansWrap.classList.toggle("show-yearly-free", period === "yearly");
    document.querySelectorAll(".plan-card").forEach((card) => {
      const value = card.querySelector('input[name="plan"]').value;
      const plan = PLANS[value];
      const priceEl = card.querySelector(".plan-price");
      priceEl.textContent = period === "yearly" ? `$${plan.yearly}/yr` : `$${plan.monthly}/mo`;
    });
  }

  function renderAddonPrices() {
    const period = billingPeriod();
    document.querySelectorAll(".addon-card").forEach((card) => {
      const value = card.querySelector('input[name="addon"]').value;
      const addon = ADDONS[value];
      const priceEl = card.querySelector(".addon-price");
      priceEl.textContent = period === "yearly" ? `+$${addon.yearly}/yr` : `+$${addon.monthly}/mo`;
    });
  }

  billingToggle.addEventListener("change", () => {
    billingWrap.classList.toggle("yearly", billingToggle.checked);
    renderPlanPrices();
    renderAddonPrices();
  });

  function updateStepIndicator() {
    stepItems.forEach((item) => {
      const step = Number(item.dataset.step);
      item.classList.toggle("active", step === Math.min(currentStep, TOTAL_FORM_STEPS));
    });
  }

  function showStep(step) {
    panels.forEach((panel) => {
      panel.hidden = Number(panel.dataset.step) !== step;
    });

    shell.classList.remove("on-step-1", "on-step-2", "on-step-3", "on-step-4", "on-step-5");
    shell.classList.add(`on-step-${step}`);

    nextBtn.textContent = step === TOTAL_FORM_STEPS ? "Confirm" : "Next Step";
    updateStepIndicator();

    const activePanel = panels.find((panel) => !panel.hidden);
    const heading = activePanel && activePanel.querySelector("h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function setFieldError(input, errorEl, message) {
    errorEl.textContent = message;
    input.classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateStep1() {
    let valid = true;

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, document.getElementById("name-error"), "This field is required");
      valid = false;
    } else {
      setFieldError(nameInput, document.getElementById("name-error"), "");
    }

    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      setFieldError(emailInput, document.getElementById("email-error"), "This field is required");
      valid = false;
    } else if (!emailPattern.test(emailValue)) {
      setFieldError(emailInput, document.getElementById("email-error"), "Please enter a valid email");
      valid = false;
    } else {
      setFieldError(emailInput, document.getElementById("email-error"), "");
    }

    if (!phoneInput.value.trim()) {
      setFieldError(phoneInput, document.getElementById("phone-error"), "This field is required");
      valid = false;
    } else {
      setFieldError(phoneInput, document.getElementById("phone-error"), "");
    }

    return valid;
  }

  function validateStep2() {
    const plan = selectedPlan();
    if (!plan) {
      planError.textContent = "Please select a plan";
      plansWrap.classList.add("invalid");
      return false;
    }
    planError.textContent = "";
    plansWrap.classList.remove("invalid");
    return true;
  }

  function clearStep2Error() {
    if (selectedPlan()) {
      planError.textContent = "";
      plansWrap.classList.remove("invalid");
    }
  }

  function syncSelectedCard(input) {
    const card = input.closest(".plan-card, .addon-card");
    if (card) card.classList.toggle("is-selected", input.checked);
  }

  form.querySelectorAll('input[name="plan"]').forEach((el) => {
    el.addEventListener("change", () => {
      clearStep2Error();
      form.querySelectorAll('input[name="plan"]').forEach(syncSelectedCard);
    });
  });

  form.querySelectorAll('input[name="addon"]').forEach((el) => {
    el.addEventListener("change", () => syncSelectedCard(el));
  });

  [nameInput, emailInput, phoneInput].forEach((input) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid") && input.value.trim()) {
        setFieldError(input, document.getElementById(`${input.id}-error`), "");
      }
    });
  });

  function renderSummary() {
    const period = billingPeriod();
    const planKey = selectedPlan();
    const plan = PLANS[planKey];
    const periodLabel = period === "yearly" ? "Yearly" : "Monthly";
    const unit = period === "yearly" ? "yr" : "mo";

    document.getElementById("summary-plan-name").textContent = `${plan.name} (${periodLabel})`;
    document.getElementById("summary-plan-price").textContent = `$${plan[period]}/${unit}`;

    const addonsList = document.getElementById("summary-addons");
    addonsList.innerHTML = "";
    let addonsTotal = 0;

    selectedAddons().forEach((key) => {
      const addon = ADDONS[key];
      addonsTotal += addon[period];
      const li = document.createElement("li");
      li.innerHTML = `<span>${addon.name}</span><span>+$${addon[period]}/${unit}</span>`;
      addonsList.appendChild(li);
    });

    const total = plan[period] + addonsTotal;
    document.getElementById("summary-total-period").textContent = period === "yearly" ? "per year" : "per month";
    document.getElementById("summary-total-price").textContent =
      period === "yearly" ? `$${total}/yr` : `+$${total}/mo`;
  }

  function goToStep(step) {
    currentStep = step;
    if (step <= TOTAL_FORM_STEPS) {
      showStep(step);
    } else {
      showStep(5);
    }
  }

  backBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  document.getElementById("changePlanBtn").addEventListener("click", () => {
    goToStep(2);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (currentStep === 1) {
      if (!validateStep1()) return;
      goToStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      goToStep(3);
    } else if (currentStep === 3) {
      renderSummary();
      goToStep(4);
    } else if (currentStep === 4) {
      goToStep(5);
    }
  });

  renderPlanPrices();
  renderAddonPrices();
  showStep(1);
})();
