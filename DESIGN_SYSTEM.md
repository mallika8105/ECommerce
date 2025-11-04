# NexBuy Design System

A comprehensive design system for the NexBuy e-commerce platform.

## 🎨 Color Palette

### Primary Colors (Blue)

Professional and trustworthy blue palette for primary actions and branding.

```css
primary-50:  #eff6ff (Very Light)
primary-100: #dbeafe
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #3b82f6 ← Main Primary Color
primary-600: #2563eb
primary-700: #1d4ed8
primary-800: #1e40af
primary-900: #1e3a8a (Very Dark)
```

**Usage:**

- Primary buttons
- Links
- Active states
- Important CTAs

### Secondary Colors (Emerald Green)

Fresh and energetic green for secondary actions and success states.

```css
secondary-50:  #ecfdf5
secondary-100: #d1fae5
secondary-200: #a7f3d0
secondary-300: #6ee7b7
secondary-400: #34d399
secondary-500: #10b981 ← Main Secondary Color
secondary-600: #059669
secondary-700: #047857
secondary-800: #065f46
secondary-900: #064e3b
```

**Usage:**

- Secondary buttons
- Success messages
- Positive indicators
- Highlights

### Neutral Colors (Gray)

Clean, modern grays for text, backgrounds, and UI elements.

```css
gray-50:  #f9fafb (Very Light - Backgrounds)
gray-100: #f3f4f6 (Light - Hover states)
gray-200: #e5e7eb (Borders)
gray-300: #d1d5db (Disabled states)
gray-400: #9ca3af (Placeholder text)
gray-500: #6b7280 (Secondary text)
gray-600: #4b5563 (Body text)
gray-700: #374151 (Headings)
gray-800: #1f2937 (Dark text)
gray-900: #111827 (Very Dark)
```

### Semantic Colors

```css
Success: #10b981 (Green)
Warning: #f59e0b (Orange)
Error:   #ef4444 (Red)
Info:    #3b82f6 (Blue)
```

---

## 📝 Typography

### Font Family

```css
font-sans:    Inter, system-ui, sans-serif (Body text)
font-display: Inter, system-ui, sans-serif (Headings)
```

### Font Sizes

```css
text-xs:   0.75rem  (12px) - Small labels
text-sm:   0.875rem (14px) - Secondary text
text-base: 1rem     (16px) - Body text
text-lg:   1.125rem (18px) - Large text
text-xl:   1.25rem  (20px) - Subheadings
text-2xl:  1.5rem   (24px) - Small headings
text-3xl:  1.875rem (30px) - Medium headings
text-4xl:  2.25rem  (36px) - Large headings
text-5xl:  3rem     (48px) - Hero headings
```

### Font Weights

```css
font-light:    300
font-normal:   400
font-medium:   500
font-semibold: 600
font-bold:     700
font-extrabold: 800
```

---

## 🔲 Spacing

### Standard Spacing Scale

```css
0.5 →  0.125rem (2px)
1   →  0.25rem  (4px)
2   →  0.5rem   (8px)
3   →  0.75rem  (12px)
4   →  1rem     (16px) ← Base unit
6   →  1.5rem   (24px)
8   →  2rem     (32px)
12  →  3rem     (48px)
16  →  4rem     (64px)
```

---

## 📦 Components

### Buttons

**Primary Button**

```tsx
<button className="btn btn-primary">Add to Cart</button>
```

**Secondary Button**

```tsx
<button className="btn btn-secondary">View Details</button>
```

**Outline Button**

```tsx
<button className="btn btn-outline">Cancel</button>
```

**Ghost Button**

```tsx
<button className="btn btn-ghost">Learn More</button>
```

### Cards

**Basic Card**

```tsx
<div className="card">
  <div className="card-body">
    <h3>Card Title</h3>
    <p>Card content goes here</p>
  </div>
</div>
```

### Inputs

**Text Input**

```tsx
<input type="text" className="input" placeholder="Enter text..." />
```

**Input with Error**

```tsx
<input type="text" className="input input-error" />
```

### Badges

**Status Badges**

```tsx
<span className="badge badge-primary">New</span>
<span className="badge badge-secondary">In Stock</span>
<span className="badge badge-success">Delivered</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Out of Stock</span>
```

---

## 🎭 Shadows

```css
shadow-sm:         Subtle shadow (buttons, inputs)
shadow:            Default shadow (cards)
shadow-md:         Medium shadow (dropdowns)
shadow-lg:         Large shadow (modals)
shadow-xl:         Extra large shadow (overlays)
shadow-card:       Custom card shadow
shadow-card-hover: Card hover shadow
```

---

## 🔄 Border Radius

```css
rounded-sm:  0.25rem  (4px)  - Subtle
rounded:     0.375rem (6px)  - Default
rounded-md:  0.5rem   (8px)  - Medium
rounded-lg:  0.75rem  (12px) - Large
rounded-xl:  1rem     (16px) - Extra Large
rounded-2xl: 1.5rem   (24px) - 2X Large
rounded-full: 9999px         - Fully rounded
```

---

## ⚡ Animations

### Available Animations

```css
animate-fade-in:    Fade in effect (0.3s)
animate-slide-in:   Slide in from bottom (0.3s)
animate-bounce-slow: Slow bounce effect (3s)
```

### Usage Examples

```tsx
<div className="animate-fadeIn">
  Content appears with fade
</div>

<div className="animate-slideIn">
  Content slides in from bottom
</div>
```

---

## 🎯 Common Patterns

### Page Container

```tsx
<div className="container-custom">
  <div className="py-8 md:py-12">{/* Page content */}</div>
</div>
```

### Grid Layouts

```tsx
{
  /* Product Grid */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ))}
</div>;
```

### Loading State

```tsx
<div className="flex items-center justify-center py-12">
  <div className="spinner" />
  <span className="ml-2">Loading...</span>
</div>
```

### Skeleton Loader

```tsx
<div className="skeleton h-48 w-full mb-4" />
<div className="skeleton h-4 w-3/4 mb-2" />
<div className="skeleton h-4 w-1/2" />
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px  - Small devices (phones landscape)
md:  768px  - Medium devices (tablets)
lg:  1024px - Large devices (desktops)
xl:  1280px - Extra large devices
2xl: 1536px - 2X Extra large devices
```

### Usage

```tsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

---

## ♿ Accessibility

### Focus States

All interactive elements have visible focus states:

```css
:focus-visible {
  outline: none;
  ring: 2px;
  ring-primary-500;
  ring-offset: 2px;
}
```

### Color Contrast

- All text colors meet WCAG AA standards
- Primary: #3b82f6 on white = 4.5:1 ratio ✓
- Gray-600: #4b5563 on white = 7:1 ratio ✓

### Screen Reader Support

```tsx
<button aria-label="Add to cart">
  <ShoppingCart />
</button>
```

---

## 🚀 Performance Tips

### 1. Use Utility Classes

✅ **Do:** Use Tailwind utilities

```tsx
<div className="bg-white rounded-lg shadow-card p-6">
```

❌ **Don't:** Write custom CSS for everything

```tsx
<div className="custom-card"> {/* Avoid when possible */}
```

### 2. Optimize Images

- Use WebP format when possible
- Implement lazy loading
- Use responsive images

### 3. Code Splitting

- Lazy load routes
- Lazy load heavy components

```tsx
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

### 4. Minimize Re-renders

- Use React.memo() for pure components
- Use useMemo() and useCallback() appropriately

---

## 🎨 Design Principles

### 1. Consistency

- Use design tokens throughout
- Maintain consistent spacing
- Follow established patterns

### 2. Clarity

- Clear visual hierarchy
- Readable typography
- Sufficient contrast

### 3. Efficiency

- Fast loading times
- Smooth animations
- Responsive design

### 4. Accessibility

- Keyboard navigation
- Screen reader support
- WCAG compliance

---

## 📋 Component Checklist

When creating new components:

- [ ] Uses design system colors
- [ ] Follows spacing scale
- [ ] Responsive on all breakpoints
- [ ] Has focus states
- [ ] Includes loading states
- [ ] Has error states (if applicable)
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Optimized for performance
- [ ] Consistent with existing patterns
- [ ] Documented usage

---

## 🔗 Quick Reference

### Most Common Classes

**Layout:**

```css
container-custom, flex, grid, max-w-7xl
```

**Spacing:**

```css
p-4, p-6, m-4, mb-6, gap-4, space-y-4
```

**Typography:**

```css
text-gray-900, text-sm, font-semibold, leading-relaxed
```

**Backgrounds:**

```css
bg-white, bg-gray-50, bg-primary-600
```

**Borders:**

```css
border, border-gray-300, rounded-lg
```

**Shadows:**

```css
shadow-card, shadow-card-hover
```

**Interactive:**

```css
hover:bg-gray-100, focus:ring-2, transition-all
```

---

## 📞 Need Help?

- Check existing components for examples
- Review Tailwind CSS documentation
- Maintain consistency with design system
- Ask team for design reviews

---

**Version:** 1.0.0  
**Last Updated:** November 4, 2025  
**Maintained by:** NexBuy Team
