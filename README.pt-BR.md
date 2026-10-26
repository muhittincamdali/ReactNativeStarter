<!-- i18n-source: README.md@e710ff19fabecf77a6d22e7ad05eba52ba44f827 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="Status da CI"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="Versão mais recente: v2.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="Versão da linguagem: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="Licença: MIT"></picture></a>
</p>

<p align="center">
<a href="#início-rápido"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-pt-BR-light.svg" alt="Começar"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-pt-BR-light.svg" alt="Documentação"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-pt-BR-light.svg" alt="Exemplos"></picture></a>
</p>

> Esta é uma tradução do README em inglês. Se houver diferença, vale a versão em inglês.

<!-- brand:end -->

Um app Expo para você começar: roda em iOS, Android e na web e traz o próprio backend como API routes do Expo Router, de modo que cadastro, login e uma lista de tarefas funcionam de ponta a ponta depois de `npm ci` e `npx expo start`, sem nenhum outro servidor para configurar. Ele é para quem desenvolve e quer um app funcionando desde o primeiro dia, com contas, dados, temas, traduções e testes, escrito em TypeScript que dá para ler e alterar, em vez de uma pasta de telas vazias.

## Destaques

- **Um backend no mesmo projeto** — as API routes em `src/app/api` cuidam de cadastro, login e logout, além de criar, listar, atualizar e excluir tarefas. O servidor de desenvolvimento as executa junto com o app, e `npm run build` as exporta para Node.js, EAS Hosting, Vercel, Netlify ou Cloudflare.
- **Um schema para os dois lados** — os formatos de requisição e de resposta são schemas do zod em `src/shared`; a API valida cada corpo com eles e o app interpreta cada resposta com eles.
- **Contas feitas com cuidado** — hashes de senha PBKDF2 (600.000 iterações), tokens de sessão aleatórios guardados apenas como hashes SHA-256, tokens no Keychain do iOS e no Keystore do Android, limites de login e de cadastro por endereço de cliente que desaceleram uma conta atacada em vez de bloquear o dono dela e a mesma resposta para um endereço errado e para uma senha errada.
- **Limitado desde o projeto** — corpos de requisição de 16 KiB lidos como stream, respostas de 1 MiB, 500 tarefas por conta, páginas de no máximo 100 itens, parâmetros de consulta inteiros estritos e tabelas de sessões e de limitação com teto: nenhuma requisição consegue fazer o servidor reter mais memória nem repetir um laço por mais tempo.
- **Pronto para as pessoas** — temas claro e escuro, inglês e turco com chaves tipadas, login tolerante a falta de conexão, atualizações otimistas das tarefas, papéis e rótulos de acessibilidade e áreas de toque de 48 pontos.
- **Testado do schema até a tela** — 281 testes do Jest, incluindo um que renderiza as telas reais contra os handlers reais da API no mesmo processo, além de fluxos do Maestro que executam o app compilado em um simulador de iOS.

## Início rápido

**1. Obtenha o código**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

Você precisa do [Node.js](https://nodejs.org/) 22.14 ou superior. Não é preciso instalar mais nada para experimentar no navegador.

**2. Inicie**

```sh
npx expo start
```

Isso inicia o app e a API juntos. Pressione **w** para abrir no navegador, **i** para o simulador de iOS, **a** para o emulador de Android, ou escaneie o QR code com o app [Expo Go](https://expo.dev/go) em um celular na mesma rede.

**3. Use**

Toque em **New here? Create an account**, informe um nome, um e-mail e uma senha de pelo menos oito caracteres, e você chega à sua lista de tarefas. Adicione uma tarefa, toque no círculo para concluí-la e vá para **Settings** para experimentar o tema escuro ou o turco. Edite `src/features/tasks/TasksScreen.tsx` e a tela é atualizada assim que você salva.

## Instalação

O repositório é o próprio app: clone-o como acima, comece seu próprio histórico com `rm -rf .git && git init` e faça dele o seu:

1. Em `app.json`, altere `name`, `slug`, `scheme`, `ios.bundleIdentifier` e `android.package`.
2. Substitua `assets/icon.svg` e execute `node scripts/render-icons.mjs` para gerar todos os ícones a partir dele.
3. Altere as cores em `src/theme/index.ts` e os textos em `src/lib/i18n/`.

Para rodar como um build de desenvolvimento nativo em vez de usar o Expo Go, use `npm run ios` (macOS com Xcode) ou `npm run android` (Android Studio).

## Uso

Os exemplos abaixo foram copiados de [`Examples/`](Examples), que `npm run typecheck` compila e `npm test` executa.

### Adicione uma API route

Um arquivo em `src/app/api` chamado `<name>+api.ts` responde a `/api/<name>`. `handle()` transforma um `HttpError` lançado em sua resposta, e `authenticate()` deixa passar apenas as requisições com sessão iniciada ([`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)):

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

### Chame a partir do app

O cliente da API adiciona o token de sessão, um limite de tempo e um limite de tamanho, e interpreta a resposta com um schema do zod; se ela não corresponder, falha como um `ApiError` em vez de chegar a uma tela ([`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)):

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

### Mostre em uma tela

O React Query carrega os dados; `errorMessageKey()` transforma qualquer falha em uma frase traduzida ([`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)):

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

### Guarde as tarefas em um banco de dados

As tarefas passam pela interface `TaskRepository`. A versão em SQLite usa o `node:sqlite` embutido no Node.js e passa nos mesmos testes de contrato da versão em memória ([`Examples/sqlite-repository`](Examples/sqlite-repository)). Troque a implementação dentro de `createServerApp()`, em `src/server/app.ts`:

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## Demonstração

| Login                                                  | Tarefas                                                 | Configurações                                           |
| ------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------- |
| ![Tela de login, claro](docs/images/sign-in-light.png) | ![Lista de tarefas, claro](docs/images/tasks-light.png) | ![Configurações, claro](docs/images/settings-light.png) |
| ![Tela de login, escuro](docs/images/sign-in-dark.png) | ![Lista de tarefas, escuro](docs/images/tasks-dark.png) | ![Configurações, escuro](docs/images/settings-dark.png) |

Capturado a partir de um build Release em um simulador de iPhone 17 Pro com iOS 27, conectado ao servidor de produção de `npm run build && npm run serve`, por [`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh). O script executa o [fluxo do Maestro](.maestro/sign-up-and-tasks.yaml) que faz o cadastro, adiciona três tarefas e conclui uma.

## Documentação

Referência da API e artigos:

- [Referência da API](https://muhittincamdali.github.io/ReactNativeStarter/) — os schemas e limites compartilhados, o cliente da API, a sessão, as traduções e os módulos do servidor, gerada pelo TypeDoc a partir dos comentários do código-fonte.
- [CHANGELOG.md](CHANGELOG.md) — o que mudou em cada versão.

## Guias

- [Primeiros passos](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — rodar em qualquer lugar, a estrutura de pastas, os scripts e como renomear o app.
- [Adicionando uma funcionalidade](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — um schema, uma API route, uma chamada do cliente, uma tela e seus testes.
- [Publicação](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — servir a API, manter os dados, apontar os apps para ela e compilá-los com o EAS.
- [Segurança](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — o que o starter protege e o que ele deixa por sua conta.

Os mesmos guias estão em [`Documentation/`](Documentation) como Markdown.

## Requisitos

| Ferramentas | Versão mínima                                                  |
| ----------- | -------------------------------------------------------------- |
| Node.js     | 22.14                                                          |
| Expo SDK    | 58 (React Native 0.88, React 19.3)                             |
| iOS         | 16.4, o alvo de implantação do Expo SDK 58 (testado no iOS 27) |
| Android     | 7.0 (API de nível 24), o mínimo do React Native 0.88           |

A CI executa lint, verificações de tipos, testes e o build web no Node.js 22 e 24. O app nativo é compilado e seus fluxos do Maestro são executados localmente com o Xcode 27.1.

## Arquitetura

- **As rotas são arquivos.** `src/app` contém as telas e as API routes (Expo Router). O layout raiz mantém a tela de abertura enquanto a sessão salva é lida e depois mostra o grupo `(app)` ou `(auth)` por meio de `Stack.Protected`, de modo que um deep link não consegue abrir uma tela que exige login sem a sessão iniciada.
- **A API é feita de funções simples.** Cada arquivo `+api.ts` tem poucas linhas que chamam `src/server`: `http.ts` (leitura limitada do corpo, respostas JSON, mapeamento de erros), `accounts.ts`, `passwords.ts`, `sessions.ts`, `rate-limit.ts` e `tasks.ts`. `createServerApp()` conecta tudo isso; os testes criam uma instância nova a cada teste.
- **O armazenamento fica atrás de uma interface.** `TaskRepository` mantém as rotas independentes do lugar onde as tarefas ficam; a versão em memória é a padrão e o exemplo em SQLite mostra um banco de dados.
- **O estado do app é pequeno.** Os dados do servidor ficam no React Query; a sessão (token e conta) e as preferências (aparência, idioma) são dois stores do zustand; a sessão é salva com `expo-secure-store`, as preferências com o AsyncStorage, e ambas são validadas quando lidas de volta.
- **Os erros têm um único tipo.** A API responde `{ error: { code, message, fields } }`; o cliente transforma cada falha em um `ApiError` com um tipo (`network`, `timeout`, `http`, ...), e as telas o associam a uma frase traduzida. Os erros de campo são chaves de tradução, então as verificações da API aparecem sob o campo certo e no idioma certo.
- **Nada é registrado em log.** A regra `no-console` do ESLint é um erro no app e na API.

Execute as verificações localmente:

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## Antes da produção

A API mantém contas, sessões, tarefas e contadores de limite de requisições na memória de um único processo, dimensionada para uma demonstração: 1.000 contas e 100.000 tarefas. Uma reinicialização a esvazia, e várias instâncias do servidor não a compartilham. Antes de receber usuários reais, leve os armazenamentos para um banco de dados e os contadores de limite para um armazenamento compartilhado por todas as instâncias, repasse o endereço do cliente a partir do seu proxy e adicione a exclusão de conta e a redefinição de senha. O [guia de segurança](Documentation/Security.md#demo-server-or-production) lista cada passo.

## Roteiro

- Exclusão de conta e redefinição de senha, que a App Store Review e os usuários reais exigem.
- Contas e sessões persistentes junto ao repositório de tarefas em SQLite.
- Uma execução do Maestro para Android na CI, em um emulador.

## Como contribuir

Contribuições são bem-vindas. Leia o [guia de contribuição](CONTRIBUTING.md) e o [código de conduta](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) antes de abrir um pull request. Relate problemas de segurança de forma privada, como descrito na [política de segurança](SECURITY.md).

## Licença

Publicado sob a licença MIT. Veja [LICENSE](LICENSE).
