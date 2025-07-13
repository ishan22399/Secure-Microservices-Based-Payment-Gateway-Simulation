# Payment Gateway Backend

This is a secure microservices-based payment gateway backend built with Spring Boot and PostgreSQL.

## Features
- User authentication and authorization (JWT, RBAC)
- Payment processing
- Transaction management
- Microservices architecture
- PostgreSQL integration
- Security best practices

## Getting Started

1. Ensure you have Java 17+ and Maven installed.
2. Configure your PostgreSQL database in `src/main/resources/application.yml`.
3. Build and run the application:
   ```sh
   mvn clean install
   mvn spring-boot:run
   ```

## Database Connection Example

```
spring.datasource.url=jdbc:postgresql://db.aedzidgkcfvilffyixng.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=[YOUR-PASSWORD]
```

Replace `[YOUR-PASSWORD]` with your actual password.

---

## Microservices Structure (Planned)
- auth-service
- user-service
- payment-service
- transaction-service
- notification-service

Each service will have its own package and controller, service, repository, and model layers.

---

## Next Steps
- Implement user entity and authentication endpoints
- Implement payment and transaction logic
- Add security configuration
- Add API documentation
