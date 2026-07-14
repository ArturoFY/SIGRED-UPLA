graph TD
    subgraph Usuarios
        A[Estudiante / Docente\nWeb App Desktop]
        B[Vigilante\nMobile Web App]
        C[Secretaría DGA\nDashboard Web]
    end

    subgraph "Frontend (Vercel)"
        D[React + Tailwind CSS\nInterfaces UI]
    end

    subgraph "Backend (Render)"
        E[API REST\nLaravel 11]
        F[Motor Lógico\nPenalidades Job]
    end

    subgraph "Base de Datos"
        G[(MySQL\nEntorno sin contraseña local)]
    end

    A -->|Peticiones HTTP| D
    B -->|Peticiones HTTP| D
    C -->|Peticiones HTTP| D
    
    D <-->|JSON / REST| E
    E <-->|Consultas SQL| G
    F -->|Actualiza Estados| G
