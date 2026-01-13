export const RAZORPAY_CONFIG = {
    key_id: "rzp_live_S1d0uE6OLaE5LR",
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
