erDiagram
    USUARIO ||--o{ RESERVA : "realiza"
    USUARIO ||--o{ PENALIDAD : "recibe"
    CANCHA ||--o{ RESERVA : "registra en"

    USUARIO {
        int id PK
        string nombre
        string correo_institucional "@upla.edu.pe"
        string rol "Estudiante, DGA, Vigilante"
        string estado "Activo, Bloqueado"
    }

    CANCHA {
        int id PK
        string nombre "Futsal 1, Futsal 2, Vóley"
        string tipo_superficie
    }

    RESERVA {
        int id PK
        int usuario_id FK
        int cancha_id FK
        date fecha
        time hora_inicio
        time hora_fin
        string estado "Pendiente, Aprobado, Rechazado, Asistió, No Asistió"
        string anexo_url
    }

    PENALIDAD {
        int id PK
        int usuario_id FK
        date fecha_inicio
        date fecha_fin
        string motivo
    }
