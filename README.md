# Mobile Wiremaker (MenuMorph)

MenuMorph is a dynamic, data-driven Next.js application designed to "morph" its entire interface and functionality based on the selected mode. It can seamlessly transition between a **Restaurant Menu**, a **Product Marketplace**, and a **Travel Coupon Wallet**.

## 🚀 Key Features

- **Multi-App Architecture**: Switch between three distinct application modes using a single codebase.
- **Dynamic Data Loading**: Interfaces are built dynamically from JSON configurations (`menu-data.json`, `marketplace-data.json`, `coupon-data.json`).
- **Context-Aware Filtering**: The filtering system automatically adapts its options (Dietary, Categories, Deals) based on the active application mode.
- **Integrated Shopping Cart**: Supports standard product purchases and "Free Deal" redemption.
- **Coupon System**: Specific logic for travel coupons, including venue details, terms & conditions, and scannable QR code placeholders.
- **Checkout Logic**: 
  - Paid items trigger a standard "Order Placed" flow.
  - Coupon-only carts trigger an "Email My Deals" flow.
- **GitHub Backup Tool**: A built-in developer tool in the Account page to back up the entire source code and documentation to a personal GitHub repository.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **AI (Optional/Configured)**: [Firebase Genkit](https://firebase.google.com/docs/genkit)

## 🏁 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- npm or yarn

### Installation

1. **Clone or Download** this repository to your local machine.
2. **Install Dependencies**:
   ```bash
   npm install
   ```

### Running the Application

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
2. **Access the App**:
   Open your browser and navigate to `http://localhost:9002`.

*Note: The application is configured to listen on `0.0.0.0` to allow access from local network devices and emulators.*

## 📂 Project Structure

- `src/app`: Next.js App Router pages and server actions.
- `src/components`: Reusable UI components (ShadCN and custom).
- `src/context`: App-wide state for the cart and application mode.
- `src/lib`: Data layer, including the JSON files that drive the "morphing" behavior.
- `docs/`: Project documentation and PRD (Product Requirement Documents).

## ☁️ GitHub Backup Setup

To use the built-in backup feature:
1. Navigate to the **Account** tab in the mobile frame.
2. Click **Full App Backup to GitHub**.
3. Provide a **GitHub Personal Access Token** (Classic `repo` scope or Fine-grained `Contents: Read/Write`).
4. Enter your `username/repository-name` and hit **Start Full Backup**.

## 📄 License

This project is intended for prototyping and demonstration purposes.
