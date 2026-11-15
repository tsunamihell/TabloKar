# Spec Delta: shop-settings

## Purpose

Manages the workshop profile, branding, default currency formatting, and editable baseline catalog for signboard materials and services.

## ADDED Requirements

### Requirement: Workshop profile configuration
The system SHALL store and provide editable workshop profile metadata including shop name, city, phone numbers, address, and receipt print header information.

#### Scenario: Admin updates shop profile
- **WHEN** Admin submits updated shop name and address in settings
- **THEN** system saves the changes and reflects them immediately across all print headers and dashboards

### Requirement: Currency and number formatting
The system SHALL standardize all financial amounts in Toman using integer storage and format numbers with Persian thousand separators on the user interface.

#### Scenario: Displaying monetary amounts
- **WHEN** monetary values are presented on invoices or screens
- **THEN** values are formatted with Persian digits and comma grouping (e.g. ۱٬۵۰۰٬۰۰۰ تومان) without floating-point inaccuracies

### Requirement: Baseline product and service catalog
The system SHALL provide an editable catalog of signboard types and services with unit types and default benchmark pricing.

#### Scenario: Listing available product types
- **WHEN** user views product types for quoting
- **THEN** system displays standard types (Chelengk/Channel letters, Composite, Plexi, Neon, Iron framing, Installation) with their measurement units

