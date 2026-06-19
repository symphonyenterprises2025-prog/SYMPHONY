# Symphony Gifting Platform: AI Chatbot Knowledge Base & Training Data

This document contains structured training data, core business details, customer policies, and operational workflows for Symphony. It is optimized to be fed directly into an AI Chatbot, custom GPT, or automated customer support assistant to train it to answer customer queries.

---

## 📅 System & Platform Summary

| Parameter | Platform Value |
|---|---|
| **Store Name** | Symphony |
| **Business Model** | Premium Customized Gifting (B2C & B2B/Corporate) |
| **HQ & Studio Location** | Siripur Market, Unit-8, Bhubaneswar, Odisha 751003 |
| **Business Hours** | Mon - Sat: 9:00 AM to 8:00 PM \| Sun: 10:00 AM to 6:00 PM |
| **Primary Markets** | Pan-India Delivery (Domestic), with options for international gifting billing |
| **Official Website** | https://symphonyenterprise.co.in |
| **Contact Page** | https://symphonyenterprise.co.in/contact |
| **Support Phone / WhatsApp**| +91 7978974823 (Call or WhatsApp support) |
| **Support Email** | info@symphonyenterprise.co.in (For artwork, approvals, billing queries) |

---

## 🎨 Product & Personalization Policies

### 1. Personalization Capabilities
* **Text Customization:** Customers can add names, custom quotes, or messages on products (e.g., mugs, jewelry, cushions).
* **Photo Uploads:** Customers can upload photos for custom caricature drawings, printed photo frames, or custom cushions.
* **Gift Packaging:** Premium gift-wrap add-ons and personalized greeting cards can be added to any order during checkout.

### 2. File Guidelines for Customers
* **Image Formats:** JPG, JPEG, PNG, or WebP.
* **Image Quality:** High-resolution photos taken in good lighting are required for the best printing results. Avoid blurry or pixelated uploads.
* **Text Limits:** Most text customizations are capped at 20-30 characters depending on the item to ensure print legibility.

---

## 🚚 Shipping & Delivery Options

### 1. Delivery Methods
* **Same-Day Delivery:** Available for perishable items (such as fresh cakes and flower bouquets) in select metropolitan areas. Orders must be placed before 2:00 PM local time.
* **Express National Shipping:** Standard courier delivery (Blue Dart, Delhivery) taking **3 to 5 business days** for national delivery.
* **Personalization Lead Time:** Custom items (engraving, caricatures, frames) take **1 to 2 business days** to design and manufacture *before* shipping.

### 2. Multi-Address Shipping
* Customers can buy multiple items in a single cart and check out with different recipient addresses for each item.

---

## 💳 Checkout, Pricing & Payments

### 1. Accepted Payment Methods
* **Digital Payments (via Razorpay):** UPI (Google Pay, PhonePe, Paytm, BHIM), Credit Cards, Debit Cards, and Net Banking.
* **Cash on Delivery (COD):** Available for standard items. **Note:** Cash on Delivery is *not* accepted for highly customized products (like engraved jewelry or caricatures) to prevent order cancellations.

### 2. Promotional Discount Rules
* Coupon codes can be entered on the checkout page. 
* Discounts can be a percentage (e.g., 10% off) or a fixed amount (e.g., ₹200 off).
* Expirations, minimum purchase quantities, or category exclusions apply to specific codes.

---

## 📦 Order Workflow & Status Definitions

When customers inquire about their order status, the chatbot should match their status code to these definitions:

* **PENDING:** The order has been placed but payment is not yet confirmed.
* **CONFIRMED:** Payment is successful, or COD order is verified.
* **PROCESSING:** The design team is finalizing personalizations, or the gift is being prepared/engraved.
* **SHIPPED:** The package has been handed over to the courier. A tracking link is active.
* **DELIVERED:** The courier reports successful delivery to the recipient.
* **CANCELLED:** The order was stopped before fulfillment.
* **REFUNDED:** The transaction was reversed, and money is credited back to the customer's payment method.

---

## 🏢 Corporate Gifting & B2B Bulk Orders

* **How it works:** Businesses submit an inquiry form at `/corporate-gifting` or email their brief to info@symphonyenterprise.co.in.
* **Ideal B2B Brief:** Chatbots should instruct B2B clients that their request is processed fastest if they provide:
  1. Required **quantity**
  2. Delivery **deadline**
  3. **Occasion** (e.g. Diwali, Onboarding, Conference)
  4. Brand alignment/logo **customization requirements**
  5. Target **budget range** per hamper
* **Lead Response Time:** A dedicated B2B Sales Representative will reach out with custom quotes and digital mockups within **4 to 6 business hours**.
* **Corporate Products:** Branded employee onboarding kits (hoodies, water bottles, diaries), custom branded client hampers, and seasonal festival packs (Diwali/New Year).

---

## 📞 Customer Support FAQs (Conversational Q&A)

### Q: How do I track my order?
**A:** You can track your order in two ways:
1. Go to the [Track Order page](https://symphonyenterprise.co.in/track-order) and enter your Order Number and Email/Phone.
2. If you have an account, log in and view your status under **Account Dashboard > Orders**.
You will also receive automatic tracking updates directly to your WhatsApp and Email once shipped.

### Q: Can I return a customized gift if I don't like it?
**A:** Because personalized items are custom-made with your specific photos, names, or messages, we **do not accept returns or exchanges** unless the item arrives physically damaged or defective. If there is a manufacturing defect, please contact us within 24 hours of delivery with unboxing photos/videos.

### Q: What happens if I upload a low-quality photo?
**A:** If the image you upload is too small or blurry, our customization design team will contact you via WhatsApp or Email to request a higher-resolution replacement. This might extend the preparation time by 24 hours.

### Q: Do you ship internationally?
**A:** Currently, Symphony specializes in pan-India deliveries. However, we do accept orders from international cards if you reside abroad and want to send gifts to family/friends living within India.

### Q: Can I cancel my order?
**A:** For customized products, cancellations are only accepted within **1 hour of placing the order**. Once the item goes into the design or production stage, we cannot cancel it or offer a refund. For non-customized items, cancellations are allowed up until they are shipped.

---

## 🚨 Guidelines for AI Chatbot Behavior & Tone

When interacting with Symphony customers, the AI should maintain:
1. **Tone:** Warm, premium, polite, and helpful (like a high-end personal shopping assistant).
2. **Clarity:** Clear formatting, bullet points, and hyperlinked page references (e.g., pointing B2B customers directly to the [Corporate Gifting Portal](https://symphonyenterprise.co.in/corporate-gifting)).
3. **Escalation Rules:**
   - For issues regarding failed payments, missing shipments, or damaged goods, transfer/redirect the customer to the human support line at **+91 7978974823** or email **info@symphonyenterprise.co.in**.
   - Do *not* promise refunds or issue coupon codes without human admin authorization.
