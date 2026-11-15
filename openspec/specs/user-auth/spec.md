# user-auth Specification

## Purpose

Provides local multi-user authentication, password security, session management, and role-based access control for workshop staff operating on the local network.

## Requirements

### Requirement: Local user login and session authentication
The system SHALL authenticate users using their username and password, issuing an HTTP session or secure cookie that preserves identity across requests within the local network.

#### Scenario: Successful login with valid credentials
- **WHEN** user submits valid username and correct password
- **THEN** system establishes authenticated session and returns user profile with assigned role

#### Scenario: Failed login with invalid password
- **WHEN** user submits correct username but wrong password
- **THEN** system rejects authentication with a generic credential error and does not establish session

### Requirement: Secure password hashing
The system SHALL hash all user passwords using bcrypt or Argon2 before persisting to the database and SHALL NEVER store or log plaintext passwords.

#### Scenario: Storing new password
- **WHEN** a user account is created or password is changed
- **THEN** the system generates a salted secure hash and stores only the hash in the database

### Requirement: Role-based authorization
The system SHALL enforce role-based access control on server endpoints according to defined roles (Admin, Sales, Designer, Workshop, Installer, Cashier).

#### Scenario: Admin accesses restricted management settings
- **WHEN** an authenticated user with Admin role requests system settings
- **THEN** the system grants access and processes the request

#### Scenario: Non-admin denied from user management
- **WHEN** an authenticated user with Sales or Installer role attempts to create or delete user accounts
- **THEN** the system returns HTTP 403 Forbidden

