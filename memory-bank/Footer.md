# `src/components/Footer.tsx` Context File

## Purpose
This file defines the `Footer` component, which provides consistent branding, quick links, and social media connections at the bottom of every public-facing page in the e-commerce application.

## Key Components/Functions
- **`Footer` Component:** A functional React component that renders the footer section of the application.
- **Sections:**
    - **Brand Information:** Displays the "NexBuy" brand name and a short description.
    - **Quick Links:** Provides navigation links to important pages like "About Us", "Contact Us", "Privacy Policy", and "Terms of Service" using `react-router-dom`'s `Link` component for client-side navigation.
    - **Follow Us:** Contains social media icons (Facebook, Twitter, Instagram) that link to external social media profiles.
- **Copyright Information:** Displays the current year and copyright notice for NexBuy.

## Dependencies
- `react`: Core React library.
- `lucide-react`: Icon library (`Facebook`, `Twitter`, `Instagram`).
- `react-router-dom`: For internal navigation links (`Link`).
- `./Footer.css`: Custom CSS for styling the footer.
