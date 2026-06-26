import styles from './legal.module.css'

type Props = {
  readonly appName: string
}

export default function TermsOfServiceContent({ appName }: Props) {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1>Términos de servicio</h1>

          <p className={styles.subtitle}>
            Estos Términos de servicio regulan tu acceso y uso de {appName}.
            Lee cuidadosamente el contenido antes de utilizar la plataforma.
          </p>

          <p className={styles.updated}>
            Última actualización:{" "}
            <time dateTime="2026-06-25">25 de junio de 2026</time>
          </p>
        </header>

        <section className={styles.section}>
          <h2>1. Aceptación de estos términos</h2>

          <p>
            Bienvenido a <strong>{appName}</strong>.
          </p>

          <p>
            Estos Términos de servicio regulan tu acceso y uso de
            la plataforma {appName}, incluyendo su sitio web, aplicaciones y
            servicios relacionados.
          </p>

          <p>
            Al crear una cuenta o usar {appName}, reconoces que has leído,
            entendido y aceptas estar sujeto a estos Términos. Si no estás de
            acuerdo con estos Términos, no debes utilizar la plataforma.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Descripción del servicio</h2>

          <p>
            {appName} es una plataforma en línea diseñada para ayudar a bandas
            musicales a organizar sus actividades y colaborar de forma eficiente.
          </p>

          <p>Dependiendo de tus permisos, es posible que puedas:</p>

          <ul>
            <li>Crear y gestionar bandas musicales.</li>
            <li>Invitar a miembros.</li>
            <li>Asignar roles administrativos y musicales.</li>
            <li>Organizar canciones y repertorios.</li>
            <li>Programar ensayos y eventos.</li>
            <li>Compartir información con los miembros de tu banda.</li>
          </ul>

          <p>
            Nos reservamos el derecho a mejorar, modificar, suspender o descontinuar
            cualquier función de la plataforma en cualquier momento.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Elegibilidad</h2>

          <p>Debes cumplir con todas las leyes aplicables al usar {appName}.</p>

          <p>Al usar la plataforma, declaras que:</p>

          <ul>
            <li>La información que proporcionas es precisa.</li>
            <li>Eres responsable de mantener tu cuenta.</li>
            <li>Usarás {appName} solo para fines lícitos.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Cuentas de usuario</h2>

          <p>
            Eres responsable de mantener la confidencialidad de tu cuenta.
          </p>

          <p>Aceptas:</p>

          <ul>
            <li>Mantener segura tu contraseña.</li>
            <li>Proteger tus credenciales de autenticación.</li>
            <li>
              Notificar inmediatamente si crees que tu cuenta ha sido
              comprometida.
            </li>
            <li>Ser responsable de todas las actividades bajo tu cuenta.</li>
          </ul>

          <p>
            {appName} no es responsable de pérdidas resultantes de accesos no
            autorizados causados por la falta de protección de tus credenciales.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Uso aceptable</h2>

          <p>No debes usar {appName} para:</p>

          <ul>
            <li>Violar cualquier ley o regulación aplicable.</li>
            <li>Subir software malicioso o código dañino.</li>
            <li>
              Intentar obtener acceso no autorizado a otras cuentas o sistemas.
            </li>
            <li>Interferir con el funcionamiento o la seguridad de la plataforma.</li>
            <li>Hostigar, amenazar o abusar de otros usuarios.</li>
            <li>
              Subir contenido que infrinja los derechos de propiedad intelectual
              de terceros.
            </li>
            <li>Usar la plataforma para actividades fraudulentas o ilegales.</li>
          </ul>

          <p>
            Cualquier violación de estos Términos puede resultar en la suspensión
            o terminación permanente de tu cuenta.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Contenido del usuario</h2>

          <p>
            Conservas la propiedad del contenido que creas dentro de {appName},
            incluyendo:
          </p>

          <ul>
            <li>Canciones</li>
            <li>Artistas</li>
            <li>Repertorios</li>
            <li>Eventos</li>
            <li>Imágenes</li>
            <li>Documentos</li>
            <li>Otra información que subas</li>
          </ul>

          <p>
            Al enviar contenido a {appName}, nos otorgas una licencia limitada para
            almacenar, procesar, mostrar y transmitir ese contenido únicamente con
            el fin de prestar nuestros servicios.
          </p>

          <p>No reclamamos la titularidad de tu contenido.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Roles y colaboración</h2>

          <p>
            {appName} permite a los administradores asignar permisos y roles a
            los miembros de una banda musical.
          </p>

          <p>Cada administrador es responsable de:</p>

          <ul>
            <li>Gestionar los permisos de acceso de manera apropiada.</li>
            <li>Invitar a miembros de confianza.</li>
            <li>Eliminar el acceso cuando sea necesario.</li>
          </ul>

          <p>
            {appName} no es responsable de las decisiones tomadas por los
            administradores de la banda en relación con el acceso de los miembros.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Propiedad intelectual</h2>

          <p>
            {appName}, incluyendo su software, diseño, marca, logotipos,
            interfaz y documentación, está protegido por las leyes de propiedad
            intelectual aplicables.
          </p>

          <p>No puedes:</p>

          <ul>
            <li>Copiar ninguna parte de la plataforma.</li>
            <li>Modificar el software.</li>
            <li>Realizar ingeniería inversa de la plataforma.</li>
            <li>Redistribuir la plataforma.</li>
            <li>Explotar comercialmente cualquier parte de {appName}.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>9. Disponibilidad del servicio</h2>

          <p>
            Nos esforzamos por ofrecer un servicio confiable y seguro. Sin embargo,
            no garantizamos disponibilidad ininterrumpida.
          </p>

          <p>Las interrupciones temporales pueden ocurrir debido a:</p>

          <ul>
            <li>Mantenimiento programado.</li>
            <li>Actualizaciones de seguridad.</li>
            <li>Fallas de infraestructura.</li>
            <li>Problemas de conectividad a Internet.</li>
            <li>Circunstancias fuera de nuestro control razonable.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>10. Limitación de responsabilidad</h2>

          <p>
            En la máxima medida permitida por la ley, {appName} no será
            responsable de:
          </p>

          <ul>
            <li>Pérdida de datos.</li>
            <li>Pérdida de beneficios.</li>
            <li>Interrupción del negocio.</li>
            <li>Acceso no autorizado causado por credenciales comprometidas.</li>
            <li>Daños resultantes del uso indebido de la plataforma.</li>
            <li>Acciones realizadas por otros usuarios.</li>
          </ul>

          <p>
            Los usuarios son responsables de mantener copias de seguridad de la
            información importante cuando corresponda.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Suspensión y terminación de la cuenta</h2>

          <p>
            Nos reservamos el derecho de suspender o terminar cuentas que:
          </p>

          <ul>
            <li>Violen estos Términos.</li>
            <li>Participen en actividades fraudulentas.</li>
            <li>Intenten comprometer la seguridad de la plataforma.</li>
            <li>Abusen o hagan un uso indebido de los servicios.</li>
          </ul>

          <p>
            Los usuarios también pueden solicitar la eliminación de sus cuentas
            en cualquier momento, sujeto a los requisitos legales u operativos
            aplicables de retención de datos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Cambios en estos Términos</h2>

          <p>
            Podemos actualizar estos Términos de servicio periódicamente para
            reflejar cambios en nuestra plataforma o en los requisitos legales.
          </p>

          <p>
            El uso continuado de {appName} después de que los cambios entren en
            vigencia constituye la aceptación de los Términos actualizados.
          </p>
        </section>

        <section className={styles.section}>
          <h2>13. Ley aplicable</h2>

          <p>
            Estos Términos se regirán e interpretarán de acuerdo con las leyes
            aplicables de la jurisdicción en la que opera {appName}, sin tener
            en cuenta los principios de conflicto de leyes.
          </p>
        </section>
      </main>
    </div>
  )
}