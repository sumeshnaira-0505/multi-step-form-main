# Frontend Mentor - Multi-step form solution

This is a solution to the [Multi-step form challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users can:

- Complete each step of the sequence
- Go back to a previous step to update their selections
- See a summary of their selections on the final step and confirm their order
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Receive form validation messages if:
  - A field has been missed
  - The email address is not formatted correctly
  - A step is submitted, but no selection has been made

### Screenshot

![Multi-step form screenshot](./preview.jpg)

### Links

- Solution URL: [github.com/sumeshnaira-0505](https://github.com/sumeshnaira-0505)
- Live Site URL: [sumeshnaira-0505.github.io/sumesh-portfolio](https://sumeshnaira-0505.github.io/sumesh-portfolio/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- CSS Grid & Flexbox
- Mobile-first responsive workflow
- Vanilla JavaScript (no frameworks or build tools)

### What I learned

The trickiest part of this challenge was reconciling two very different layouts (a floating card overlapping a top banner on mobile, vs. a sidebar-and-content layout on desktop) using a single DOM structure. `grid-template-areas` made this manageable: the sidebar, main content, and nav buttons are defined as named grid areas, and the desktop media query just re-maps those names to a different `grid-template-columns`/`grid-template-rows` layout instead of duplicating markup:

```css
.form-shell {
  display: grid;
  grid-template-areas:
    "sidebar"
    "main"
    "nav";
}

@media (min-width: 46.25rem) {
  .form-shell {
    grid-template-columns: 17.125rem 1fr;
    grid-template-areas:
      "sidebar main"
      "sidebar nav";
  }
}
```

One catch: this only works for elements that are *direct children* of the grid container — `grid-area` has no effect on nested descendants, so the nav buttons had to live as a sibling of the sidebar and main content, wired back to the form with the `form="msForm"` attribute on the submit button rather than being physically nested inside the `<form>`.

For the step logic, I kept state in a single `currentStep` variable and toggled `hidden` on each step's `<section>`, driving validation, the billing-period price recalculation, and the dynamic summary from plain functions rather than a framework — enough for a form this size without adding unnecessary tooling.

## Author

- GitHub - [@sumeshnaira-0505](https://github.com/sumeshnaira-0505)
- Frontend Mentor - [@sumeshnaira-0505](https://www.frontendmentor.io/profile/sumeshnaira-0505)
