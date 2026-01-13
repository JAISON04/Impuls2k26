export const RAZORPAY_CONFIG = {
    key_id: "YOUR_RAZORPAY_KEY", // Placeholder - User to replace
    name: "Impulse 2026",
    currency: "INR",
};

export const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};
