import { create } from 'zustand';
import { Article } from '@/types/article';

interface ArticleStore {
  articles: Article[];
  totalCount: number;
  addArticles: (newArticles: Article[]) => void;
  clearArticles: () => void;
  setTotalCount: (count: number) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  totalCount: 0,
  addArticles: (newArticles) =>
    set((state) => ({
      articles: [...newArticles, ...state.articles].slice(0, 500),
      totalCount: state.totalCount + newArticles.length,
    })),
  clearArticles: () => set({ articles: [], totalCount: 0 }),
  setTotalCount: (count) => set({ totalCount: count }),
}));
