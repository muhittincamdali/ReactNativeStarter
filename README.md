<div align="center">

# ⚡ ReactNativeStarter

**Enterprise-grade React Native boilerplate with Expo Router, Zustand & React Query**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React Native](https://img.shields.io/badge/React_Native-0.73+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-50+-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

- 📁 **Expo Router** — File-based navigation
- 🔄 **Zustand** — Lightweight state management
- 📊 **React Query** — Server state & caching
- 🎨 **NativeWind** — Tailwind for RN
- 🧪 **Testing** — Jest + Testing Library
- 🔐 **Auth Ready** — Auth flow included

---

## 🚀 Quick Start

```bash
# Clone and install
npx create-expo-app -t @muhittincamdali/react-native-starter my-app
cd my-app
npm install

# Run
npm start
```

```tsx
// Zustand store
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// React Query
const { data } = useQuery(['users'], fetchUsers);
```

---

## 📄 License

MIT • [@muhittincamdali](https://github.com/muhittincamdali)
