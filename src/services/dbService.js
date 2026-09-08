import { isFirebaseConfigured } from '@/lib/firebase';

import { postService } from './postService';
import { categoryService } from './categoryService';
import { commentService } from './commentService';
import { analyticsService } from './analyticsService';
import { pageService } from './pageService';
import { configService } from './configService';

// Fallback method for LocalStorage cleanup during init (kept from old code)
if (typeof window !== 'undefined') {
  Object.keys(localStorage).forEach(k => {
    if (
      k.startsWith('scholarcms_') &&
      k !== 'scholarcms_theme' &&
      !k.startsWith('scholarcms_plugin_') &&
      !k.startsWith('scholarcms_custom_plugin_') &&
      !k.startsWith('scholarcms_palette_') &&
      !k.startsWith('scholarcms_dashboard_')
    ) {
      localStorage.removeItem(k);
    }
  });
}

// PUBLIC API DATA SERVICE (FACADE PATTERN)
export const dbService = {
  isRealFirebase() {
    return isFirebaseConfigured();
  },

  // POSTS
  getPosts: (options) => postService.getPosts(options),
  getPostBySlug: (slug, inc) => postService.getPostBySlug(slug, inc),
  getPostById: (id) => postService.getPostById(id),
  savePost: (data) => postService.savePost(data),
  deletePost: (id) => postService.deletePost(id),

  // CATEGORIES
  getCategories: () => categoryService.getCategories(),
  createCategory: (data) => categoryService.createCategory(data),
  saveCategory: (data) => categoryService.saveCategory(data),
  deleteCategory: (id) => categoryService.deleteCategory(id),
  ensureCategoryExists: (cat, parent) => categoryService.ensureCategoryExists(cat, parent),

  // COMMENTS
  getComments: (postId) => commentService.getComments(postId),
  addComment: (data) => commentService.addComment(data),
  updateCommentStatus: (id, status) => commentService.updateCommentStatus(id, status),
  deleteComment: (id) => commentService.deleteComment(id),

  // ANALYTICS & OVERVIEW
  getAnalytics: () => analyticsService.getAnalytics(),
  trackPageview: (url, ref) => analyticsService.trackPageview(url, ref),
  getAnalyticsSeries: (days) => analyticsService.getAnalyticsSeries(days),
  resetDemoData: () => analyticsService.resetDemoData(),

  // PAGES
  seedDefaultPagesToFirestore: () => pageService.seedDefaultPagesToFirestore(),
  getPages: () => pageService.getPages(),
  getPageBySlug: (slug) => pageService.getPageBySlug(slug),
  getPageById: (id) => pageService.getPageById(id),
  savePage: (data) => pageService.savePage(data),
  deletePage: (id) => pageService.deletePage(id),

  // CONFIG (AdSense, General, Menus, Themes, Plugins, Newsletter, Dashboard, User)
  getAdSenseSettings: () => configService.getAdSenseSettings(),
  saveAdSenseSettings: (data) => configService.saveAdSenseSettings(data),
  
  getGeneralSettings: () => configService.getGeneralSettings(),
  saveGeneralSettings: (data) => configService.saveGeneralSettings(data),
  
  getMenu: (loc) => configService.getMenu(loc),
  saveMenu: (loc, items) => configService.saveMenu(loc, items),
  
  getActiveTheme: () => configService.getActiveTheme(),
  setActiveTheme: (id) => configService.setActiveTheme(id),
  saveThemeCustomizations: (data) => configService.saveThemeCustomizations(data),
  getCustomThemePackages: () => configService.getCustomThemePackages(),
  saveCustomThemePackage: (data) => configService.saveCustomThemePackage(data),
  
  getPluginStates: () => configService.getPluginStates(),
  togglePluginStatus: (id, en) => configService.togglePluginStatus(id, en),
  getPluginSettings: (id) => configService.getPluginSettings(id),
  savePluginSettings: (id, data) => configService.savePluginSettings(id, data),
  getCustomPluginPackages: () => configService.getCustomPluginPackages(),
  saveCustomPluginPackage: (data) => configService.saveCustomPluginPackage(data),
  
  getSubscribers: () => configService.getSubscribers(),
  addSubscriber: (data) => configService.addSubscriber(data),
  
  getDashboardWidgetLayout: () => configService.getDashboardWidgetLayout(),
  saveDashboardWidgetLayout: (data) => configService.saveDashboardWidgetLayout(data),
  
  getCurrentUser: () => configService.getCurrentUser()
};
