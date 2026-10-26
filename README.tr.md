<!-- i18n-source: README.md@7eb6261d552eca9666620ecbb98714f72b1ea22f status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/banner-light.svg" alt="React Native Starter: An Expo app with its own API: accounts, a task list, light and dark themes, two languages and tests."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/ReactNativeStarter/actions/workflows/ci.yml/badge.svg" alt="CI durumu"></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-version-light.svg" alt="Son sürüm: v1.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-language-light.svg" alt="Dil sürümü: Node.js 22.14+"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/badge-license-light.svg" alt="Lisans: MIT"></picture></a>
</p>

<p align="center">
<a href="#hızlı-başlangıç"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-start-tr-light.svg" alt="Başlayın"></picture></a>
<a href="https://muhittincamdali.github.io/ReactNativeStarter/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-docs-tr-light.svg" alt="Dokümantasyon"></picture></a>
<a href="https://github.com/muhittincamdali/ReactNativeStarter/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/ReactNativeStarter/main/.github/brand/button-examples-tr-light.svg" alt="Örnekler"></picture></a>
</p>

> Bu belge İngilizce README'nin çevirisidir. İkisi arasında fark varsa güncel olan İngilizce sürümdür.

<!-- brand:end -->

Başlangıç noktası olarak kullanabileceğiniz bir Expo uygulaması: iOS, Android ve web'de çalışır ve kendi backend'ini Expo Router API route'ları olarak taşır; böylece `npm ci` ve `npx expo start` komutlarından sonra, kurulacak başka bir sunucu olmadan kayıt, giriş ve görev listesi uçtan uca çalışır. Boş ekranlardan oluşan bir klasör yerine, ilk günden hesaplar, veri, temalar, çeviriler ve testlerle çalışan bir uygulama isteyen, okuyup değiştirebileceği TypeScript koduyla yazılmış bir başlangıç noktası arayan geliştiriciler içindir.

## Öne çıkanlar

- **Aynı projede bir backend** — `src/app/api` içindeki API route'ları kayıt olma, giriş yapma, çıkış yapma ile görev oluşturma, listeleme, güncelleme ve silme işlemlerini yürütür. Geliştirme sunucusu bunları uygulamanın yanında çalıştırır; `npm run build` ise bunları Node.js, EAS Hosting, Vercel, Netlify veya Cloudflare için dışa aktarır.
- **İki taraf için tek şema** — istek ve yanıt biçimleri `src/shared` içindeki zod şemalarıdır; API her gövdeyi bu şemalarla doğrular, uygulama da her yanıtı bu şemalarla ayrıştırır.
- **Özenle yapılmış hesaplar** — PBKDF2 parola özetleri (600.000 yineleme), yalnızca SHA-256 özeti olarak saklanan rastgele oturum token'ları, iOS Keychain ve Android Keystore'da tutulan token'lar, adres başına 15 dakikada beş başarısız girişe izin veren sınır ve yanlış adres ile yanlış parola için aynı yanıt.
- **Tasarım gereği sınırlı** — akış olarak okunan 16 KiB'lık istek gövdeleri, 1 MiB'lık yanıtlar, hesap başına 500 görev, en fazla 100 kayıtlık sayfalar, katı tamsayı sorgu parametreleri ve üst sınırı olan oturum ve sınırlayıcı tabloları: hiçbir istek sunucuyu daha fazla bellek tutmaya ya da daha uzun süre döngüde kalmaya zorlayamaz.
- **İnsanlar için hazır** — açık ve koyu temalar, tür güvenli anahtarlarla İngilizce ve Türkçe, çevrimdışı durumlara dayanıklı giriş, iyimser (optimistic) görev güncellemeleri, erişilebilirlik rolleri ve etiketleri ile 48 puntoluk dokunma hedefleri.
- **Şemadan ekrana kadar test edilmiş** — gerçek ekranları gerçek API işleyicilerine karşı aynı süreçte çalıştıran bir test dahil 219 Jest testi, ayrıca derlenmiş uygulamayı bir iOS simülatöründe çalıştıran Maestro akışları.

## Hızlı başlangıç

**1. Kodu alın**

```sh
git clone https://github.com/muhittincamdali/ReactNativeStarter.git my-app
cd my-app
npm ci
```

[Node.js](https://nodejs.org/) 22.14 veya üstü gerekir. Tarayıcıda denemek için başka hiçbir şeyi kurmanız gerekmez.

**2. Başlatın**

```sh
npx expo start
```

Bu komut uygulamayı ve API'sini birlikte başlatır. Tarayıcıda açmak için **w**, iOS simülatörü için **i**, Android emülatörü için **a** tuşuna basın ya da aynı ağdaki bir telefonda [Expo Go](https://expo.dev/go) uygulamasıyla QR kodunu tarayın.

**3. Kullanın**

**New here? Create an account** düğmesine dokunun, bir ad, bir e-posta adresi ve en az sekiz karakterlik bir parola girin; görev listenize ulaşırsınız. Bir görev ekleyin, tamamlamak için daireye dokunun ve koyu temayı ya da Türkçeyi denemek için **Settings** sekmesine geçin. `src/features/tasks/TasksScreen.tsx` dosyasını düzenleyin; kaydettiğiniz anda ekran güncellenir.

## Kurulum

Depo uygulamanın kendisidir: yukarıdaki gibi klonlayın, `rm -rf .git && git init` ile kendi geçmişinizi başlatın ve uygulamayı kendinize göre uyarlayın:

1. `app.json` içinde `name`, `slug`, `scheme`, `ios.bundleIdentifier` ve `android.package` değerlerini değiştirin.
2. `assets/icon.svg` dosyasını değiştirin ve tüm simgeleri bu dosyadan üretmek için `node scripts/render-icons.mjs` komutunu çalıştırın.
3. Renkleri `src/theme/index.ts` içinde, metinleri `src/lib/i18n/` içinde değiştirin.

Uygulamayı Expo Go yerine native bir geliştirme derlemesi olarak çalıştırmak için `npm run ios` (Xcode kurulu macOS) veya `npm run android` (Android Studio) komutunu kullanın.

## Kullanım

Aşağıdaki örnekler, `npm run typecheck` komutunun derlediği ve `npm test` komutunun çalıştırdığı [`Examples/`](Examples) klasöründen kopyalanmıştır.

### Bir API route'u ekleyin

`src/app/api` içinde `<name>+api.ts` adlı bir dosya `/api/<name>` isteğini yanıtlar. `handle()` fırlatılan bir `HttpError` hatasını kendi yanıtına çevirir, `authenticate()` ise yalnızca oturum açmış istekleri geçirir ([`Examples/task-stats/stats+api.ts`](Examples/task-stats/stats+api.ts)):

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

### Uygulamadan çağırın

API istemcisi oturum token'ını, bir süre sınırını ve bir boyut sınırını ekler, yanıtı da bir zod şemasıyla ayrıştırır; uyumsuzluk bir ekrana ulaşmak yerine `ApiError` olarak hata verir ([`Examples/task-stats/schema.ts`](Examples/task-stats/schema.ts)):

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

### Bir ekranda gösterin

Veriyi React Query yükler; `errorMessageKey()` her hatayı çevrilmiş bir cümleye dönüştürür ([`Examples/task-stats/TaskStatsCard.tsx`](Examples/task-stats/TaskStatsCard.tsx)):

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

### Görevleri bir veritabanında tutun

Görevler `TaskRepository` arayüzünden geçer. SQLite sürümü Node.js'in yerleşik `node:sqlite` modülünü kullanır ve bellek içi sürümle aynı sözleşme testlerinden geçer ([`Examples/sqlite-repository`](Examples/sqlite-repository)). Bunu `src/server/app.ts` içindeki `createServerApp()` fonksiyonunda yerine koyun:

```ts
tasks: new SqliteTaskRepository('data/tasks.db', { maxPerUser: MAX_TASKS_PER_USER }),
```

## Demo

| Giriş                                                     | Görevler                                                 | Ayarlar                                               |
| --------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| ![Giriş ekranı, açık tema](docs/images/sign-in-light.png) | ![Görev listesi, açık tema](docs/images/tasks-light.png) | ![Ayarlar, açık tema](docs/images/settings-light.png) |
| ![Giriş ekranı, koyu tema](docs/images/sign-in-dark.png)  | ![Görev listesi, koyu tema](docs/images/tasks-dark.png)  | ![Ayarlar, koyu tema](docs/images/settings-dark.png)  |

Ekran görüntüleri, iOS 27 yüklü bir iPhone 17 Pro simülatöründeki Release derlemesinden, `npm run build && npm run serve` ile çalışan üretim sunucusuna bağlanarak [`scripts/capture-screenshots.sh`](scripts/capture-screenshots.sh) betiğiyle alınmıştır. Betik, kayıt olan, üç görev ekleyen ve birini tamamlayan [Maestro akışını](.maestro/sign-up-and-tasks.yaml) çalıştırır.

## Dokümantasyon

API başvuru belgeleri ve makaleler:

- [API başvurusu](https://muhittincamdali.github.io/ReactNativeStarter/) — paylaşılan şemalar ve sınırlar, API istemcisi, oturum, çeviriler ve sunucu modülleri; kaynak kodundaki yorumlardan TypeDoc ile üretilir.
- [CHANGELOG.md](CHANGELOG.md) — her sürümde nelerin değiştiği.

## Rehberler

- [Başlarken](https://muhittincamdali.github.io/ReactNativeStarter/documents/Getting_started.html) — uygulamayı her yerde çalıştırma, klasör yapısı, betikler ve uygulamayı yeniden adlandırma.
- [Özellik ekleme](https://muhittincamdali.github.io/ReactNativeStarter/documents/Adding_a_feature.html) — bir şema, bir API route'u, bir istemci çağrısı, bir ekran ve bunların testleri.
- [Yayına alma](https://muhittincamdali.github.io/ReactNativeStarter/documents/Deploying.html) — API'yi sunma, veriyi saklama, uygulamaları API'ye yönlendirme ve EAS ile derleme.
- [Güvenlik](https://muhittincamdali.github.io/ReactNativeStarter/documents/Security.html) — başlangıç şablonunun nelere karşı koruma sağladığı ve nelerin size bırakıldığı.

Aynı rehberler Markdown olarak [`Documentation/`](Documentation) klasöründe de bulunur.

## Gereksinimler

| Araç zinciri | En düşük sürüm                                              |
| ------------ | ----------------------------------------------------------- |
| Node.js      | 22.14                                                       |
| Expo SDK     | 58 (React Native 0.88, React 19.3)                          |
| iOS          | 16.4, Expo SDK 58'in dağıtım hedefi (iOS 27'de test edildi) |
| Android      | 7.0 (API düzeyi 24), React Native 0.88'in en düşük sürümü   |

CI; lint, tür denetimleri, testler ve web derlemesini Node.js 22 ve 24 üzerinde çalıştırır. Native uygulama Xcode 27.1 ile yerelde derlenir ve Maestro akışları da yerelde çalıştırılır.

## Mimari

- **Route'lar dosyadır.** `src/app` ekranları ve API route'larını barındırır (Expo Router). Kök layout, kayıtlı oturum okunurken açılış ekranını açık tutar; ardından `Stack.Protected` ile `(app)` ya da `(auth)` grubunu gösterir, böylece bir deep link oturum açılmamışken oturum gerektiren bir ekranı açamaz.
- **API düz fonksiyonlardır.** Her `+api.ts` dosyası, `src/server` içindekileri çağıran birkaç satırdan oluşur: `http.ts` (sınırlı gövde okuma, JSON yanıtları, hata eşleme), `accounts.ts`, `passwords.ts`, `sessions.ts`, `rate-limit.ts` ve `tasks.ts`. `createServerApp()` bunları birbirine bağlar; testler her test için yeni bir tane oluşturur.
- **Depolama bir arayüzün arkasındadır.** `TaskRepository`, route'ları görevlerin nerede tutulduğundan bağımsız kılar; varsayılan bellek içi sürümdür, SQLite örneği ise bir veritabanını gösterir.
- **Uygulamanın durumu küçüktür.** Sunucu verisi React Query'de durur; oturum (token ve hesap) ile tercihler (görünüm, dil) iki zustand store'udur. Oturum `expo-secure-store` ile, tercihler AsyncStorage ile kaydedilir ve her ikisi de geri okunurken doğrulanır.
- **Hataların tek bir türü vardır.** API `{ error: { code, message, fields } }` yanıtını verir; istemci her hatayı bir türü (`network`, `timeout`, `http`, ...) olan bir `ApiError`'a dönüştürür, ekranlar da onu çevrilmiş bir cümleyle eşler. Alan hataları çeviri anahtarlarıdır, böylece API'nin denetimleri doğru alanın altında, doğru dilde görünür.
- **Hiçbir şey loglanmaz.** ESLint'in `no-console` kuralı uygulamada ve API'de hatadır.

Denetimleri yerelde çalıştırmak için:

```sh
npm run lint && npm run typecheck && npm test && npm run build
npm run ios          # development build on a simulator, then in another terminal:
npm run e2e:ios      # Maestro flows (sign-up, tasks, settings, form validation)
```

## Yol haritası

- Hesap silme ve parola sıfırlama; App Store Review ve gerçek kullanıcılar bunlara ihtiyaç duyar.
- SQLite görev deposunun yanında kalıcı hesaplar ve oturumlar.
- CI'da bir emülatör üzerinde Android Maestro çalıştırması.

## Katkıda bulunma

Katkılarınızı bekliyoruz. Pull request açmadan önce [katkı rehberini](CONTRIBUTING.md) ve [davranış kurallarını](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) okuyun. Güvenlik açıklarını [güvenlik politikasında](SECURITY.md) anlatıldığı gibi gizli olarak bildirin.

## Lisans

MIT lisansıyla yayımlanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.
