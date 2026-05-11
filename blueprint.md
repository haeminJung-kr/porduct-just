# Church Youth Group Ledger Project Blueprint

## Overview
This application is a modern, web-based financial ledger designed for a church youth group. It provides an intuitive, spreadsheet-like interface for tracking income, expenses, and balance in real-time.

## Features & Capabilities
*   **Spreadsheet Experience**: Inline editing of data directly within the grid.
*   **Automatic Balance Tracking**: Instant recalculation of balances as income or expense values change.
*   **Persistent Layout**: Sticky headers for easy navigation through long lists of transactions.
*   **Modern Aesthetics**: Clean design using modern CSS features like Container Queries, `:has()`, and modern color spaces.
*   **Responsive Design**: Adapts to various screen sizes while maintaining the grid structure.

## Technical Outline
*   **Language/Framework**: Framework-less HTML, CSS (Vanilla), and JavaScript (ES Modules).
*   **Components**: Uses Web Components (`<ledger-sheet>`) for encapsulation.
*   **State Management**: In-memory state tracking within the custom element for reactive updates.
*   **Formatting**: Localization-aware number formatting.

## Current Plan: Ledger Implementation
1.  **Web Component Setup**: Define `LedgerSheet` custom element.
2.  **UI Construction**: Create the grid layout with editable cells.
3.  **Calculation Logic**: Implement a "cascade" calculation for the Balance column.
4.  **Styling**: Apply modern, tactile styles (shadows, transitions, typography).
5.  **Interactivity**: Add row management (Add/Remove).
