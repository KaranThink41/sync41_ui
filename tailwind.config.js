// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Existing customizations
      backdropBlur: {
        lg: '24px',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      // Custom theme settings
      colors: {
        primary: '#1D72D1',
        secondary: '#6D3BF5',
        background: '#F8F8F8', // Use '#FFFFFF' for pure white if you prefer
        backgroundSecondary: '#F8F8F8',
        text: '#333333',
        textSecondary: '#666666',
        border: '#E1E1E1',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        h1: '56px', // Change to '48px' if preferred
        h2: '24px',
        body: '16px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
