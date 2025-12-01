# Flyer Input Form

A React application for submitting store flyer information, built with Vite, TypeScript, and shadcn/ui.

## Features

- **Store Selection**: Searchable store code selection (fetching from Supabase).
- **Auto-population**: Automatically fills Store Name based on selected Store Code.
- **Form Validation**: Requires either a URL or a File attachment.
- **Webhook Integration**: Submits form data (including files) to a configured webhook.
- **Modern UI**: Clean and responsive interface using shadcn/ui and Tailwind CSS.

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd storeForm
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory (`storeForm/.env`) and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
    *You can use `.env.example` as a reference.*

4.  **Run the application**:
    ```bash
    npm run dev
    ```

## Usage

1.  Select a **Store Code** from the dropdown (you can type to search).
2.  **Store Name** will be automatically populated.
3.  Enter a **URL** OR attach a **File** (at least one is required).
4.  Click **Submit**. The data will be sent to the configured webhook endpoint.

## Technologies

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (Client)