<!-- i18n-source: README.md@467b99b41b2762a14345517b546a0b0320caf6ff status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="Estado de CI"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="Última versión: v1.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="Versión del lenguaje: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="Licencia: MIT"></picture></a>
</p>

<p align="center">
<a href="#inicio-rápido"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-es-light.svg" alt="Empezar"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-es-light.svg" alt="Documentación"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-es-light.svg" alt="Ejemplos"></picture></a>
</p>

> Esta es una traducción del README en inglés. Si hay diferencias, la versión en inglés es la vigente.

<!-- brand:end -->

Una app de Expo para empezar: funciona en iOS, Android y la web, e incluye su propio backend como API routes de Expo Router, de modo que el registro, el inicio de sesión y una lista de tareas funcionan de principio a fin tras `npm ci` y `npx expo start`, sin ningún otro servidor que configurar. Está pensada para desarrolladores que quieren una app que funcione desde el primer día, con cuentas, datos, temas, traducciones y pruebas, escrita en TypeScript que se pueda leer y modificar, en lugar de una carpeta de pantallas vacías.

## Lo más destacado

- **Un backend en el mismo proyecto** — las API routes de `src/app/api` gestionan el registro, el inicio y el cierre de sesión, y la creación, el listado, la actualización y el borrado de tareas. El servidor de desarrollo las ejecuta junto a la app, y `npm run build` las exporta para Node.js, EAS Hosting, Vercel, Netlify o Cloudflare.
- **Un solo schema para ambos lados** — las formas de las peticiones y las respuestas son schemas de zod en `src/shared`; la API valida cada cuerpo con ellos y la app interpreta cada respuesta con ellos.
- **Cuentas hechas con cuidado** — hashes de contraseña PBKDF2 (600.000 iteraciones), tokens de sesión aleatorios guardados solo como hashes SHA-256, tokens en el Keychain de iOS y el Keystore de Android, límites de inicio de sesión y de registro por dirección de cliente que frenan una cuenta atacada en lugar de bloquear a su dueño y la misma respuesta para una dirección incorrecta y para una contraseña incorrecta.
- **Con límites desde el diseño** — cuerpos de petición de 16 KiB leídos como flujo, respuestas de 1 MiB, 500 tareas por cuenta, páginas de 100 como máximo, parámetros de consulta enteros estrictos y tablas de sesiones y de limitación con tope: ninguna petición puede hacer que el servidor retenga más memoria ni que itere durante más tiempo.
- **Lista para las personas** — temas claro y oscuro, inglés y turco con claves tipadas, inicio de sesión tolerante a la falta de conexión, actualizaciones optimistas de las tareas, roles y etiquetas de accesibilidad, y áreas táctiles de 48 puntos.
- **Probada desde el schema hasta la pantalla** — 250 pruebas de Jest, entre ellas una que renderiza las pantallas reales contra los controladores reales de la API en el mismo proceso, además de flujos de Maestro que ejecutan la app compilada en un simulador de iOS.

## Inicio rápido

**1. Obtén el código**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

Necesitas [Node.js](https://nodejs.org/) 22.14 o posterior. No hace falta instalar nada más para probarla en un navegador.

**2. Ejecútala**

```sh
npx expo start
```

Esto inicia la app y su API a la vez. Pulsa **w** para abrirla en el navegador, **i** para el simulador de iOS, **a** para el emulador de Android, o escanea el código QR con la app [Expo Go](https://expo.dev/go) en un teléfono conectado a la misma red.

**3. Úsala**

Toca **New here? Create an account**, escribe un nombre, una dirección de correo electrónico y una contraseña de al menos ocho caracteres, y llegarás a tu lista de tareas. Añade una tarea, toca el círculo para completarla y pasa a **Settings** para probar el tema oscuro o el turco. Edita `src/features/tasks/TasksScreen.tsx` y la pantalla se actualiza al guardar.

## Instalación

El repositorio es la propia app: clónalo como se indica arriba, empieza tu propio historial con `rm -rf .git && git init` y hazla tuya:

1. En `app.json`, cambia `name`, `slug`, `scheme`, `ios.bundleIdentifier` y `android.package`.
2. Sustituye `assets/icon.svg` y ejecuta `node scripts/render-icons.mjs` para generar todos los iconos a partir de él.
3. Cambia los colores en `src/theme/index.ts` y los textos en `src/lib/i18n/`.

Para ejecutarla como una compilación de desarrollo nativa en lugar de con Expo Go, usa `npm run ios` (macOS con Xcode) o `npm run android` (Android Studio).

## Uso

Los ejemplos siguientes están copiados de [`Examples/`](Examples), que `npm run typecheck` compila y `npm test` ejecuta.

### Añadir una API route

Un archivo de `src/app/api` llamado `<name>+api.ts` responde a `/api/<name>`. `handle()` convierte un `HttpError` lanzado en su respuesta, y `authenticate()` deja pasar únicamente las peticiones con sesión iniciada ([`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)):

```ts
export function GET(request: Request): Promise<Response> {
  return handle(async () => {
    const { accounts, tasks } = getServerApp();
    const user = await accounts.authenticate(request);
    let total = 0;
    let done = 0;
    let cursor: string | undefined;
    for (let page = 0; page < MAX_PAGES; page += 1) {
      const result = tasks.list(user.id, { limit: MAX_PAGE_SIZE, cursor });
      if (!result) break;
      total += result.items.length;
      done += result.items.filter((task) => task.done).length;
      if (!result.nextCursor) break;
      cursor = result.nextCursor;
    }
    return json({ total, done, open: total - done });
  });
}
```

### Llamarla desde la app

El cliente de la API añade el token de sesión, un límite de tiempo y un límite de tamaño, e interpreta la respuesta con un schema de zod; si no coincide, falla como un `ApiError` en lugar de llegar a una pantalla ([`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)):

```ts
export const taskStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  done: z.number().int().nonnegative(),
  open: z.number().int().nonnegative(),
});

export function fetchTaskStats(client: ApiClient, signal?: AbortSignal): Promise<TaskStats> {
  return client.request('/api/stats', { schema: taskStatsSchema, ...(signal ? { signal } : {}) });
}
```

### Mostrarla en una pantalla

React Query carga los datos; `errorMessageKey()` convierte cualquier fallo en una frase traducida ([`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)):

```tsx
const stats = useQuery({ queryKey: ['task-stats'], queryFn: ({ signal }) => fetchStats(signal) });

return (
  <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    {stats.isPending ? (
      <ActivityIndicator color={colors.accent} />
    ) : stats.isError ? (
      <Text style={{ color: colors.danger }}>{t(errorMessageKey(stats.error))}</Text>
    ) : (
      <Text accessibilityRole="summary" style={[styles.text, { color: colors.text }]}>
        {`${stats.data.done} / ${stats.data.total}`}
      </Text>
    )}
  </View>
);
```

### Guardar las tareas en una base de datos

Las tareas pasan por la interfaz `TaskRepository`. La versión de SQLite usa el módulo integrado `node:sqlite` de Node.js y supera las mismas pruebas de contrato que la versión en memoria ([`Examples/sqlite-repository`](Examples/sqlite-repository)). Cámbiala dentro de `createServerApp()` en `src/server/app.ts`:

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## Demo

| Inicio de sesión                                                      | Tareas                                                 | Ajustes                                           |
| --------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| ![Pantalla de inicio de sesión, claro](docs/images/sign-in-light.png) | ![Lista de tareas, claro](docs/images/tasks-light.png) | ![Ajustes, claro](docs/images/settings-light.png) |
| ![Pantalla de inicio de sesión, oscuro](docs/images/sign-in-dark.png) | ![Lista de tareas, oscuro](docs/images/tasks-dark.png) | ![Ajustes, oscuro](docs/images/settings-dark.png) |

Capturas hechas con una compilación Release en un simulador de iPhone 17 Pro con iOS 27, conectada al servidor de producción de `npm run build && npm run serve`, con [`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh). El script ejecuta el [flujo de Maestro](.maestro/sign-up-and-tasks.yaml) que se registra, añade tres tareas y completa una.

## Documentación

Referencia de la API y artículos:

- [Referencia de la API](https://muhittincamdali.github.io/ReactNativeStarter/) — los schemas y límites compartidos, el cliente de la API, la sesión, las traducciones y los módulos del servidor, generada con TypeDoc a partir de los comentarios del código fuente.
- [CHANGELOG.md](CHANGELOG.md) — qué cambió en cada versión.

## Guías

- [Primeros pasos](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — ejecutarla en cualquier plataforma, la estructura de carpetas, los scripts y cómo cambiar el nombre de la app.
- [Añadir una funcionalidad](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — un schema, una API route, una llamada del cliente, una pantalla y sus pruebas.
- [Despliegue](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — servir la API, conservar los datos, apuntar las apps hacia ella y compilarlas con EAS.
- [Seguridad](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — qué protege el starter y qué deja en tus manos.

Las mismas guías están en [`Documentation/`](Documentation) como Markdown.

## Requisitos

| Herramientas | Versión mínima                                                    |
| ------------ | ----------------------------------------------------------------- |
| Node.js      | 22.14                                                             |
| Expo SDK     | 58 (React Native 0.88, React 19.3)                                |
| iOS          | 16.4, el destino de despliegue de Expo SDK 58 (probado en iOS 27) |
| Android      | 7.0 (nivel de API 24), el mínimo de React Native 0.88             |

CI ejecuta lint, comprobaciones de tipos, pruebas y la compilación web en Node.js 22 y 24. La app nativa se compila y sus flujos de Maestro se ejecutan en local con Xcode 27.1.

## Arquitectura

- **Las rutas son archivos.** `src/app` contiene las pantallas y las API routes (Expo Router). El layout raíz mantiene la pantalla de inicio mientras se lee la sesión guardada y luego muestra el grupo `(app)` o `(auth)` mediante `Stack.Protected`, de modo que un deep link no puede abrir una pantalla que requiere sesión sin haberla iniciado.
- **La API son funciones simples.** Cada archivo `+api.ts` son unas pocas líneas que llaman a `src/server`: `http.ts` (lectura acotada del cuerpo, respuestas JSON, correspondencia de errores), `accounts.ts`, `passwords.ts`, `sessions.ts`, `rate-limit.ts` y `tasks.ts`. `createServerApp()` los conecta; las pruebas crean uno nuevo en cada prueba.
- **El almacenamiento está tras una interfaz.** `TaskRepository` mantiene las rutas independientes de dónde se guardan las tareas; la versión en memoria es la predeterminada y el ejemplo de SQLite muestra una base de datos.
- **El estado de la app es pequeño.** Los datos del servidor viven en React Query; la sesión (token y cuenta) y las preferencias (apariencia, idioma) son dos stores de zustand; la sesión se guarda con `expo-secure-store` y las preferencias con AsyncStorage, y ambas se validan al volver a leerse.
- **Los errores tienen un solo tipo.** La API responde `{ error: { code, message, fields } }`; el cliente convierte cada fallo en un `ApiError` con un tipo (`network`, `timeout`, `http`, ...) y las pantallas lo asocian a una frase traducida. Los errores de campo son claves de traducción, así que las comprobaciones de la API aparecen bajo el campo correcto y en el idioma correcto.
- **No se registra nada.** La regla `no-console` de ESLint es un error en la app y en la API.

Ejecuta las comprobaciones en local:

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## Antes de producción

La API guarda las cuentas, las sesiones, las tareas y los contadores de límite de peticiones en la memoria de un solo proceso, dimensionada para una demo: 1.000 cuentas y 100.000 tareas. Un reinicio la vacía y varias instancias del servidor no la comparten. Antes de que lleguen usuarios reales, lleva los almacenes a una base de datos y los contadores de límite a un almacén que compartan todas las instancias, pasa la dirección del cliente desde tu proxy y añade el borrado de cuenta y el restablecimiento de contraseña. La [guía de seguridad](Documentation/Security.md#demo-server-or-production) enumera cada paso.

## Hoja de ruta

- Eliminación de cuentas y restablecimiento de contraseña, que App Store Review y los usuarios reales necesitan.
- Cuentas y sesiones persistentes junto al repositorio de tareas de SQLite.
- Una ejecución de Maestro para Android en CI sobre un emulador.

## Contribuir

Las contribuciones son bienvenidas. Lee la [guía de contribución](CONTRIBUTING.md) y el [código de conducta](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) antes de abrir una pull request. Informa de los problemas de seguridad de forma privada, como se describe en la [política de seguridad](SECURITY.md).

## Licencia

Publicado bajo la licencia MIT. Consulta [LICENSE](LICENSE).
