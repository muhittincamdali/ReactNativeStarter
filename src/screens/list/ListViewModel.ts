/**
 * List View Model
 *
 * Manages state and business logic for the List screen.
 * Handles data fetching, search, filtering, and pagination.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';

/**
 * List item model
 */
export interface ListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  rating: number;
  viewCount: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filter option
 */
export interface ListFilter {
  id: string;
  label: string;
  icon: string;
  count: number;
}

/**
 * Sort option
 */
export type SortOption = 'newest' | 'oldest' | 'popular' | 'rating';

interface UseListViewModelReturn {
  items: ListItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filters: ListFilter[];
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasNextPage: boolean;
  toggleFavorite: (id: string) => void;
}

// Mock data generator for demo purposes
function generateMockItems(count: number, page: number): ListItem[] {
  const categories = ['Technology', 'Design', 'Business', 'Health', 'Travel'];
  const tagPool = [
    'react-native',
    'typescript',
    'mobile',
    'ios',
    'android',
    'ui',
    'ux',
    'api',
    'graphql',
    'rest',
  ];

  return Array.from({ length: count }, (_, i) => {
    const index = (page - 1) * count + i;
    const category = categories[index % categories.length];

    return {
      id: `item-${index + 1}`,
      title: getItemTitle(index, category),
      description: getItemDescription(index, category),
      category,
      image:
        index % 3 === 0
          ? `https://picsum.photos/seed/${index + 1}/400/240`
          : undefined,
      author: {
        name: getAuthorName(index),
        avatar: `https://i.pravatar.cc/80?img=${(index % 70) + 1}`,
      },
      tags: tagPool
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1),
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      viewCount: Math.floor(Math.random() * 10000) + 100,
      isFavorite: index % 5 === 0,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
  });
}

function getItemTitle(index: number, category: string): string {
  const titles: Record<string, string[]> = {
    Technology: [
      'Building Scalable Mobile Apps',
      'Mastering TypeScript Generics',
      'React Native Performance Tips',
      'State Management Deep Dive',
      'CI/CD for Mobile Teams',
    ],
    Design: [
      'Design System Fundamentals',
      'Color Theory for Developers',
      'Micro-interactions That Delight',
      'Accessible UI Patterns',
      'Responsive Mobile Layouts',
    ],
    Business: [
      'Startup Growth Strategies',
      'Product Market Fit Guide',
      'Remote Team Management',
      'Agile at Scale',
      'Developer Productivity Hacks',
    ],
    Health: [
      'Ergonomics for Developers',
      'Managing Screen Time',
      'Exercise Routines for Desk Workers',
      'Healthy Snacking at Work',
      'Sleep Optimization Tips',
    ],
    Travel: [
      'Best Cities for Remote Work',
      'Digital Nomad Essentials',
      'Coworking Spaces Around the World',
      'Travel Tech Gear Guide',
      'Productivity While Traveling',
    ],
  };

  const categoryTitles = titles[category] || titles.Technology;
  return categoryTitles[index % categoryTitles.length];
}

function getItemDescription(index: number, _category: string): string {
  const descriptions = [
    'A comprehensive guide covering modern best practices and proven patterns used by top engineering teams.',
    'Explore advanced techniques and practical examples that you can apply to your projects right away.',
    'Learn the fundamentals and dive into real-world scenarios with step-by-step instructions.',
    'Discover the latest trends and tools that are shaping the industry in 2024 and beyond.',
    'A hands-on tutorial with code examples, performance benchmarks, and production tips.',
  ];
  return descriptions[index % descriptions.length];
}

function getAuthorName(index: number): string {
  const names = [
    'Sarah Chen',
    'Alex Rivera',
    'Jordan Kim',
    'Morgan Lee',
    'Taylor Swift',
    'Casey Jones',
    'Riley Adams',
    'Quinn Murphy',
    'Drew Parker',
    'Sage Williams',
  ];
  return names[index % names.length];
}

const PAGE_SIZE = 10;
const TOTAL_PAGES = 5;

export function useListViewModel(): UseListViewModelReturn {
  const [allItems, setAllItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Simulate initial data load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      const items = generateMockItems(PAGE_SIZE, 1);
      setAllItems(items);
      setCurrentPage(1);
      setHasNextPage(true);
    } catch (err) {
      setError('Failed to load items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter definitions
  const filters: ListFilter[] = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    allItems.forEach((item) => {
      categoryCounts[item.category] =
        (categoryCounts[item.category] || 0) + 1;
    });

    return [
      { id: 'all', label: 'All', icon: 'apps-outline', count: allItems.length },
      {
        id: 'Technology',
        label: 'Tech',
        icon: 'code-outline',
        count: categoryCounts['Technology'] || 0,
      },
      {
        id: 'Design',
        label: 'Design',
        icon: 'color-palette-outline',
        count: categoryCounts['Design'] || 0,
      },
      {
        id: 'Business',
        label: 'Business',
        icon: 'briefcase-outline',
        count: categoryCounts['Business'] || 0,
      },
      {
        id: 'Health',
        label: 'Health',
        icon: 'fitness-outline',
        count: categoryCounts['Health'] || 0,
      },
      {
        id: 'Travel',
        label: 'Travel',
        icon: 'airplane-outline',
        count: categoryCounts['Travel'] || 0,
      },
    ];
  }, [allItems]);

  // Filtered and sorted items
  const items = useMemo(() => {
    let filtered = [...allItems];

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.author.name.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply sort
    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [allItems, activeFilter, searchQuery, sortBy]);

  // Refetch all data
  const refetch = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const refreshed = generateMockItems(PAGE_SIZE, 1);
      setAllItems(refreshed);
      setCurrentPage(1);
      setHasNextPage(true);
    } catch (err) {
      setError('Failed to refresh. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Load more items
  const loadMore = useCallback(async () => {
    if (!hasNextPage) return;

    const nextPage = currentPage + 1;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (nextPage > TOTAL_PAGES) {
        setHasNextPage(false);
        return;
      }

      const moreItems = generateMockItems(PAGE_SIZE, nextPage);
      setAllItems((prev) => [...prev, ...moreItems]);
      setCurrentPage(nextPage);
      setHasNextPage(nextPage < TOTAL_PAGES);
    } catch (err) {
      console.error('Error loading more items:', err);
    }
  }, [currentPage, hasNextPage]);

  // Toggle favorite
  const toggleFavorite = useCallback((id: string) => {
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  }, []);

  return {
    items,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filters,
    sortBy,
    setSortBy,
    refetch,
    loadMore,
    hasNextPage,
    toggleFavorite,
  };
}
