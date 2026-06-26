import styles from './legal.module.css';

type Props = {
  readonly appName: string
}

export default function PrivacyPolicyContent({ appName }: Props) {
  return (
    <div className={styles.page}>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1>Política de privacidad</h1>

          <p className={styles.subtitle}>
            Tu privacidad es importante para nosotros. Esta Política de
            privacidad explica qué información recopila {appName},
            cómo se utiliza y cómo la protegemos.
          </p>

          <p className={styles.updated}>
            Última actualización: <time dateTime="2026-06-25">25 de junio de 2026</time>
          </p>
        </header>

        <section className={styles.section}>
          <h2>1. Introducción</h2>

          <p>
            {appName} es una plataforma web diseñada para ayudar a
            bandas musicales a organizar miembros, gestionar canciones y
            repertorios, programar ensayos y eventos, y colaborar de manera más eficiente.
          </p>

          <p>
            Valoramos tu privacidad y estamos comprometidos a proteger tu
            información personal. Esta Política de privacidad explica qué
            información recopilamos, cómo la usamos, cómo la protegemos y las
            opciones que tienes con respecto a tus datos.
          </p>

          <p>
            Al crear una cuenta o usar {appName}, aceptas las prácticas
            descritas en esta Política de privacidad.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Información que recopilamos</h2>

          <p>
            Para ofrecer nuestros servicios, recopilamos la información que
            proporcionas voluntariamente mientras usas {appName}.
          </p>

          <h3>Información personal</h3>

          <ul>
            <li>Nombre</li>
            <li>Apellido</li>
            <li>Nombre de usuario</li>
            <li>Correo electrónico</li>
            <li>Teléfono</li>
            <li>Foto de perfil</li>
            <li>Contraseña cifrada</li>
            <li>Configuración de autenticación de dos factores (opcional)</li>
          </ul>

          <h3>Información de la banda</h3>

          <ul>
            <li>Nombre de la banda</li>
            <li>Logotipo de la banda</li>
            <li>Correo de contacto</li>
            <li>Teléfono de contacto</li>
            <li>Dirección</li>
          </ul>

          <h3>Contenido creado por los usuarios</h3>

          <ul>
            <li>Artistas</li>
            <li>Canciones</li>
            <li>Géneros musicales</li>
            <li>Repertorios</li>
            <li>Eventos</li>
            <li>Ubicaciones de eventos</li>
            <li>Enlaces externos</li>
            <li>Referencias de partituras</li>
            <li>Roles musicales</li>
            <li>Roles administrativos y permisos</li>
          </ul>

          <h3>Invitaciones</h3>

          <ul>
            <li>Dirección de correo electrónico</li>
            <li>Token de invitación</li>
            <li>Estado de la invitación</li>
            <li>Fecha de vencimiento de la invitación</li>
          </ul>

          <h3>Información técnica</h3>

          <p>
            Podemos recopilar automáticamente información técnica limitada como
            el tipo de navegador, dirección IP, registros de autenticación,
            información de sesión, datos del dispositivo y registros de
            diagnóstico para mejorar la seguridad y la fiabilidad de la
            plataforma.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Cómo usamos tu información</h2>

          <ul>
            <li>Crear y gestionar cuentas de usuario.</li>
            <li>Autenticar a los usuarios de forma segura.</li>
            <li>Habilitar la colaboración dentro de las bandas musicales.</li>
            <li>Gestionar canciones, artistas, repertorios y eventos.</li>
            <li>Enviar invitaciones a nuevos miembros.</li>
            <li>Proporcionar soporte al cliente.</li>
            <li>Mejorar el rendimiento de la plataforma.</li>
            <li>Proteger contra accesos no autorizados y fraudes.</li>
            <li>Cumplir con las leyes aplicables.</li>
          </ul>

          <p>
            No utilizamos tu información personal para la toma de decisiones
            automatizadas ni para perfilarte.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Autenticación y seguridad</h2>

          <p>
            Proteger tu información es una de nuestras principales prioridades.
          </p>

          <ul>
            <li>Almacenamiento de contraseñas cifradas.</li>
            <li>Procedimientos de autenticación seguros.</li>
            <li>Autenticación de dos factores opcional (2FA).</li>
            <li>Control de acceso basado en roles.</li>
            <li>Comunicación HTTPS cifrada.</li>
            <li>Monitoreo de seguridad regular.</li>
          </ul>

          <p>
            Aunque tomamos medidas razonables para proteger tu información,
            ninguna plataforma en línea puede garantizar seguridad absoluta.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Compartir tu información</h2>

          <p>
            No vendemos, alquilamos ni intercambiamos tu información personal.
          </p>

          <p>Tu información solo puede compartirse en los siguientes casos:</p>

          <ul>
            <li>Con los miembros de tu banda musical para colaborar.</li>
            <li>Con proveedores de servicios de confianza.</li>
            <li>Cuando lo exija la ley.</li>
            <li>Para proteger a {appName} y a sus usuarios.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Conservación de datos</h2>

          <p>
            Conservamos tu información solo el tiempo que sea necesario para
            brindar nuestros servicios o cumplir con obligaciones legales.
          </p>

          <p>
            Algunos datos pueden permanecer en copias de seguridad seguras por
            un período limitado después de la eliminación de la cuenta.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Cookies y tecnologías similares</h2>

          <p>{appName} utiliza cookies para:</p>

          <ul>
            <li>Mantener a los usuarios conectados.</li>
            <li>Mantener sesiones seguras.</li>
            <li>Recordar preferencias.</li>
            <li>Mejorar la funcionalidad de la plataforma.</li>
            <li>Analizar el rendimiento.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Tus derechos</h2>

          <ul>
            <li>Acceder a tu información personal.</li>
            <li>Actualizar información inexacta.</li>
            <li>Eliminar tu cuenta.</li>
            <li>Solicitar la eliminación de tus datos personales.</li>
            <li>Retirar el consentimiento cuando sea aplicable.</li>
            <li>Solicitar información sobre el tratamiento de datos.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>9. Privacidad de los niños</h2>

          <p>
            {appName} no está destinado a niños que estén por debajo de
            la edad legal mínima requerida para crear una cuenta en línea sin
            el consentimiento de sus padres.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Transferencias internacionales de datos</h2>

          <p>
            Dependiendo de la infraestructura utilizada para operar {appName},
            tu información puede procesarse o almacenarse en países distintos
            al tuyo. Se aplican salvaguardas adecuadas siempre que sea posible.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Cambios en esta política de privacidad</h2>

          <p>
            Podemos actualizar esta Política de privacidad de vez en cuando
            para reflejar cambios en nuestros servicios, requisitos legales o
            prácticas de seguridad.
          </p>

          <p>
            El uso continuado de {appName} después de las actualizaciones
            constituye la aceptación de la política revisada.
          </p>
        </section>

      </article>
    </div>
  )
}